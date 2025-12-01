/**
 * 네임스페이스 추론 및 검증 로직
 * ver2.md 기반 구현
 */

import * as pathLib from "path";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { parseWithBabel } from "../common/ast/parser-utils";

export interface NamespacingConfig {
  enabled: boolean;
  basePath: string;
  defaultNamespace: string;
  framework?: "nextjs-app" | "nextjs-pages" | "tanstack-file" | "tanstack-folder" | "react-router" | "remix" | "other";
  ignorePatterns?: string[];
  /**
   * 네임스페이스 추론 전략
   * - "first-folder": 첫 번째 폴더명만 사용 (기본값)
   *   예: gallery/folder/page.tsx → "gallery"
   * - "full-path": 전체 경로를 kebab-case로 변환
   *   예: gallery/folder/page.tsx → "gallery-folder"
   * - "last-folder": 마지막 폴더명 사용
   *   예: gallery/folder/page.tsx → "folder"
   */
  strategy?: "first-folder" | "full-path" | "last-folder";
}

/**
 * 프레임워크별 특수 패턴 제거
 */
function removeFrameworkPatterns(
  relativePath: string,
  framework?: string,
  ignorePatterns?: string[]
): string {
  let cleaned = relativePath;

  // 사용자 정의 패턴 먼저 적용
  if (ignorePatterns && ignorePatterns.length > 0) {
    ignorePatterns.forEach((pattern) => {
      const regex = new RegExp(pattern, "g");
      cleaned = cleaned.replace(regex, "");
    });
  }

  // 프레임워크별 기본 패턴 제거
  switch (framework) {
    case "nextjs-app":
      // Next.js App Router: (group), _private, [dynamic], [...catchall] 제거
      cleaned = cleaned
        .replace(/\([^)]+\)\//g, "") // (group)
        .replace(/\/_[^/]+/g, "") // _private
        .replace(/\[[^\]]+\]/g, "") // [dynamic]
        .replace(/\[\.\.\.[^\]]+\]/g, ""); // [...catchall]
      break;

    case "nextjs-pages":
      // Next.js Pages Router: [dynamic], [...catchall] 제거
      cleaned = cleaned
        .replace(/\[[^\]]+\]/g, "") // [dynamic]
        .replace(/\[\.\.\.[^\]]+\]/g, ""); // [...catchall]
      break;

    case "tanstack-file":
      // TanStack Router 파일 기반: 파일명에서 네임스페이스 추출 (점으로 구분)
      // 예: dashboard.about.tsx -> dashboard
      const fileName = pathLib.basename(cleaned, pathLib.extname(cleaned));
      const firstPart = fileName.split(".")[0];
      if (firstPart && firstPart !== "index") {
        return firstPart;
      }
      break;

    case "tanstack-folder":
      // TanStack Router 폴더 기반: _layout, _index, $ 동적 세그먼트 제거
      cleaned = cleaned
        .replace(/\/_[^/]+/g, "") // _layout, _index
        .replace(/\$[^/]+/g, ""); // $id
      break;

    case "react-router":
      // React Router: 특수 패턴 없음
      break;

    case "remix":
      // Remix: $ 동적 세그먼트 제거
      cleaned = cleaned.replace(/\$[^/]+/g, ""); // $id
      break;

    case "other":
    default:
      // 기타: ignorePatterns만 사용
      break;
  }

  return cleaned;
}

/**
 * 파일 경로에서 네임스페이스 추론 (경로 기반만)
 */
export function inferNamespaceFromPath(
  filePath: string,
  config: NamespacingConfig
): string {
  if (!config.enabled) {
    return config.defaultNamespace;
  }

  const absoluteBasePath = pathLib.resolve(process.cwd(), config.basePath);
  const absoluteFilePath = pathLib.resolve(process.cwd(), filePath);

  // basePath 외부 파일은 defaultNamespace 사용
  if (!absoluteFilePath.startsWith(absoluteBasePath + pathLib.sep)) {
    return config.defaultNamespace;
  }

  // basePath 기준 상대 경로 추출
  const relativePath = pathLib.relative(absoluteBasePath, absoluteFilePath);

  // 프레임워크별 특수 패턴 제거
  const cleanedPath = removeFrameworkPatterns(
    relativePath,
    config.framework,
    config.ignorePatterns
  );

  // 경로 정규화 (중복 슬래시 제거)
  const normalizedPath = cleanedPath
    .split(pathLib.sep)
    .filter((part) => part.length > 0)
    .join(pathLib.sep);

  // 경로에서 네임스페이스 결정
  const parts = normalizedPath.split(pathLib.sep);
  if (parts.length === 0) {
    return config.defaultNamespace;
  }

  // 파일명 제거 (마지막 part가 파일인 경우)
  const lastPart = parts[parts.length - 1];
  const isFile = lastPart.includes(".") || ["page", "layout", "template", "index"].includes(lastPart.toLowerCase());
  const pathWithoutFile = isFile ? parts.slice(0, -1) : parts;
  
  // 빈 경로면 defaultNamespace
  if (pathWithoutFile.length === 0) {
    return config.defaultNamespace;
  }

  // 특수 파일명인 경우 체크
  const firstPart = pathWithoutFile[0];
  const specialNames = ["index", "page", "layout", "template"];
  if (specialNames.includes(firstPart.toLowerCase())) {
    return config.defaultNamespace;
  }

  // 네임스페이스 전략에 따라 다르게 처리
  const strategy = config.strategy || "first-folder";

  switch (strategy) {
    case "first-folder":
      // 첫 번째 폴더만 사용 (기본값)
      return pathWithoutFile[0];

    case "full-path":
      // 전체 경로를 kebab-case로 변환
      // gallery/folder → gallery-folder
      return pathWithoutFile.join("-");

    case "last-folder":
      // 마지막 폴더명 사용
      return pathWithoutFile[pathWithoutFile.length - 1];

    default:
      return pathWithoutFile[0];
  }
}

/**
 * 파일에서 네임스페이스 추론 (우선순위 기반)
 * 1순위: useTranslation()에 명시된 네임스페이스
 * 2순위: 파일 경로 기반 추론
 */
export function inferNamespaceFromFile(
  filePath: string,
  code: string,
  config: NamespacingConfig,
): string {
  if (!config.enabled) {
    return config.defaultNamespace;
  }

  // 1순위: useTranslation()에 명시된 네임스페이스
  const useTranslationCalls = findUseTranslationCalls(filePath, code);
  if (useTranslationCalls.length > 0) {
    const firstCall = useTranslationCalls[0];
    if (firstCall.namespace) {
      // 명시적 네임스페이스가 있으면 우선 사용
      return firstCall.namespace;
    }
  }

  // 2순위: 파일 경로 기반 추론
  return inferNamespaceFromPath(filePath, config);
}

/**
 * 기존 inferNamespace 함수 (하위 호환성)
 * @deprecated Use inferNamespaceFromFile or inferNamespaceFromPath instead
 */
export function inferNamespace(
  filePath: string,
  config: NamespacingConfig
): string {
  // 하위 호환성: 코드 없이 경로만으로 추론
  return inferNamespaceFromPath(filePath, config);
}

/**
 * 파일에서 useTranslation 훅 호출 찾기
 */
export function findUseTranslationCalls(
  filePath: string,
  code: string
): Array<{ namespace?: string; line: number }> {
  const results: Array<{ namespace?: string; line: number }> = [];

  try {
    const ast = parseWithBabel(code, {
      sourceType: "module",
      extendedPlugins: true,
    });

    traverse(ast, {
      CallExpression: (path: NodePath<t.CallExpression>) => {
        const { node } = path;

        // useTranslation() 호출 찾기
        if (
          t.isIdentifier(node.callee, { name: "useTranslation" }) ||
          (t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.object, { name: "useTranslation" }))
        ) {
          const namespace = node.arguments[0];
          const line = node.loc?.start.line || 0;

          if (t.isStringLiteral(namespace)) {
            results.push({ namespace: namespace.value, line });
          } else if (namespace === undefined || namespace === null) {
            // 인자 없음
            results.push({ namespace: undefined, line });
          }
        }
      },
    });
  } catch (error) {
    // 파싱 실패 시 빈 배열 반환
  }

  return results;
}

/**
 * 네임스페이스 검증
 */
export function validateNamespace(
  filePath: string,
  code: string,
  expectedNamespace: string,
  config: NamespacingConfig
): { valid: boolean; error?: string } {
  if (!config.enabled) {
    return { valid: true };
  }

  const useTranslationCalls = findUseTranslationCalls(filePath, code);

  for (const call of useTranslationCalls) {
    if (call.namespace === undefined) {
      return {
        valid: false,
        error: `[i18nexus-tools] Namespace required in ${filePath}:${call.line}.\nFile path resolves to namespace "${expectedNamespace}", but found useTranslation() without namespace argument.\nPlease use useTranslation("${expectedNamespace}").`,
      };
    }

    if (call.namespace !== expectedNamespace) {
      return {
        valid: false,
        error: `[i18nexus-tools] Namespace Mismatch in ${filePath}:${call.line}.\nFile path resolves to namespace "${expectedNamespace}", but found useTranslation("${call.namespace}").\nPlease use useTranslation("${expectedNamespace}").`,
      };
    }
  }

  return { valid: true };
}

