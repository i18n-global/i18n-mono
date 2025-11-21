# ⚡ i18nexus 초간단 시작 가이드

> **단 3개 명령어로 국제화 완성!** Provider만 감싸면 끝!

## 📦 설치

```bash
npm install i18nexus
```

## 🚀 시작하기 (3단계)

### 1️⃣ 프로젝트 초기화

```bash
npx i18n-sheets init --typescript
```

이 명령어 하나로:

- ✅ `i18nexus.config.ts` 생성 (타입 안전!)
- ✅ `locales/en.json`, `ko.json` 생성
- ✅ 모든 설정 완료!

### 2️⃣ 한국어 텍스트 자동 래핑

```bash
npx i18n-wrapper
```

이 명령어가:

- ✅ 한국어 텍스트 찾아서 `t("한국어")` 로 자동 래핑
- ✅ `useTranslation` import 자동 추가
- ✅ 훅 사용 코드 자동 생성

### 3️⃣ 번역 키 추출

```bash
npx i18n-extractor
```

이 명령어로:

- ✅ 모든 `t()` 키 추출
- ✅ `en.json`, `ko.json` 자동 업데이트
- ✅ 기존 번역 유지하면서 새 키만 추가

**끝!** 이제 `en.json`에 영어 번역만 추가하면 됩니다.

---

## 🎯 Provider 설정 (한 번만!)

### app/layout.tsx

```tsx
import { I18nProvider } from "i18nexus";
import { cookies } from "next/headers";
import { config, AppLanguages } from "@/i18nexus.config"; // 타입 안전!
import enTranslations from "@/locales/en.json";
import koTranslations from "@/locales/ko.json";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = cookieStore.get("i18n-language")?.value || "ko";

  return (
    <html lang={language}>
      <body>
        <I18nProvider<AppLanguages>  {/* 타입 안전한 언어! */}
          initialLanguage={language as AppLanguages}
          languageManagerOptions={{
            defaultLanguage: config.defaultLanguage,
            availableLanguages: [
              { code: "ko", name: "한국어", flag: "🇰🇷" },
              { code: "en", name: "English", flag: "🇺🇸" },
            ],
          }}
          translations={{
            ko: koTranslations,
            en: enTranslations,
          }}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

**이게 전부입니다!** 이제 모든 컴포넌트에서 자동으로 번역이 적용됩니다.

---

## 💡 사용 예시

### 컴포넌트에서 사용 (자동으로 추가됨!)

```tsx
"use client";

import { useTranslation, useLanguageSwitcher } from "i18nexus";
import { AppLanguages } from "@/i18nexus.config";

export default function HomePage() {
  const { t } = useTranslation<AppLanguages>();
  const { changeLanguage } = useLanguageSwitcher<AppLanguages>();

  return (
    <div>
      <h1>{t("환영합니다")}</h1>

      {/* 타입 안전! 자동완성 지원! */}
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("ko")}>한국어</button>
    </div>
  );
}
```

---

## 🎨 타입 안전한 언어 전환 (NEW!)

`i18nexus.config.ts` 파일에서:

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko", "ja"] as const, // as const 중요!
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "app/**/*.{ts,tsx}",
  translationImportSource: "i18nexus",
});

export type AppLanguages = (typeof config.languages)[number]; // "en" | "ko" | "ja"
```

이제 IDE에서 자동완성과 타입 체크를 받습니다!

```typescript
changeLanguage("en"); // ✅ 자동완성!
changeLanguage("ko"); // ✅ 타입 체크!
changeLanguage("fr"); // ❌ 컴파일 에러!
```

---

## 🔄 일상적인 워크플로우

```bash
# 1. 한국어로 코드 작성
# <h1>안녕하세요</h1>

# 2. 자동 래핑
npx i18n-wrapper

# 3. 키 추출
npx i18n-extractor

# 4. en.json에 영어 번역 추가
# "안녕하세요": "Hello"

# 끝!
```

---

## 💫 주요 특징

| 특징                   | 설명                                        |
| ---------------------- | ------------------------------------------- |
| **3개 명령어**         | `init` → `wrapper` → `extractor` 끝!        |
| **Provider 한 번**     | layout.tsx에서 한 번만 설정                 |
| **자동 래핑**          | 한국어 텍스트 자동 감지 및 래핑             |
| **네임스페이스 자동화** | 파일 경로 기반 번역 파일 자동 분리 (v1.7.7+)|
| **타입 안전**          | TypeScript로 언어 코드 자동완성             |
| **모바일 최적화**      | 320px~4K 반응형, 터치 최적화 UI             |
| **SSR 지원**           | Next.js App Router 완벽 지원                |
| **기존 번역 유지**     | 항상 안전하게 병합                          |

---

## 🎓 더 알아보기

- 📖 [전체 문서](./README.md)
- 🌐 [라이브 데모](http://localhost:3000)
- 🔧 [네임스페이스 자동화 가이드](./docs/NAMESPACE_AUTOMATION.md)
- 🌍 [Showcase 시스템](./SHOWCASE_README.md)
- 🔥 [Firebase 설정](./FIREBASE_QUICK_SETUP.md)

---

## 📈 Google Analytics (옵션)

GA4을 연결하려면 프로젝트 환경 변수에 Measurement ID를 추가하세요.

예: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

위 값을 설정하면 `app/layout.tsx`에서 자동으로 gtag 스크립트를 로드하고 클라이언트 측 라우트 변경을 추적합니다.

---

## 🌍 Showcase 기능 (Firebase)

이 데모 앱은 i18nexus를 사용하는 프로젝트를 등록하고 관리하는 쇼케이스 시스템이 내장되어 있습니다.

### 주요 기능

- **자동 메타데이터 추출**: URL만 입력하면 제목, 설명, 썸네일을 자동으로 생성
- **실시간 미리보기**: 제출 전에 카드 미리보기로 확인 가능
- **관리자 승인 시스템**: Firebase Auth로 보호된 관리자 대시보드
- **Firestore 저장**: 모든 제출은 Firestore에 안전하게 저장

### Firebase 설정

`.env.local` 파일에 Firebase 설정 추가:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 사용 가능한 페이지

- `/showcase` - 승인된 프로젝트 목록 (공개)
- `/showcase/submit` - 프로젝트 제출 페이지 (공개)
- `/admin/login` - 관리자 로그인
- `/admin/dashboard` - 제출 승인/거부 대시보드 (인증 필요)

### Firestore 컬렉션 구조

컬렉션: `submissions`

```json
{
  "url": "https://myapp.vercel.app",
  "projectName": "My Project",
  "autoTitle": "Auto-extracted Title",
  "autoDescription": "Auto-extracted description",
  "thumbnailUrl": "https://...",
  "contactEmail": "user@example.com",
  "approved": false,
  "submittedAt": "Timestamp"
}
```

## ❓ 자주 묻는 질문

**Q: 정말 3개 명령어면 끝인가요?**  
A: 네! `init` → `wrapper` → `extractor` 그리고 Provider 설정만 하면 됩니다.

**Q: TypeScript config는 필수인가요?**  
A: 아니요, JSON도 됩니다. 하지만 TypeScript를 쓰면 타입 안전성을 얻습니다!

**Q: 기존 번역이 사라지나요?**  
A: 절대 아닙니다! extractor는 항상 기존 번역을 유지합니다.

**Q: wrapper가 잘못 래핑하면?**  
A: `--dry-run` 옵션으로 미리 확인하고, 수동으로 수정할 수 있습니다.

---

<div align="center">

**🎉 이제 시작하세요! 단 몇 분이면 국제화 완료!**

</div>
