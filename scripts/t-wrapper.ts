#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export interface ScriptConfig {
  sourcePattern?: string;
  translationImportSource?: string;
  dryRun?: boolean;
  /**
   * 상수로 인식할 네이밍 패턴 (접미사)
   * 예: ['_ITEMS', '_MENU', '_CONFIG', '_FIELDS']
   * 비어있으면 모든 ALL_CAPS/PascalCase를 상수로 인식
   */
  constantPatterns?: string[];
}

const DEFAULT_CONFIG: Required<ScriptConfig> = {
  sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
  translationImportSource: "i18nexus",
  dryRun: false,
  constantPatterns: [], // 기본값: 모든 상수 허용
};

export class TranslationWrapper {
  private config: Required<ScriptConfig>;
  // 상수 분석 결과 저장: 변수명 -> 렌더링 가능한 속성들
  private constantsWithRenderableProps: Map<string, Set<string>> = new Map();
  // Import 매핑: 변수명 -> 파일 경로
  private importedConstants: Map<string, string> = new Map();
  // 분석된 외부 파일 캐시 (중복 분석 방지)
  private analyzedExternalFiles: Set<string> = new Set();

  constructor(config: Partial<ScriptConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private createUseTranslationHook(): t.VariableDeclaration {
    // useTranslation()을 빈 값으로 호출 - 내부적으로 현재 언어 자동 주입
    const hookCall = t.callExpression(t.identifier("useTranslation"), []);

    return t.variableDeclaration("const", [
      t.variableDeclarator(
        t.objectPattern([
          t.objectProperty(t.identifier("t"), t.identifier("t"), false, true),
        ]),
        hookCall
      ),
    ]);
  }

  /**
   * i18n-ignore 주석이 노드 바로 위에 있는지 확인
   * 파일의 원본 소스코드를 직접 검사하여 주석 감지
   */
  private hasIgnoreComment(path: NodePath, sourceCode?: string): boolean {
    const node = path.node;

    // 1. AST의 leadingComments 확인
    if (node.leadingComments) {
      const hasIgnore = node.leadingComments.some(
        (comment) =>
          comment.value.trim() === "i18n-ignore" ||
          comment.value.trim().startsWith("i18n-ignore")
      );
      if (hasIgnore) return true;
    }

    // 2. 부모 노드의 leadingComments 확인
    if (path.parentPath?.node?.leadingComments) {
      const hasIgnore = path.parentPath.node.leadingComments.some(
        (comment) =>
          comment.value.trim() === "i18n-ignore" ||
          comment.value.trim().startsWith("i18n-ignore")
      );
      if (hasIgnore) return true;
    }

    // 3. 소스코드 직접 검사 (node.loc가 있는 경우)
    if (sourceCode && node.loc) {
      const startLine = node.loc.start.line;
      const lines = sourceCode.split("\n");

      // 현재 라인과 바로 위 라인 검사
      for (let i = Math.max(0, startLine - 3); i < startLine; i++) {
        const line = lines[i];
        if (
          line &&
          (line.includes("i18n-ignore") ||
            line.includes("// i18n-ignore") ||
            line.includes("/* i18n-ignore") ||
            line.includes("{/* i18n-ignore"))
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private shouldSkipPath(path: NodePath<t.StringLiteral>): boolean {
    // i18n-ignore 주석이 있는 경우 스킵
    if (this.hasIgnoreComment(path)) {
      return true;
    }

    // 부모 노드에 i18n-ignore 주석이 있는 경우도 스킵
    if (path.parent && this.hasIgnoreComment(path.parentPath as NodePath)) {
      return true;
    }

    // t() 함수로 이미 래핑된 경우 스킵
    if (
      t.isCallExpression(path.parent) &&
      t.isIdentifier(path.parent.callee, { name: "t" })
    ) {
      return true;
    }

    // import 구문은 스킵
    const importParent = path.findParent((p) => t.isImportDeclaration(p.node));
    if (importParent?.node && t.isImportDeclaration(importParent.node)) {
      return true;
    }

    // 객체 프로퍼티 키는 스킵 (하지만 한국어 텍스트는 제외)
    if (
      t.isObjectProperty(path.parent) &&
      path.parent.key === path.node &&
      !/[가-힣]/.test(path.node.value)
    ) {
      return true;
    }

    return false;
  }

  /**
   * 변수명이 상수 패턴인지 판단 (대문자 시작 또는 ALL_CAPS)
   * 외부 import된 상수를 감지하기 위한 휴리스틱
   */
  /**
   * 상수처럼 보이는 변수명인지 판단 (휴리스틱)
   * config의 constantPatterns가 설정되어 있으면 해당 패턴만 허용
   */
  private looksLikeConstant(varName: string): boolean {
    // constantPatterns가 설정되어 있으면 패턴 체크
    if (this.config.constantPatterns.length > 0) {
      return this.config.constantPatterns.some((pattern) => {
        // 접미사 패턴 (예: _ITEMS, _MENU)
        if (pattern.startsWith("_")) {
          return varName.endsWith(pattern);
        }
        // 접두사 패턴 (예: UI_, RENDER_)
        else if (pattern.endsWith("_")) {
          return varName.startsWith(pattern);
        }
        // 포함 패턴 (예: MENU, ITEMS)
        else {
          return varName.includes(pattern);
        }
      });
    }

    // constantPatterns가 비어있으면 기본 휴리스틱 사용
    // ALL_CAPS 패턴 (예: NAV_ITEMS, BUTTON_CONFIG)
    if (/^[A-Z][A-Z0-9_]*$/.test(varName)) {
      return true;
    }

    // PascalCase 패턴 (예: NavItems, ButtonConfig)
    // 하지만 React 컴포넌트와 구분하기 위해 좀 더 엄격하게
    // Items, Config 등으로 끝나는 경우만
    if (
      /^[A-Z][a-z]+(?:[A-Z][a-z]+)*(Items|Config|Data|List|Menu|Options|Settings)$/.test(
        varName
      )
    ) {
      return true;
    }

    return false;
  }

  /**
   * 렌더링될 가능성이 있는 속성명인지 판단
   */
  private isRenderablePropertyName(propName: string): boolean {
    const renderableKeywords = [
      "label",
      "title",
      "text",
      "name",
      "placeholder",
      "description",
      "content",
      "message",
      "tooltip",
      "hint",
      "caption",
      "subtitle",
      "heading",
    ];

    const lowerPropName = propName.toLowerCase();
    return renderableKeywords.some((keyword) =>
      lowerPropName.includes(keyword)
    );
  }

  /**
   * Import 문에서 import된 변수와 파일 경로를 매핑
   */
  private parseImports(ast: t.File, currentFilePath: string): void {
    traverse(ast, {
      ImportDeclaration: (path) => {
        const importPath = path.node.source.value;

        // 상대 경로만 처리 (외부 라이브러리 제외)
        if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
          return;
        }

        // 절대 경로로 변환
        const currentDir = this.getDirectoryPath(currentFilePath);
        const absolutePath = this.resolveImportPath(importPath, currentDir);

        // Import된 변수들 매핑
        path.node.specifiers.forEach((specifier) => {
          if (
            t.isImportSpecifier(specifier) &&
            t.isIdentifier(specifier.imported)
          ) {
            const importedName = specifier.imported.name;
            this.importedConstants.set(importedName, absolutePath);
          } else if (t.isImportDefaultSpecifier(specifier)) {
            const importedName = specifier.local.name;
            this.importedConstants.set(importedName, absolutePath);
          }
        });
      },
    });
  }

  /**
   * Import 경로를 절대 경로로 변환
   */
  private resolveImportPath(importPath: string, currentDir: string): string {
    // ./constants → /abs/path/constants.ts
    // ../utils/constants → /abs/path/utils/constants.ts
    let resolvedPath = path.resolve(currentDir, importPath);

    // 확장자가 없으면 .ts, .tsx, .js, .jsx 순서로 찾기
    if (!path.extname(resolvedPath)) {
      const extensions = [".ts", ".tsx", ".js", ".jsx"];
      for (const ext of extensions) {
        if (fs.existsSync(resolvedPath + ext)) {
          return resolvedPath + ext;
        }
      }
      // index 파일 체크
      for (const ext of extensions) {
        const indexPath = path.join(resolvedPath, "index" + ext);
        if (fs.existsSync(indexPath)) {
          return indexPath;
        }
      }
    }

    return resolvedPath;
  }

  /**
   * 파일 경로에서 디렉토리 경로 추출
   */
  private getDirectoryPath(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * API 데이터나 동적 데이터인지 확인
   * 동적 데이터는 상수 분석에서 제외됨
   */
  private isDynamicData(path: NodePath<t.VariableDeclaration>): boolean {
    // let, var 선언은 동적 데이터로 간주
    if (path.node.kind !== "const") {
      return true;
    }

    // useState, useEffect 등 훅 내부인지 확인
    const declarations = path.node.declarations;
    for (const declarator of declarations) {
      if (declarator.init) {
        // useState, useQuery, fetch, axios 등의 패턴
        if (t.isCallExpression(declarator.init)) {
          const callee = declarator.init.callee;

          // useState, useQuery, useMutation, useEffect, useCallback, useMemo 등
          if (
            t.isIdentifier(callee) &&
            (callee.name.startsWith("use") ||
              callee.name === "fetch" ||
              callee.name === "axios")
          ) {
            return true;
          }

          // fetch().then(), axios.get() 등의 MemberExpression
          if (t.isMemberExpression(callee)) {
            const object = callee.object;
            if (
              t.isIdentifier(object) &&
              (object.name === "fetch" ||
                object.name === "axios" ||
                object.name === "api")
            ) {
              return true;
            }
          }
        }

        // await 표현식 (await fetch(), await axios() 등)
        if (t.isAwaitExpression(declarator.init)) {
          return true;
        }

        // 배열/객체 destructuring에서 오는 데이터
        // 예: const [data, setData] = useState() - 이미 위에서 잡히지만 추가 안전장치
        if (
          t.isArrayPattern(declarator.id) ||
          t.isObjectPattern(declarator.id)
        ) {
          return true;
        }

        // .then(), .catch() 체이닝
        if (t.isCallExpression(declarator.init)) {
          const callee = declarator.init.callee;
          if (
            t.isMemberExpression(callee) &&
            t.isIdentifier(callee.property) &&
            (callee.property.name === "then" ||
              callee.property.name === "catch" ||
              callee.property.name === "finally")
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * 변수가 Props나 함수 파라미터에서 온 것인지 확인
   * 배열 메서드의 콜백 파라미터는 제외 (예: map, filter)
   */
  private isFromPropsOrParams(varName: string, scope: any): boolean {
    const binding = scope.getBinding(varName);

    if (!binding) {
      return false;
    }

    const bindingPath = binding.path;

    // 함수 파라미터인 경우
    if (bindingPath.isIdentifier()) {
      const parent = bindingPath.parentPath;

      // 함수 선언의 파라미터
      if (
        parent &&
        (parent.isFunctionDeclaration() ||
          parent.isFunctionExpression() ||
          parent.isArrowFunctionExpression())
      ) {
        // map, filter, forEach 등의 콜백 파라미터는 제외
        // 예: NAV_ITEMS.map((item) => ...) 에서 item은 배열 요소이므로 처리해야 함
        const grandParent = parent.parentPath;
        if (grandParent && t.isCallExpression(grandParent.node)) {
          const callee = grandParent.node.callee;
          if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
            const methodName = callee.property.name;
            const arrayMethods = [
              "map",
              "filter",
              "forEach",
              "find",
              "some",
              "every",
              "reduce",
              "flatMap",
            ];
            if (arrayMethods.includes(methodName)) {
              // 배열 메서드의 콜백 파라미터는 props/params가 아님
              return false;
            }
          }
        }

        // React 컴포넌트의 props 파라미터인지 확인
        const funcParent = parent.node;
        if (funcParent && "params" in funcParent) {
          const params = funcParent.params;
          // 첫 번째 파라미터는 보통 props
          if (params.length > 0 && params[0] === bindingPath.node) {
            return true;
          }

          // 객체 destructuring props도 확인
          // 예: function Component({ items }) 또는 ({ items }) =>
          if (
            params.length > 0 &&
            t.isObjectPattern(params[0]) &&
            params[0].properties.some((prop) => {
              if (t.isObjectProperty(prop) && t.isIdentifier(prop.value)) {
                return prop.value.name === varName;
              }
              return false;
            })
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * 외부 파일에서 export된 상수 분석
   */
  private analyzeExternalFile(filePath: string): void {
    // 이미 분석한 파일이면 스킵
    if (this.analyzedExternalFiles.has(filePath)) {
      return;
    }

    // 파일이 존재하지 않으면 스킵
    if (!fs.existsSync(filePath)) {
      return;
    }

    this.analyzedExternalFiles.add(filePath);

    try {
      const code = fs.readFileSync(filePath, "utf-8");
      const ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript", "decorators-legacy"],
        attachComment: true, // 주석을 AST에 첨부
      });

      traverse(ast, {
        // export const NAV_ITEMS = [...] 형태
        ExportNamedDeclaration: (path) => {
          if (
            path.node.declaration &&
            t.isVariableDeclaration(path.node.declaration)
          ) {
            // VariableDeclaration 노드를 직접 분석
            const varDeclPath = path.get(
              "declaration"
            ) as NodePath<t.VariableDeclaration>;
            this.analyzeConstantDeclaration(varDeclPath);
          }
        },
        // 일반 const 선언도 분석 (export 안된 것)
        VariableDeclaration: (path) => {
          // ExportNamedDeclaration 내부가 아닌 경우만
          if (!t.isExportNamedDeclaration(path.parent)) {
            this.analyzeConstantDeclaration(path);
          }
        },
      });

      console.log(`     📦 Analyzed external file: ${path.basename(filePath)}`);
    } catch (error) {
      console.warn(
        `     ⚠️  Failed to analyze external file ${filePath}:`,
        error
      );
    }
  }

  /**
   * Import된 모든 외부 파일 분석
   */
  private analyzeImportedFiles(): void {
    const filesToAnalyze = new Set(this.importedConstants.values());

    filesToAnalyze.forEach((filePath) => {
      this.analyzeExternalFile(filePath);
    });
  }

  /**
   * 상수 선언을 분석하여 렌더링 가능한 속성을 찾음
   * 1 depth만 탐색, API 데이터는 제외
   */
  private analyzeConstantDeclaration(
    path: NodePath<t.VariableDeclaration>
  ): void {
    // const 선언만 분석
    if (path.node.kind !== "const") {
      return;
    }

    // API 데이터나 동적 데이터는 제외
    if (this.isDynamicData(path)) {
      return;
    }

    path.node.declarations.forEach((declarator) => {
      if (!t.isIdentifier(declarator.id)) {
        return;
      }

      const varName = declarator.id.name;

      // 네이밍 패턴 체크 제거 - 한국어 유무로만 판단
      // 소문자 변수도 한국어가 있으면 처리

      const renderableProps = new Set<string>();

      // 배열인 경우
      if (t.isArrayExpression(declarator.init)) {
        declarator.init.elements.forEach((element) => {
          if (element && t.isObjectExpression(element)) {
            // 1 depth: 배열 내 객체의 속성들 확인
            element.properties.forEach((prop) => {
              if (t.isObjectProperty(prop)) {
                let propName: string | null = null;

                if (t.isIdentifier(prop.key)) {
                  propName = prop.key.name;
                } else if (t.isStringLiteral(prop.key)) {
                  propName = prop.key.value;
                }

                // 속성 값이 한국어 문자열이고 렌더링 가능한 속성인 경우
                if (
                  propName &&
                  t.isStringLiteral(prop.value) &&
                  /[가-힣]/.test(prop.value.value) &&
                  this.isRenderablePropertyName(propName)
                ) {
                  renderableProps.add(propName);
                }
              }
            });
          }
        });
      }
      // 객체인 경우
      else if (t.isObjectExpression(declarator.init)) {
        declarator.init.properties.forEach((prop) => {
          if (t.isObjectProperty(prop)) {
            let propName: string | null = null;

            if (t.isIdentifier(prop.key)) {
              propName = prop.key.name;
            } else if (t.isStringLiteral(prop.key)) {
              propName = prop.key.value;
            }

            // 속성 값이 한국어 문자열이고 렌더링 가능한 속성인 경우
            if (
              propName &&
              t.isStringLiteral(prop.value) &&
              /[가-힣]/.test(prop.value.value) &&
              this.isRenderablePropertyName(propName)
            ) {
              renderableProps.add(propName);
            }
          }
        });
      }

      // 렌더링 가능한 속성이 있으면 저장
      if (renderableProps.size > 0) {
        this.constantsWithRenderableProps.set(varName, renderableProps);
      }
    });
  }

  /**
   * 함수가 getServerTranslation으로 감싸진 서버 컴포넌트인지 확인
   */
  private isServerComponent(path: NodePath<t.Function>): boolean {
    // 함수 body 내에서 getServerTranslation 호출이 있는지 확인
    let hasServerTranslation = false;

    path.traverse({
      CallExpression: (callPath) => {
        if (
          t.isIdentifier(callPath.node.callee, {
            name: "getServerTranslation",
          }) ||
          (t.isAwaitExpression(callPath.parent) &&
            t.isCallExpression(callPath.node) &&
            t.isIdentifier(callPath.node.callee, {
              name: "getServerTranslation",
            }))
        ) {
          hasServerTranslation = true;
          callPath.stop(); // 찾았으면 더 이상 탐색하지 않음
        }
      },
    });

    return hasServerTranslation;
  }

  private processFunctionBody(
    path: NodePath<t.Function>,
    sourceCode: string
  ): { wasModified: boolean; isServerComponent: boolean } {
    let wasModified = false;
    const isServerComponent = this.isServerComponent(path);

    path.traverse({
      StringLiteral: (subPath) => {
        if (
          this.shouldSkipPath(subPath) ||
          this.hasIgnoreComment(subPath, sourceCode)
        ) {
          return;
        }

        // 빈 문자열이나 공백만 있는 문자열은 스킵
        const trimmedValue = subPath.node.value.trim();
        if (!trimmedValue) {
          return;
        }

        // 한국어 텍스트가 포함된 문자열만 처리
        if (/[가-힣]/.test(subPath.node.value)) {
          wasModified = true;
          const replacement = t.callExpression(t.identifier("t"), [
            t.stringLiteral(subPath.node.value),
          ]);

          if (t.isJSXAttribute(subPath.parent)) {
            subPath.replaceWith(t.jsxExpressionContainer(replacement));
          } else {
            subPath.replaceWith(replacement);
          }
        }
      },
      TemplateLiteral: (subPath) => {
        // i18n-ignore 주석이 있는 경우 스킵
        if (
          this.shouldSkipPath(subPath as any) ||
          this.hasIgnoreComment(subPath, sourceCode)
        ) {
          return;
        }

        // 이미 t()로 래핑된 경우 스킵
        if (
          t.isCallExpression(subPath.parent) &&
          t.isIdentifier(subPath.parent.callee, { name: "t" })
        ) {
          return;
        }

        // 템플릿 리터럴의 모든 부분에 한국어가 있는지 확인
        const hasKorean = subPath.node.quasis.some((quasi) =>
          /[가-힣]/.test(quasi.value.raw)
        );

        if (!hasKorean) {
          return;
        }

        // 템플릿 리터럴을 i18next interpolation 형식으로 변환
        // 예: `안녕 ${name}` → t(`안녕 {{name}}`, { name })
        wasModified = true;

        const templateNode = subPath.node;
        const expressions = templateNode.expressions;
        const quasis = templateNode.quasis;

        // 표현식이 없으면 단순 문자열로 처리
        if (expressions.length === 0) {
          const replacement = t.callExpression(t.identifier("t"), [
            t.stringLiteral(quasis[0].value.raw),
          ]);
          subPath.replaceWith(replacement);
          return;
        }

        // i18next 형식으로 변환: `안녕 ${name}` → `안녕 {{name}}`
        let i18nextString = "";
        const interpolationVars: t.ObjectProperty[] = [];

        quasis.forEach((quasi, index) => {
          i18nextString += quasi.value.raw;

          if (index < expressions.length) {
            const expr = expressions[index];

            // 변수명 추출
            let varName: string;
            if (t.isIdentifier(expr)) {
              varName = expr.name;
            } else if (t.isMemberExpression(expr)) {
              // user.name → user_name
              varName = generate(expr).code.replace(/\./g, "_");
            } else {
              // 복잡한 표현식은 expr0, expr1 등으로 처리
              varName = `expr${index}`;
            }

            // i18next 형식: {{varName}}
            i18nextString += `{{${varName}}}`;

            // interpolation 객체에 추가
            interpolationVars.push(
              t.objectProperty(t.identifier(varName), expr as t.Expression)
            );
          }
        });

        // t("안녕 {{name}}", { name: name })
        const args: Array<t.Expression | t.SpreadElement> = [
          t.stringLiteral(i18nextString),
        ];

        // interpolation 객체가 있으면 두 번째 인자로 추가
        if (interpolationVars.length > 0) {
          args.push(t.objectExpression(interpolationVars));
        }

        const replacement = t.callExpression(t.identifier("t"), args);
        subPath.replaceWith(replacement);
      },
      JSXText: (subPath) => {
        // i18n-ignore 주석이 있는 경우 스킵
        if (this.hasIgnoreComment(subPath, sourceCode)) {
          return;
        }

        const text = subPath.node.value.trim();

        // 빈 텍스트나 공백만 있는 경우 스킵
        if (!text) {
          return;
        }

        // 한국어가 포함된 텍스트만 처리
        if (/[가-힣]/.test(text)) {
          wasModified = true;

          // t() 함수 호출로 감싸기
          const replacement = t.jsxExpressionContainer(
            t.callExpression(t.identifier("t"), [t.stringLiteral(text)])
          );

          subPath.replaceWith(replacement);
        }
      },
      // JSX 표현식에서 상수 속성 접근 감지
      // 예: {item.label} -> {t(item.label)}
      JSXExpressionContainer: (subPath) => {
        // i18n-ignore 주석이 있는 경우 스킵
        if (this.hasIgnoreComment(subPath, sourceCode)) {
          return;
        }

        const expression = subPath.node.expression;

        // 이미 t()로 래핑된 경우 스킵
        if (
          t.isCallExpression(expression) &&
          t.isIdentifier(expression.callee, { name: "t" })
        ) {
          return;
        }

        // MemberExpression 확인: item.label 형태
        if (
          t.isMemberExpression(expression) &&
          t.isIdentifier(expression.property)
        ) {
          const propertyName = expression.property.name;

          // 렌더링 가능한 속성인지 먼저 확인
          if (!this.isRenderablePropertyName(propertyName)) {
            return;
          }

          // 객체 부분이 Identifier인지 확인
          if (!t.isIdentifier(expression.object)) {
            return;
          }

          let shouldWrap = false;
          const objectName = expression.object.name;

          // Props나 함수 파라미터에서 온 데이터인지 확인 (제외해야 함)
          if (this.isFromPropsOrParams(objectName, subPath.scope)) {
            console.log(
              `     🚫 Skipping ${objectName}.${propertyName} - from props/params`
            );
            return;
          }

          // 케이스 1: 직접 상수 접근 - BUTTON_CONFIG.title 또는 users.name
          const constantProps =
            this.constantsWithRenderableProps.get(objectName);

          if (constantProps) {
            // 분석된 상수 - 속성이 있는지 확인
            if (constantProps.has(propertyName)) {
              shouldWrap = true;
              console.log(
                `     ✅ Analyzed constant access: ${objectName}.${propertyName}`
              );
            } else {
              // 분석된 상수지만 해당 속성은 한국어 없음
              console.log(
                `     🚫 Analyzed constant but property not renderable: ${objectName}.${propertyName}`
              );
              return;
            }
          }
          // 분석되지 않은 변수 - 외부 파일일 가능성 (휴리스틱 fallback)
          else if (
            this.looksLikeConstant(objectName) &&
            this.isRenderablePropertyName(propertyName)
          ) {
            shouldWrap = true;
            console.log(
              `     ✅ External constant (heuristic): ${objectName}.${propertyName}`
            );
          } else {
            // 케이스 2: 배열 요소 접근 - item.label, field.placeholder
            // item이나 field가 어디서 왔는지 추적
            const binding = subPath.scope.getBinding(objectName);

            if (binding) {
              console.log(`     🔍 Analyzing binding for ${objectName}`);
              // map/forEach의 콜백 파라미터인 경우
              const bindingPath = binding.path;

              // 화살표 함수나 일반 함수의 파라미터인지 확인
              if (bindingPath.isIdentifier()) {
                const parent = bindingPath.parentPath;

                // 함수 파라미터인 경우
                if (
                  parent &&
                  (parent.isArrowFunctionExpression() ||
                    parent.isFunctionExpression())
                ) {
                  // 이 함수가 .map()이나 .forEach() 호출인지 확인
                  const funcParent = parent.parentPath;

                  if (funcParent && t.isCallExpression(funcParent.node)) {
                    const callee = funcParent.node.callee;

                    // NAV_ITEMS.map() 형태인지 확인
                    if (
                      t.isMemberExpression(callee) &&
                      t.isIdentifier(callee.object) &&
                      t.isIdentifier(callee.property) &&
                      (callee.property.name === "map" ||
                        callee.property.name === "forEach" ||
                        callee.property.name === "filter" ||
                        callee.property.name === "find")
                    ) {
                      const sourceArray = callee.object.name;
                      console.log(
                        `     🔍 Found array method: ${sourceArray}.${callee.property.name}()`
                      );

                      // 소스 배열이 props나 파라미터에서 온 것인지 확인
                      if (
                        this.isFromPropsOrParams(sourceArray, subPath.scope)
                      ) {
                        console.log(
                          `     🚫 Skipping ${sourceArray} - from props/params`
                        );
                        return;
                      }

                      const sourceArrayProps =
                        this.constantsWithRenderableProps.get(sourceArray);

                      console.log(
                        `     📋 Source array ${sourceArray} has props:`,
                        sourceArrayProps ? Array.from(sourceArrayProps) : "none"
                      );

                      if (sourceArrayProps) {
                        // 분석된 배열 - 속성이 있는지 확인
                        if (sourceArrayProps.has(propertyName)) {
                          shouldWrap = true;
                          console.log(
                            `     ✅ Analyzed array element: ${sourceArray}[].${propertyName}`
                          );
                        } else {
                          // 분석된 배열이지만 해당 속성은 한국어 없음
                          console.log(
                            `     🚫 Analyzed array but property not renderable: ${sourceArray}[].${propertyName}`
                          );
                        }
                      }
                      // 분석되지 않은 배열 - 외부 파일일 가능성 (휴리스틱 fallback)
                      else if (
                        this.looksLikeConstant(sourceArray) &&
                        this.isRenderablePropertyName(propertyName)
                      ) {
                        shouldWrap = true;
                        console.log(
                          `     ✅ External array element (heuristic): ${sourceArray}[].${propertyName}`
                        );
                      } else {
                        console.log(
                          `     ❌ ${sourceArray} not analyzed and not matching heuristic`
                        );
                      }
                    }
                  }
                }
              }
            } else {
              console.log(`     ❌ No binding found for ${objectName}`);
            }
          }

          if (shouldWrap) {
            wasModified = true;

            // t(item.label) 형태로 래핑
            const wrappedExpression = t.callExpression(t.identifier("t"), [
              expression as t.Expression,
            ]);

            subPath.node.expression = wrappedExpression;
          }
        }
      },
    });

    return { wasModified, isServerComponent };
  }

  private addImportIfNeeded(ast: t.File): boolean {
    let hasImport = false;

    traverse(ast, {
      ImportDeclaration: (path) => {
        if (path.node.source.value === this.config.translationImportSource) {
          const hasUseTranslation = path.node.specifiers.some(
            (spec) =>
              t.isImportSpecifier(spec) &&
              t.isIdentifier(spec.imported) &&
              spec.imported.name === "useTranslation"
          );

          if (!hasUseTranslation) {
            path.node.specifiers.push(
              t.importSpecifier(
                t.identifier("useTranslation"),
                t.identifier("useTranslation")
              )
            );
          }
          hasImport = true;
        }
      },
    });

    if (!hasImport) {
      const importDeclaration = t.importDeclaration(
        [
          t.importSpecifier(
            t.identifier("useTranslation"),
            t.identifier("useTranslation")
          ),
        ],
        t.stringLiteral(this.config.translationImportSource)
      );
      ast.program.body.unshift(importDeclaration);
      return true;
    }

    return false;
  }

  private isReactComponent(name: string): boolean {
    return /^[A-Z]/.test(name) || /^use[A-Z]/.test(name);
  }

  public async processFiles(): Promise<{
    processedFiles: string[];
  }> {
    const filePaths = await glob(this.config.sourcePattern);
    const processedFiles: string[] = [];

    console.log(`� Found ${filePaths.length} files to process...`);

    for (const filePath of filePaths) {
      let isFileModified = false;
      const code = fs.readFileSync(filePath, "utf-8");

      try {
        const ast = parser.parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript", "decorators-legacy"],
          attachComment: true, // 주석을 AST에 첨부
        });

        // Step 1: Import 문 파싱
        this.importedConstants.clear();
        this.parseImports(ast, filePath);

        // Step 2: 로컬 상수 선언 분석
        this.constantsWithRenderableProps.clear();
        traverse(ast, {
          VariableDeclaration: (path) => {
            this.analyzeConstantDeclaration(path);
          },
        });

        // Step 3: Import된 외부 파일 분석
        this.analyzeImportedFiles();

        // 분석 결과 로깅
        if (this.constantsWithRenderableProps.size > 0) {
          console.log(
            `   📋 Found constants with renderable properties in ${filePath}:`
          );
          this.constantsWithRenderableProps.forEach((props, varName) => {
            console.log(
              `      - ${varName}: [${Array.from(props).join(", ")}]`
            );
          });
        }

        // 수정된 컴포넌트 경로와 서버 컴포넌트 여부 저장
        const modifiedComponentPaths: Array<{
          path: NodePath<t.Function>;
          isServerComponent: boolean;
        }> = [];

        // Step 4: 컴포넌트 내부 처리
        traverse(ast, {
          FunctionDeclaration: (path) => {
            const componentName = path.node.id?.name;
            if (componentName && this.isReactComponent(componentName)) {
              const result = this.processFunctionBody(path, code);
              if (result.wasModified) {
                isFileModified = true;
                modifiedComponentPaths.push({
                  path,
                  isServerComponent: result.isServerComponent,
                });
              }
            }
          },
          ArrowFunctionExpression: (path) => {
            if (
              t.isVariableDeclarator(path.parent) &&
              t.isIdentifier(path.parent.id)
            ) {
              const componentName = path.parent.id.name;
              if (componentName && this.isReactComponent(componentName)) {
                const result = this.processFunctionBody(path, code);
                if (result.wasModified) {
                  isFileModified = true;
                  modifiedComponentPaths.push({
                    path,
                    isServerComponent: result.isServerComponent,
                  });
                }
              }
            }
          },
        });

        if (isFileModified) {
          let wasHookAdded = false;

          // 수정된 컴포넌트에 useTranslation 훅 추가
          // 단, 서버 컴포넌트는 제외 (getServerTranslation 사용)
          modifiedComponentPaths.forEach(
            ({ path: componentPath, isServerComponent }) => {
              // 서버 컴포넌트는 useTranslation 훅을 추가하지 않음
              if (isServerComponent) {
                console.log(
                  `     🔵 Server component detected - skipping useTranslation hook`
                );
                return;
              }
              if (componentPath.scope.hasBinding("t")) {
                return;
              }

              const body = componentPath.get("body");
              if (body.isBlockStatement()) {
                let hasHook = false;
                body.traverse({
                  CallExpression: (path) => {
                    if (
                      t.isIdentifier(path.node.callee, {
                        name: "useTranslation",
                      })
                    ) {
                      hasHook = true;
                    }
                  },
                });

                if (!hasHook) {
                  body.unshiftContainer(
                    "body",
                    this.createUseTranslationHook()
                  );
                  wasHookAdded = true;
                }
              }
            }
          );

          // 필요한 경우 import 추가
          if (wasHookAdded) {
            this.addImportIfNeeded(ast);
          }

          if (!this.config.dryRun) {
            const output = generate(ast, {
              retainLines: true,
              compact: false,
              comments: true, // 주석 유지
              jsescOption: {
                minimal: true,
              },
            });

            fs.writeFileSync(filePath, output.code, "utf-8");
          }

          processedFiles.push(filePath);
          console.log(
            `🔧 ${filePath} - ${
              this.config.dryRun ? "Would be modified" : "Modified"
            }`
          );
        }
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
      }
    }

    return {
      processedFiles,
    };
  }
}

export async function runTranslationWrapper(
  config: Partial<ScriptConfig> = {}
) {
  const wrapper = new TranslationWrapper(config);

  console.log("🚀 Starting translation wrapper...");
  const startTime = Date.now();

  const { processedFiles } = await wrapper.processFiles();

  const endTime = Date.now();
  console.log(`\n✅ Translation wrapper completed in ${endTime - startTime}ms`);
  console.log(`📊 Processed ${processedFiles.length} files`);
}

// CLI 실행 부분
if (require.main === module) {
  const args = process.argv.slice(2);
  const config: Partial<ScriptConfig> = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--pattern":
      case "-p":
        config.sourcePattern = args[++i];
        break;
      case "--dry-run":
      case "-d":
        config.dryRun = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Usage: t-wrapper [options]

Options:
  -p, --pattern <pattern>    Source file pattern (default: "src/**/*.{js,jsx,ts,tsx}")
  -d, --dry-run             Preview changes without modifying files
  -h, --help                Show this help message

Examples:
  t-wrapper
  t-wrapper -p "app/**/*.tsx"
  t-wrapper --dry-run
        `);
        process.exit(0);
        break;
    }
  }

  runTranslationWrapper(config).catch(console.error);
}
