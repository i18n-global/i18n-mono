import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/", "dist/", "build/", "out/"],
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
      "react-refresh": reactRefresh,
      "react-compiler": reactCompiler,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
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
              target: "./src/5_Shared/**",
              from: [
                "./src/0_Routes/**",
                "./src/1_App/**",
                "./src/2_Pages/**",
                "./src/3_Widgets/**",
                "./src/4_Entity/**",
              ],
              message: "5_Shared 레이어는 다른 레이어를 import할 수 없습니다.",
            },
            {
              target: "./src/4_Entity/**",
              from: [
                "./src/0_Routes/**",
                "./src/1_App/**",
                "./src/2_Pages/**",
                "./src/3_Widgets/**",
              ],
              message:
                "4_Entity 레이어는 상위 레이어(0-3)를 import할 수 없습니다.",
            },
            {
              target: "./src/3_Widgets/**",
              from: ["./src/0_Routes/**", "./src/1_App/**", "./src/2_Pages/**"],
              message:
                "3_Widgets 레이어는 상위 레이어(0-2)를 import할 수 없습니다.",
            },
            {
              target: "./src/2_Pages/**",
              from: ["./src/0_Routes/**", "./src/1_App/**"],
              message:
                "2_Pages 레이어는 상위 레이어(0-1)를 import할 수 없습니다.",
            },
            {
              target: "./src/1_App/**",
              from: ["./src/0_Routes/**"],
              message: "1_App 레이어는 상위 레이어(0)를 import할 수 없습니다.",
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
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),

  // test 파일용 별도 설정
  {
    files: ["test/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
      "import/no-restricted-paths": "off",
    },
  },
];
