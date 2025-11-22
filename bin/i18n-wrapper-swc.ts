#!/usr/bin/env node

import { wrapTranslations } from "../scripts/t-wrapper/wrapper";
import { ScriptConfig } from "../scripts/common/default-config";
import { loadConfig } from "../scripts/config-loader";

const args = process.argv.slice(2);

// i18nexus.config.js에서 설정 로드
const projectConfig = loadConfig();
const config: Partial<ScriptConfig> = {
  sourcePattern: projectConfig.sourcePattern,
  translationImportSource: projectConfig.translationImportSource,
  parserType: "swc", // 🚀 SWC 파서 사용
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--pattern":
    case "-p":
      config.sourcePattern = args[++i];
      break;
    case "--help":
    case "-h":
      console.log(`
Usage: i18n-wrapper-swc [options]

⚠️  SWC 파서를 사용하는 실험적 버전입니다 (현재 Babel보다 느릴 수 있음)

자동으로 하드코딩된 한국어 문자열을 t() 함수로 래핑하고 useTranslation 훅을 추가합니다.

Options:
  -p, --pattern <pattern>              소스 파일 패턴 (기본값: "src/**/*.{js,jsx,ts,tsx}")
  -h, --help                           도움말 표시

Examples:
  i18n-wrapper-swc                                    # 기본 패턴으로 처리
  i18n-wrapper-swc -p "app/**/*.tsx"                 # 커스텀 패턴
  
Features:
  - ⚠️  SWC 파서 사용 (실험적, 현재 Babel보다 느릴 수 있음)
  - 한국어/영어 문자열 자동 감지 및 t() 래핑
  - useTranslation() 훅 자동 추가 (i18nexus-core)
  - 기존 t() 호출 및 import 보존

Performance Comparison:
  성능 비교를 원하시면:
  
  # Babel 버전 (기본, 권장)
  npx i18n-wrapper
  
  # SWC 버전 (실험적)
  npx i18n-wrapper-swc
  
  ⚠️  현재 테스트 결과: Babel이 SWC보다 빠릅니다.
  SWC AST를 Babel AST로 변환하는 과정에서 오버헤드가 발생합니다.
      `);
      process.exit(0);
      break;
    default:
      console.error(`Unknown option: ${args[i]}`);
      process.exit(1);
  }
}

console.log("⚠️  Running with SWC parser (experimental mode)");
console.log("⚠️  Note: SWC may be slower than Babel due to AST conversion overhead.");
console.log("⚠️  For best performance, use the default Babel parser: npx i18n-wrapper");

wrapTranslations(config).catch((error) => {
  console.error("❌ Translation wrapper failed:", error);
  process.exit(1);
});

