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
Usage: i18n-wrapper [options]

자동으로 하드코딩된 한국어 문자열을 t() 함수로 래핑하고 useTranslation 훅을 추가합니다.

Options:
  -p, --pattern <pattern>              소스 파일 패턴 (기본값: "src/**/*.{js,jsx,ts,tsx}")
  -c, --constant-patterns <patterns>   상수로 인식할 패턴 (쉼표 구분)
                                       예: "_ITEMS,_MENU,_CONFIG" 또는 "UI_,RENDER_"
                                       비어있으면 모든 ALL_CAPS/PascalCase 허용
  -d, --dry-run                        실제 수정 없이 미리보기
  -h, --help                           도움말 표시

Examples:
  i18n-wrapper                                    # 모든 상수 처리
  i18n-wrapper -c "_ITEMS,_MENU,_CONFIG"         # 특정 접미사만 처리
  i18n-wrapper -c "UI_,RENDER_"                  # 특정 접두사만 처리
  i18n-wrapper -c "NAV,MENU,BUTTON"              # 특정 단어 포함만 처리
  i18n-wrapper -p "app/**/*.tsx" --dry-run       # 커스텀 패턴 + 미리보기
  
Features:
  - 한국어/영어 문자열 자동 감지 및 t() 래핑
  - useTranslation() 훅 자동 추가 (i18nexus-core)
  - 기존 t() 호출 및 import 보존
  - 상수 패턴 필터링으로 API 데이터 제외
      `);
      process.exit(0);
      break;
    default:
      console.error(`Unknown option: ${args[i]}`);
      process.exit(1);
  }
}

runTranslationWrapper(config).catch((error) => {
  console.error("❌ Translation wrapper failed:", error);
  process.exit(1);
});
