import { createTypedTranslation } from "../src/utils/typeTranslation";

/**
 * 이 파일은 타입 세이프 번역이 어떻게 컴파일 타임에 에러를 잡는지 보여줍니다
 *
 * 주요 포인트:
 * - translations을 as const로 정의하면 TypeScript가 정확한 키 타입을 알게 됨
 * - createTypedTranslation()은 해당 키만 허용하는 타입 안전 함수를 반환
 * - 존재하지 않는 키를 사용하면 "컴파일 타임"에 에러 발생 (런타임 아님!)
 */

// 1. 번역 객체를 as const로 정의
const appTranslations = {
  en: {
    greeting: "Hello {{name}}",
    farewell: "Goodbye",
    welcome: "Welcome",
    count: "Count: {{count}}",
  },
  ko: {
    greeting: "안녕하세요 {{name}}",
    farewell: "안녕히 가세요",
    welcome: "환영합니다",
    count: "개수: {{count}}",
  },
} as const;

// 2. 타입 세이프 번역 함수 생성
const t = createTypedTranslation(appTranslations.en);

// ✅ 이것들은 모두 컴파일이 성공합니다
t("greeting", { name: "Alice" });
t("farewell");
t("welcome");
t("count", { count: 100 });

// ❌ 이것들은 컴파일 에러가 발생합니다!
// 주석을 풀면 TypeScript 에러가 나옵니다:
//
// t("123");                    // Error: '"123"' is not assignable to type '"greeting" | "farewell" | "welcome" | "count"'
// t("invalid");                // Error: '"invalid"' is not assignable to type '"greeting" | "farewell" | "welcome" | "count"'
// t("greting");                // Error: '"greting"' is not assignable (오타!)
// t("GREETING");               // Error: 대소문자 구분! '"GREETING"' is not assignable
// t("greeting", { age: 30 });  // Error: 잘못된 변수 이름
// t("count", { count: "100" }); // 타입 체크는 안 하지만 런타임에 동작

console.log("✅ All type-safe translations are valid!");
console.log(
  "❌ Try uncommenting the errors above to see TypeScript compilation errors"
);

// 실제 사용 예제
function UserGreeting({ language }: { language: "en" | "ko" }) {
  const tEn = createTypedTranslation(appTranslations.en);
  const tKo = createTypedTranslation(appTranslations.ko);

  if (language === "en") {
    return tEn("greeting", { name: "John" }); // ✅ 안전함
  } else {
    return tKo("greeting", { name: "철수" }); // ✅ 안전함
  }

  // 아래는 컴파일 에러!
  // return tEn("123");  // ❌ 컴파일 에러: 키 "123"이 존재하지 않음
}

export { UserGreeting };
