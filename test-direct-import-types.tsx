/**
 * 직접 import 방법으로 타입 지원 테스트
 */

import { useTranslation, I18nProvider, ExtractI18nKeys } from "i18nexus";

// 방법 1: ExtractI18nKeys 사용
const translations1 = {
  en: {
    welcome: "Welcome",
    goodbye: "Goodbye",
    home: "Home"
  },
  ko: {
    welcome: "환영합니다",
    goodbye: "안녕히 가세요",
    home: "홈"
  }
} as const;

type TranslationKeys1 = ExtractI18nKeys<typeof translations1>;

function Component1() {
  const { t } = useTranslation<TranslationKeys1>();  // ✅ 타입 지정
  
  t("welcome");  // ✅ OK
  t("goodbye");  // ✅ OK
  // t("invalid");  // ❌ TypeScript 에러
}

// 방법 2: I18nProvider 타입 지정
const translations2 = {
  en: { hello: "Hello", world: "World" },
  ko: { hello: "안녕하세요", world: "세상" }
} as const;

function Component2() {
  // I18nProvider에 타입을 명시적으로 지정
  return (
    <I18nProvider<"en" | "ko", typeof translations2> translations={translations2}>
      <InnerComponent />
    </I18nProvider>
  );
}

function InnerComponent() {
  // ⚠️ 여전히 명시적 타입 지정 필요
  const { t } = useTranslation<ExtractI18nKeys<typeof translations2>>();
  t("hello");  // ✅ OK
  // t("invalid");  // ❌ TypeScript 에러
}

// 방법 3: Helper 함수로 타입 추론 개선
function createTypedI18n<T extends Record<string, Record<string, string>>>(translations: T) {
  type Keys = ExtractI18nKeys<T>;
  
  return {
    Provider: ({ children }: { children: React.ReactNode }) => (
      <I18nProvider translations={translations}>
        {children}
      </I18nProvider>
    ),
    useTranslation: () => useTranslation<Keys>(),  // ✅ 타입이 자동 추론됨
  };
}

const translations3 = {
  en: { test: "Test" },
  ko: { test: "테스트" }
} as const;

const typedI18n = createTypedI18n(translations3);

function Component3() {
  const { t } = typedI18n.useTranslation();  // ✅ 타입 자동 추론!
  t("test");  // ✅ OK
  // t("invalid");  // ❌ TypeScript 에러
}

export { Component1, Component2, Component3, typedI18n };

