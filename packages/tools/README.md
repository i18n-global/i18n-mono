# 🛠️ i18nexus-tools

> **CLI tools for i18nexus - automate i18n workflows with type-safe configuration and Google Sheets integration**

i18nexus-tools는 i18n 워크플로우를 자동화하는 강력한 CLI 도구 모음입니다. 코드에서 번역 키를 자동으로 추출하고, Google Sheets와 동기화하며, 컴포넌트를 자동으로 변환하는 등 다양한 기능을 제공합니다.

[![NPM Version](https://img.shields.io/npm/v/i18nexus-tools)](https://www.npmjs.com/package/i18nexus-tools)
[![NPM Downloads](https://img.shields.io/npm/dm/i18nexus-tools)](https://www.npmjs.com/package/i18nexus-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ 주요 기능

### 🔍 자동 번역 키 추출

- 코드베이스에서 번역 키 자동 검색
- 미사용 키 감지
- 누락된 번역 찾기
- 네임스페이스별 분리

### 🔄 Google Sheets 동기화

- 번역 파일을 Google Sheets로 업로드
- Google Sheets에서 번역 다운로드
- 양방향 동기화
- 자동 백업

### 🤖 코드 자동 변환

- 하드코딩된 텍스트를 번역 함수로 변환
- 컴포넌트에 `useTranslation` 자동 추가
- Babel 및 SWC 지원
- 타입 안전 변환

### 📊 분석 및 리포트

- 번역 완성도 리포트
- 사용되지 않는 키 리포트
- 번역 통계
- 커버리지 분석

## 📦 설치

### 전역 설치 (권장)

```bash
npm install -g i18nexus-tools
```

### 프로젝트별 설치

```bash
npm install --save-dev i18nexus-tools
```

## 🚀 빠른 시작

### 1. 설정 파일 생성

프로젝트 루트에 `i18nexus.config.json` 파일을 생성합니다:

```json
{
  "defaultLanguage": "ko",
  "supportedLanguages": ["ko", "en", "ja"],
  "translationDir": "./locales",
  "sourceDir": "./app",
  "googleSheets": {
    "spreadsheetId": "your-spreadsheet-id",
    "credentialsPath": "./google-credentials.json"
  }
}
```

### 2. 기본 워크플로우

```bash
# 1. 코드에서 번역 키 추출
i18n-extractor

# 2. Google Sheets에 업로드
i18n-upload

# 3. 번역 작업 (Google Sheets에서)

# 4. 번역 다운로드
i18n-download
```

## 📖 CLI 명령어

### `i18n-extractor`

코드베이스에서 번역 키를 자동으로 추출합니다.

```bash
i18n-extractor [options]

Options:
  -s, --source <dir>      소스 디렉토리 (기본값: config에서)
  -o, --output <dir>      출력 디렉토리 (기본값: config에서)
  -w, --watch             변경 감시 모드
  -n, --namespace <name>  특정 네임스페이스만 추출
  --dry-run               실제 파일 변경 없이 미리보기
  -v, --verbose           상세 로그 출력
```

**예시:**

```bash
# 기본 추출
i18n-extractor

# 특정 네임스페이스만 추출
i18n-extractor -n "page.tsx"

# 감시 모드로 실행
i18n-extractor --watch

# 미리보기 (실제 변경 없음)
i18n-extractor --dry-run
```

**출력 예시:**

```
🔍 Extracting translation keys...

✅ Found 15 keys in app/page.tsx
✅ Found 8 keys in app/components/Header.tsx
✅ Found 12 keys in app/components/Footer.tsx

📊 Summary:
  - Total keys: 35
  - New keys: 5
  - Unused keys: 2
  - Missing translations: 3

⚠️  Unused keys:
  - old.button.submit (ko.json)
  - deprecated.message (en.json)

❌ Missing translations:
  - new.feature.title (en.json, ja.json)
  - new.feature.description (ja.json)

✨ Done!
```

### `i18n-upload`

번역 파일을 Google Sheets에 업로드합니다.

```bash
i18n-upload [options]

Options:
  -s, --source <dir>      번역 파일 디렉토리
  -i, --spreadsheet <id>  Spreadsheet ID
  -c, --credentials <path> Google 인증 파일 경로
  --sheet <name>          특정 시트만 업로드
  --merge                 기존 데이터와 병합
  -v, --verbose           상세 로그 출력
```

**예시:**

```bash
# 기본 업로드
i18n-upload

# 특정 스프레드시트에 업로드
i18n-upload -i "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# 기존 데이터와 병합
i18n-upload --merge
```

### `i18n-download`

Google Sheets에서 번역을 다운로드합니다.

```bash
i18n-download [options]

Options:
  -o, --output <dir>      출력 디렉토리
  -i, --spreadsheet <id>  Spreadsheet ID
  -c, --credentials <path> Google 인증 파일 경로
  --sheet <name>          특정 시트만 다운로드
  --backup                다운로드 전 백업 생성
  -v, --verbose           상세 로그 출력
```

**예시:**

```bash
# 기본 다운로드
i18n-download

# 백업과 함께 다운로드
i18n-download --backup

# 특정 시트만 다운로드
i18n-download --sheet "translations-ko"
```

### `i18n-download-force`

로컬 변경사항을 무시하고 강제로 다운로드합니다.

```bash
i18n-download-force [options]

Options:
  -o, --output <dir>      출력 디렉토리
  --no-backup             백업 생성 안 함
  -v, --verbose           상세 로그 출력
```

**경고:** 이 명령어는 로컬의 모든 변경사항을 덮어씁니다.

### `i18n-wrapper`

컴포넌트를 자동으로 변환하여 번역 함수를 추가합니다.

```bash
i18n-wrapper [options] <files...>

Options:
  -e, --engine <engine>   변환 엔진 (babel|swc) (기본값: babel)
  -n, --namespace <name>  네임스페이스 지정
  --dry-run               실제 파일 변경 없이 미리보기
  --backup                변경 전 백업 생성
  -v, --verbose           상세 로그 출력
```

**예시:**

```bash
# 단일 파일 변환
i18n-wrapper app/page.tsx

# 여러 파일 변환
i18n-wrapper app/**/*.tsx

# SWC 엔진 사용
i18n-wrapper -e swc app/page.tsx

# 미리보기
i18n-wrapper --dry-run app/page.tsx
```

**변환 예시:**

**변환 전:**

```tsx
export default function Page() {
  return (
    <div>
      <h1>환영합니다</h1>
      <p>안녕하세요, 사용자님</p>
    </div>
  );
}
```

**변환 후:**

```tsx
"use client";
import { useTranslation } from "i18nexus";

export default function Page() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("안녕하세요, 사용자님")}</p>
    </div>
  );
}
```

### `i18n-wrapper-swc`

SWC 엔진을 사용하여 빠르게 변환합니다 (대규모 프로젝트에 적합).

```bash
i18n-wrapper-swc [options] <files...>

Options:
  -w, --workers <num>     워커 수 (기본값: CPU 코어 수)
  -n, --namespace <name>  네임스페이스 지정
  --dry-run               실제 파일 변경 없이 미리보기
  -v, --verbose           상세 로그 출력
```

### `i18n-sheets`

Google Sheets API 설정 및 관리를 위한 도구입니다.

```bash
i18n-sheets <command>

Commands:
  init                    Google Sheets 초기 설정
  auth                    인증 확인
  create                  새 스프레드시트 생성
  list                    스프레드시트 목록 조회
  info <id>               스프레드시트 정보 확인
  share <id> <email>      스프레드시트 공유
```

**예시:**

```bash
# 초기 설정
i18n-sheets init

# 새 스프레드시트 생성
i18n-sheets create "My Project Translations"

# 스프레드시트 공유
i18n-sheets share "spreadsheet-id" "user@example.com"
```

### `i18n-clean-legacy`

사용되지 않는 레거시 번역 키를 제거합니다.

```bash
i18n-clean-legacy [options]

Options:
  -s, --source <dir>      소스 디렉토리
  -t, --translations <dir> 번역 파일 디렉토리
  --dry-run               실제 파일 변경 없이 미리보기
  --backup                삭제 전 백업 생성
  -v, --verbose           상세 로그 출력
```

## ⚙️ 설정

### i18nexus.config.json

```json
{
  "defaultLanguage": "ko",
  "supportedLanguages": ["ko", "en", "ja", "zh"],
  "translationDir": "./locales",
  "sourceDir": "./app",

  "googleSheets": {
    "spreadsheetId": "your-spreadsheet-id",
    "credentialsPath": "./google-credentials.json",
    "sheetNamePattern": "translations-{lang}",
    "keyColumn": "A",
    "valueColumn": "B"
  },

  "extractor": {
    "patterns": [
      "t\\(['\"`]([^'\"`]+)['\"`]",
      "getServerTranslation\\(['\"`]([^'\"`]+)['\"`]"
    ],
    "excludeDirs": ["node_modules", ".next", "dist"],
    "fileExtensions": [".tsx", ".ts", ".jsx", ".js"]
  },

  "wrapper": {
    "engine": "babel",
    "importStatement": "import { useTranslation } from 'i18nexus';",
    "hookName": "useTranslation",
    "functionName": "t",
    "preserveComments": true
  }
}
```

## 🔐 Google Sheets 설정

### 1. Google Cloud Console에서 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성
3. Google Sheets API 활성화
4. 서비스 계정 생성

### 2. 인증 파일 다운로드

1. 서비스 계정의 JSON 키 생성
2. 다운로드한 파일을 프로젝트 루트에 저장 (예: `google-credentials.json`)
3. `.gitignore`에 추가하여 버전 관리에서 제외

```gitignore
google-credentials.json
```

### 3. 스프레드시트 권한 설정

1. Google Sheets에서 새 스프레드시트 생성
2. 서비스 계정 이메일에 편집 권한 부여
3. 스프레드시트 ID를 설정 파일에 추가

### 4. 초기 설정

```bash
i18n-sheets init
```

## 📊 워크플로우 예시

### 시나리오 1: 새 프로젝트 시작

```bash
# 1. 설정 파일 생성
cat > i18nexus.config.json << EOF
{
  "defaultLanguage": "ko",
  "supportedLanguages": ["ko", "en"],
  "translationDir": "./locales",
  "sourceDir": "./app"
}
EOF

# 2. 기존 코드에서 번역 키 추출
i18n-extractor

# 3. Google Sheets 설정
i18n-sheets init

# 4. 번역 업로드
i18n-upload
```

### 시나리오 2: 기존 컴포넌트 마이그레이션

```bash
# 1. 컴포넌트 자동 변환
i18n-wrapper app/page.tsx --backup

# 2. 번역 키 추출
i18n-extractor

# 3. 번역 업로드
i18n-upload --merge
```

### 시나리오 3: 번역 업데이트

```bash
# 1. 최신 번역 다운로드
i18n-download --backup

# 2. 코드와 동기화
i18n-extractor

# 3. 누락된 번역 확인
i18n-extractor --verbose
```

### 시나리오 4: 레거시 정리

```bash
# 1. 사용되지 않는 키 찾기
i18n-extractor --dry-run

# 2. 레거시 키 제거
i18n-clean-legacy --backup

# 3. 변경사항 업로드
i18n-upload
```

## 🔧 고급 사용법

### 커스텀 스크립트 통합

`package.json`에 스크립트 추가:

```json
{
  "scripts": {
    "i18n:extract": "i18n-extractor",
    "i18n:upload": "i18n-upload --merge",
    "i18n:download": "i18n-download --backup",
    "i18n:sync": "npm run i18n:extract && npm run i18n:upload",
    "i18n:update": "npm run i18n:download && npm run i18n:extract",
    "i18n:clean": "i18n-clean-legacy --backup"
  }
}
```

### CI/CD 통합

#### GitHub Actions 예시

```yaml
name: i18n Sync

on:
  push:
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Extract translations
        run: npx i18n-extractor

      - name: Upload to Google Sheets
        run: npx i18n-upload
        env:
          GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
```

### 프로그래매틱 사용

```typescript
import { extractor, uploader, downloader } from "i18nexus-tools";

// 번역 키 추출
const extractResult = await extractor.extract({
  sourceDir: "./app",
  outputDir: "./locales",
  verbose: true,
});

console.log(`Extracted ${extractResult.totalKeys} keys`);

// Google Sheets에 업로드
await uploader.upload({
  translationDir: "./locales",
  spreadsheetId: "your-id",
  credentialsPath: "./credentials.json",
});

// 다운로드
await downloader.download({
  outputDir: "./locales",
  spreadsheetId: "your-id",
  credentialsPath: "./credentials.json",
});
```

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 감시 모드
npm run test:watch

# 커버리지
npm run test:coverage
```

## 🤝 기여하기

기여를 환영합니다! 다음 방법으로 참여할 수 있습니다:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 📞 지원

- 🐛 [이슈 리포트](https://github.com/i18n-global/i18nexus-tools/issues)
- 💬 [토론](https://github.com/i18n-global/i18nexus-tools/discussions)
- 📧 Email: support@i18nexus.com

## 🔗 관련 패키지

- [i18nexus](../core/README.md) - Core i18n library
- [i18nexus-demo](../../apps/demo/README.md) - Demo application

---

**Made with ❤️ by the i18nexus team**
