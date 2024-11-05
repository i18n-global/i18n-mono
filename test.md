### 1️⃣ i18n-sheets init: 10초 만에 프로젝트 설정

```bash
npm install -g i18nexus-tools
npx i18n-sheets init
```

대화형 인터페이스로 언어를 선택하면, 완벽한 구조가 자동으로 생성됩니다:

```
src/
├── i18n/
│   ├── translations/
│   │   ├── ko.json
│   │   ├── en.json
│   │   └── ja.json
│   └── i18n.ts
└── i18nexus.config.json
```

### i18nexus.config.json 설정

프로젝트 설정 파일로, 모든 i18nexus-tools 명령어가 이 설정을 참조합니다:

```json
{
  "translationDir": "src/i18n/translations",
  "defaultLanguage": "ko",
  "supportedLanguages": ["ko", "en", "ja"],
  "googleSheets": {
    "spreadsheetId": "your-spreadsheet-id",
    "sheetName": "Translations"
  }
}
```

**주요 설정:**

- `translationDir`: 번역 파일이 저장될 디렉토리
- `defaultLanguage`: 기본 언어 (자동 번역의 소스)
- `supportedLanguages`: 지원할 언어 목록
- `googleSheets`: Google Sheets 연동 설정 (선택사항)

### 2️⃣ i18n-wrapper: 지능형 코드 변환

가장 강력한 기능입니다. 하드코딩된 텍스트를 자동으로 `t()` 함수로 변환해줍니다.

```bash
npx i18n-wrapper

```

### 지능적인 변환 예시

**JSX 텍스트:**

```tsx
// Before
<div>
  <h1>환영합니다</h1>
  <p>서비스를 시작하세요</p>
</div>;

// After (2초 소요)
const { t } = useTranslation();
<div>
  <h1>{t("환영합니다")}</h1>
  <p>{t("서비스를 시작하세요")}</p>
</div>;
```

**템플릿 리터럴도 자동으로:**

```tsx
// Before
const message = `사용자 ${count}명이 접속 중`;

// After
const message = t("사용자 {{count}}명이 접속 중", { count });
```

**동적 데이터는 자동으로 스킵:**

```tsx
function UserCard({ userName }) {
  return (
    <div>
      {/* ❌ 변환 안 함 (props) */}
      <h2>{userName}</h2>

      {/* ✅ 변환 (정적 텍스트) */}
      <button>{t("프로필 보기")}</button>
    </div>
  );
}
```

### 미리보기 기능

```bash
# 실제 변환 없이 결과만 확인
i18n-wrapper --dry-run

# 특정 패턴만 변환
i18n-wrapper -p "src/components/**/*.tsx"
```

### 3️⃣ i18n-extractor: 번역 키 자동 추출

코드에서 모든 `t()` 호출을 찾아 JSON 파일을 자동으로 생성합니다.

```bash
i18n-extractor
```

```json
// 자동 생성된 ko.json
{
  "환영합니다": "환영합니다",
  "서비스 설명": "서비스 설명",
  "시작하기": "시작하기"
}
```

기존 번역을 보존하면서 새 키만 추가하는 안전 모드:

```bash
i18n-extractor --safe

# 특정 패턴만 추출
i18n-extractor -p "src/**/*.tsx"
```

### 4️⃣ Google Sheets 연동: 번역가와 실시간 협업

이제 번역가와 JSON 파일을 주고받을 필요가 없습니다. Google Sheets로 실시간 협업이 가능합니다!

```bash
# Google Sheets 설정
i18n-sheets setup

# 업로드 (자동 번역 포함)
i18n-upload --auto-translate

# 번역가 작업 (Google Sheets에서)

# 다운로드
i18n-download

# 강제 다운로드 (로컬 변경사항 무시)
i18n-download-force
```

- `-auto-translate` 옵션을 사용하면 구글의 공식 번역 엔진으로 자동 번역까지 해줍니다:

```
| Key       | 한국어      | 영어                                    |
|-----------|------------|----------------------------------------|
| 환영합니다 | 환영합니다   | =GOOGLETRANSLATE(B2,"ko","en")        |

```

번역가는 Sheets에서 직접 수정하면 되고, 여러분은 `npx i18n-download`만 실행하면 끝입니다!

## 모든 i18n 라이브러리와 호환됩니다

`i18nexus-tools`는 범용 도구입니다. 어떤 라이브러리를 사용하든 동작합니다:

✅ react-i18next
✅ next-i18next

✅ react-intl
✅ i18next (바닐라)

설정 파일에서 사용할 라이브러리만 지정하면 됩니다:

```json
{
  "library": "react-i18next",
  "importPath": "react-i18next",
  "hookName": "useTranslation",
  "functionName": "t"
}
```

## i18nexus: 완벽한 통합 솔루션

`i18nexus-tools`는 범용 자동화 도구지만, **i18nexus 라이브러리**와 함께 사용하면 훨씬 더 강력합니다.

### Props Drilling 완전 제거

```tsx
// ❌ next-i18next
function Page({ params }: { params: { lng: string } }) {
  return <Layout lng={params.lng} />;
}

// ✅ i18nexus
function Page() {
  return <Layout />; // 👈 lng 파라미터 불필요!
}
```

### URL 라우팅 간소화

```tsx
// ❌ next-i18next: /[lng]/... 강제
<Link href={`/${lng}/about`}>About</Link>

// ✅ i18nexus: 일반 라우팅
<Link href="/about">About</Link>

// 쿠키로 언어 자동 관리
const { changeLanguage } = useLanguageSwitcher();
changeLanguage('en');

```

### Next.js SSR 완벽 지원

```tsx
// ✅ i18nexus: 간단한 Server Component
import { getServerTranslation } from "i18nexus/ssr";
import { translations } from "@/i18n/i18n";

async function Component() {
  const { t } = await getServerTranslation(translations);
  return <p>{t("text")}</p>;
}
```

### TypeScript 자동 지원

```tsx
const { t } = useTranslation();

t("welcome"); // ✅ 자동완성
t("welcom"); // ❌ 컴파일 에러!
//  ~~~~~~
// 'welcom'은 존재하지 않는 키
```

### 경량 번들

| 라이브러리    | 번들 크기 |
| ------------- | --------- |
| react-i18next | ~30KB     |
| next-i18next  | ~50KB     |
| **i18nexus**  | **15KB**  |

## 완벽한 워크플로우

```bash
# 1. 설치 (30초)
npm install i18nexus
npm install -g i18nexus-tools

# 2. 초기화 (10초)
i18n-sheets init

# 3. Provider 적용 (1분)
# app/layout.tsx에 I18nProvider 추가

# 4. 코드 작성
# 일반적인 React 코드로 작성

# 5. 자동 변환 (2분)
i18n-wrapper

# 6. 번역 키 추출 (1분)
i18n-extractor

# 7. Google Sheets 설정 (최초 1회)
i18n-sheets setup

# 8. Google Sheets 업로드 (자동 번역 포함)
i18n-upload --auto-translate

# 9. 번역 완료 후 다운로드
i18n-download

# 완료! 총 3분 소요
```

## 실제 효과

| 작업           | 수작업     | i18nexus-tools | 효율성    |
| -------------- | ---------- | -------------- | --------- |
| 하드코딩 찾기  | 2시간      | 0초            | **∞**     |
| t() 래핑       | 3시간      | 2분            | **90배**  |
| import 추가    | 1시간      | 0초            | **∞**     |
| 번역 파일 생성 | 1시간      | 1분            | **60배**  |
| 번역가 협업    | 하루+      | 실시간         | **24배+** |
| **전체**       | **7시간+** | **3분**        | **140배** |

## 지금 바로 시작하세요!

```bash
# 기존 프로젝트에 추가 (범용)
npm install -g i18nexus-tools
i18n-sheets init

# 완벽한 경험을 위해 (i18nexus 라이브러리 사용)
npm install i18nexus
npm install -g i18nexus-tools
i18n-sheets init

# 모든 CLI 명령어 확인
i18n-sheets --help
i18n-wrapper --help
i18n-extractor --help
i18n-upload --help
i18n-download --help
```

---

7시간 걸리던 다국어 작업을 3분으로 줄여보세요.

더 이상 하드코딩을 하나하나 찾아 헤매지 마세요.
더 이상 props drilling에 시달리지 마세요.
더 이상 번역가와 JSON 파일을 주고받지 마세요.

**i18nexus-tools와 i18nexus가 모든 걸 자동화해드립니다.**

⭐ [GitHub](https://github.com/manNomi/i18nexus)

📦 [npm - i18nexus](https://www.npmjs.com/package/i18nexus)

📦 [npm - i18nexus-tools](https://www.npmjs.com/package/i18nexus-tools)

🎮 [라이브 데모](https://i18nexus-demo.vercel.app/)

Made with ❤️ for React developers worldwide
