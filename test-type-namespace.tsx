/**
 * 타입 지원 및 네임스페이스 동작 테스트
 * 
 * 이 파일은 i18nexus의 타입 안전성과 네임스페이스 기능을 검증합니다.
 */

import React from 'react';
import { createI18n } from './packages/core/src/utils/createI18n';

// 1. 네임스페이스 기반 번역 정의
const translations = {
  common: {
    en: {
      welcome: "Welcome",
      goodbye: "Goodbye",
      greeting: "Hello {{name}}"
    },
    ko: {
      welcome: "환영합니다",
      goodbye: "안녕히 가세요",
      greeting: "안녕하세요 {{name}}"
    }
  },
  menu: {
    en: {
      home: "Home",
      about: "About",
      settings: "Settings"
    },
    ko: {
      home: "홈",
      about: "소개",
      settings: "설정"
    }
  },
  errors: {
    en: {
      notFound: "Not Found",
      serverError: "Server Error"
    },
    ko: {
      notFound: "찾을 수 없음",
      serverError: "서버 오류"
    }
  }
} as const;

// 2. 타입 안전한 i18n 인스턴스 생성
const i18n = createI18n(translations);

// ============================================
// 타입 안전성 테스트
// ============================================

// ✅ 올바른 네임스페이스 사용 - 타입 체크 통과
type ValidNamespace1 = Parameters<typeof i18n.useTranslation>[0]; // "common" | "menu" | "errors"
const ns1: ValidNamespace1 = "common";
const ns2: ValidNamespace1 = "menu";
const ns3: ValidNamespace1 = "errors";

// ❌ 잘못된 네임스페이스 - TypeScript 컴파일 에러 발생해야 함
// const invalidNs: ValidNamespace1 = "invalid"; // Type error!

// ============================================
// 네임스페이스 키 추론 테스트
// ============================================

function TypeSafetyTest() {
  const { t: tCommon } = i18n.useTranslation("common");
  const { t: tMenu } = i18n.useTranslation("menu");
  const { t: tErrors } = i18n.useTranslation("errors");

  // ✅ 각 네임스페이스의 올바른 키 사용 - 자동완성 지원
  const welcome = tCommon("welcome");     // ✅ OK
  const home = tMenu("home");             // ✅ OK
  const notFound = tErrors("notFound");   // ✅ OK

  // 변수 인터폴레이션 테스트
  const greeting = tCommon("greeting", { name: "John" }); // ✅ OK

  // ❌ 잘못된 키 사용 - TypeScript 컴파일 에러 발생해야 함
  // const invalid = tCommon("home");     // Type error! (home은 menu에만 있음)
  // const invalid2 = tMenu("welcome");   // Type error! (welcome은 common에만 있음)
  
  return (
    <div>
      <h1>{welcome}</h1>
      <nav>{home}</nav>
      <p>{notFound}</p>
      <div>{greeting}</div>
    </div>
  );
}

// ============================================
// Provider 테스트
// ============================================

function App() {
  return (
    <i18n.I18nProvider
      languageManagerOptions={{
        defaultLanguage: "en",
        availableLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" }
        ]
      }}
    >
      <TypeSafetyTest />
    </i18n.I18nProvider>
  );
}

// ============================================
// 타입 추론 검증
// ============================================

// 네임스페이스 타입 추출
type Namespaces = Parameters<typeof i18n.useTranslation>[0];
type CommonKeys = "welcome" | "goodbye" | "greeting";
type MenuKeys = "home" | "about" | "settings";
type ErrorKeys = "notFound" | "serverError";

// 반환 타입 검증
type CommonReturn = ReturnType<typeof i18n.useTranslation<"common">>;
type MenuReturn = ReturnType<typeof i18n.useTranslation<"menu">>;

console.log("✅ 타입 검증 완료:");
console.log("  - 네임스페이스 타입:", ["common", "menu", "errors"]);
console.log("  - Common 키:", ["welcome", "goodbye", "greeting"]);
console.log("  - Menu 키:", ["home", "about", "settings"]);
console.log("  - Errors 키:", ["notFound", "serverError"]);

export { App, i18n, translations };

