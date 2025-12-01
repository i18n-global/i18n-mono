/**
 * 기존 useTranslation() 호출을 찾아서 네임스페이스를 추가/수정
 */
import traverse from "@babel/traverse";
import * as t from "@babel/types";

export function updateExistingUseTranslation(
  ast: t.File,
  correctNamespace: string,
  sourceCode?: string,
): boolean {
  let updated = false;

  traverse(ast, {
    CallExpression: (path) => {
      // useTranslation() 호출 찾기
      if (t.isIdentifier(path.node.callee, { name: "useTranslation" })) {
        const args = path.node.arguments;

        // 인자가 없는 경우: useTranslation() → useTranslation("namespace")
        if (args.length === 0) {
          path.node.arguments = [t.stringLiteral(correctNamespace)];
          updated = true;
          console.log(`  ✓ Added namespace "${correctNamespace}" to useTranslation()`);
        }
        // 빈 문자열인 경우: useTranslation("") → useTranslation("namespace")
        else if (
          args.length === 1 &&
          t.isStringLiteral(args[0]) &&
          args[0].value === ""
        ) {
          args[0].value = correctNamespace;
          updated = true;
          console.log(`  ✓ Updated namespace to "${correctNamespace}"`);
        }
        // 이미 네임스페이스가 있는 경우는 유지 (사용자의 명시적 의도)
        else if (args.length === 1 && t.isStringLiteral(args[0])) {
          console.log(`  ℹ️  Keeping existing namespace "${args[0].value}"`);
        }
      }
    },
  });

  return updated;
}
