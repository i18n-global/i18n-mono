#!/usr/bin/env node

import { runTranslationWrapper, ScriptConfig } from "../scripts/t-wrapper";
import { loadConfig } from "../scripts/config-loader";

const args = process.argv.slice(2);

// i18nexus.config.js에서 설정 로드
const projectConfig = loadConfig();
const config: Partial<ScriptConfig> = {
  sourcePattern: projectConfig.sourcePattern,
  translationImportSource: projectConfig.translationImportSource,
  constantPatterns: projectConfig.constantPatterns || [],
  parserType: "babel", // Babel 파서 사용
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--pattern":
    case "-p":
      config.sourcePattern = args[++i];
      break;
    case "--constant-patterns":
    case "-c":
      config.constantPatterns = args[++i].split(",").map((p) => p.trim());
      break;
    case "--dry-run":
    case "-d":
      config.dryRun = true;
      break;
    case "--help":
    case "-h":
      console.log(`
Usage: i18n-wrapper-babel [options]

자동으로 하드코딩된 한국어 문자열을 t() 함수로 래핑하고 useTranslation 훅을 추가합니다.
⚠️  이 버전은 Babel 파서를 사용합니다 (성능 비교용)

Options:
  -p, --pattern <pattern>              소스 파일 패턴 (기본값: "src/**/*.{js,jsx,ts,tsx}")
  -c, --constant-patterns <patterns>   상수로 인식할 패턴 (쉼표 구분)
                                       예: "_ITEMS,_MENU,_CONFIG" 또는 "UI_,RENDER_"
                                       비어있으면 모든 ALL_CAPS/PascalCase 허용
  -d, --dry-run                        실제 수정 없이 미리보기
  -h, --help                           도움말 표시

Parser Info:
  Parser Type: Babel (@babel/parser)
  Performance: 기준 성능 (비교용)
  
Note:
  성능 비교를 위해 swc 버전(i18n-wrapper-swc)도 사용 가능합니다.
  swc 버전이 약 20배 빠른 파싱 속도를 제공합니다.

Examples:
  i18n-wrapper-babel                              # Babel 파서로 모든 상수 처리
  i18n-wrapper-babel -c "_ITEMS,_MENU,_CONFIG"   # 특정 접미사만 처리
  i18n-wrapper-babel -p "app/**/*.tsx" --dry-run # 커스텀 패턴 + 미리보기
      `);
      process.exit(0);
      break;
    default:
      console.error(`Unknown option: ${args[i]}`);
      process.exit(1);
  }
}

console.log("🔧 Using Babel parser (performance baseline)");

runTranslationWrapper(config).catch((error) => {
  console.error("❌ Translation wrapper failed:", error);
  process.exit(1);
});
