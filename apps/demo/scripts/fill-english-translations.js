#!/usr/bin/env node

/**
 * 영어 번역 파일을 채우는 스크립트
 * ko.json의 키를 기반으로 en.json의 빈 값("")을 채웁니다.
 */

const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "../locales");

// 간단한 번역 매핑 (한국어 -> 영어)
const translations = {
  "또는 yarn 사용:": "Or use yarn:",
  "빠른 시작": "Quick Start",
  설치: "Installation",
  "자세히 알아보기": "Learn More",
  "컴포넌트에서 사용": "Usage in Components",
  "쿠키 기반 언어 관리 및 SSR 지원을 갖춘 완전한 React i18n 툴킷":
    "Complete React i18n toolkit with cookie-based language management and SSR support",
  "쿠키 기반 언어 영속성을 갖춘 React Context Provider":
    "React Context Provider with cookie-based language persistence",
  "쿠키 영속성을 통한 언어 변경 훅":
    "Language switching hook with cookie persistence",
  "클라이언트 컴포넌트에서 번역 함수에 접근하기 위한 훅":
    "Hook to access translation function in client components",
  "하이드레이션 불일치 제로의 서버 사이드 번역":
    "Server-side translation with zero hydration mismatch",
  "핵심 기능": "Core Features",
  홈: "Home",
  "i18nexus 라이브러리": "i18nexus Library",
  "i18nexus 문서": "i18nexus Documentation",
  "I18nProvider 설정": "I18nProvider Setup",
};

function fillEnglishTranslations(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      fillEnglishTranslations(fullPath);
    } else if (entry.name === "en.json") {
      const enPath = fullPath;
      const koPath = path.join(dir, "ko.json");

      if (!fs.existsSync(koPath)) {
        console.warn(`⚠️  No ko.json found for ${enPath}`);
        continue;
      }

      const enData = JSON.parse(fs.readFileSync(enPath, "utf-8"));
      const koData = JSON.parse(fs.readFileSync(koPath, "utf-8"));

      let updated = false;
      for (const [key, value] of Object.entries(enData)) {
        if (value === "" || value === null || value === undefined) {
          // ko.json에 같은 키가 있으면 그 값을 사용 (임시로)
          if (koData[key]) {
            // 번역 매핑이 있으면 사용, 없으면 한국어 그대로 (나중에 번역 필요)
            enData[key] = translations[key] || koData[key];
            updated = true;
          }
        }
      }

      if (updated) {
        fs.writeFileSync(
          enPath,
          `${JSON.stringify(enData, null, 2)}\n`,
          "utf-8"
        );
        console.log(`✅ Updated: ${enPath}`);
      }
    }
  }
}

console.log("🌐 Filling English translations...\n");
fillEnglishTranslations(localesDir);
console.log("\n✨ Done!");
