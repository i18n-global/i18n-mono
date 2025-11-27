import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/", ".next/", "out/", "build/", "dist/"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/no-unescaped-entities": "off",
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/jsx-first-prop-new-line": "error",
      quotes: ["error", "double"],
      "eol-last": "error",
      semi: ["error", "always"],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",
      "comma-spacing": ["error", { before: false, after: true }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "../ 대신 @/ alias를 사용해주세요.",
            },
          ],
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./shared/**",
              from: [
                "./app/**",
                "./pages/**",
                "./widgets/**",
                "./features/**",
                "./entities/**",
              ],
              message: "shared 레이어는 다른 레이어를 import할 수 없습니다.",
            },
            {
              target: "./entities/**",
              from: ["./app/**", "./pages/**", "./widgets/**", "./features/**"],
              message: "entities 레이어는 상위 레이어를 import할 수 없습니다.",
            },
            {
              target: "./features/**",
              from: ["./app/**", "./pages/**", "./widgets/**"],
              message: "features 레이어는 상위 레이어를 import할 수 없습니다.",
            },
            {
              target: "./widgets/**",
              from: ["./app/**", "./pages/**"],
              message: "widgets 레이어는 상위 레이어를 import할 수 없습니다.",
            },
            {
              target: "./pages/**",
              from: ["./app/**"],
              message: "pages 레이어는 app 레이어를 import할 수 없습니다.",
            },
          ],
        },
      ],
      "react/jsx-curly-spacing": ["error", { when: "never", children: true }],
      "react/jsx-equals-spacing": ["error", "never"],
      "react/jsx-props-no-multi-spaces": "error",
      "react/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "always",
          afterOpening: "never",
          beforeClosing: "never",
        },
      ],
      "react/jsx-wrap-multilines": [
        "error",
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          return: "parens-new-line",
          arrow: "parens-new-line",
          condition: "parens-new-line",
          logical: "parens-new-line",
          prop: "parens-new-line",
        },
      ],
      "react/jsx-no-useless-fragment": "error",
      "react/hook-use-state": "error",
      indent: ["error", 2, { SwitchCase: 1 }],
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "never",
        },
      ],
      "comma-style": ["error", "last"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "computed-property-spacing": ["error", "never"],
      "template-curly-spacing": ["error", "never"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "arrow-parens": ["error", "always"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-before-blocks": ["error", "always"],
      "space-infix-ops": "error",
      "space-unary-ops": ["error", { words: true, nonwords: false }],
      "space-in-parens": ["error", "never"],
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0, maxBOF: 0 }],
      "no-trailing-spaces": "error",
      "no-whitespace-before-property": "error",
      "object-shorthand": ["error", "always"],
      "prefer-const": "error",
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
      "no-var": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",
      "no-duplicate-imports": "error",
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        alias: {
          map: [["@", "./"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),
  // Next.js 자동 생성 파일 제외
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];
