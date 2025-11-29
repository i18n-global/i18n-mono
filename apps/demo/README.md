# 🚀 i18nexus Demo Application

> **Next.js 14 demo application showcasing all i18nexus features**

i18nexus의 모든 기능을 실제로 확인할 수 있는 완전한 데모 애플리케이션입니다. Next.js 14 App Router, Server Components, Client Components, Firebase 통합 등 실제 프로덕션 환경에서 사용할 수 있는 모든 패턴을 보여줍니다.

🌐 **Live Demo**: [https://i18nexus-demo.vercel.app](https://i18nexus-demo.vercel.app)

## ✨ 데모 기능

### 🔒 타입 안전 번역

- TypeScript 타입 자동 완성
- 번역 키 컴파일 타임 검증
- 매개변수 타입 체크

### ⚡ Next.js 14 통합

- App Router 지원
- Server Components에서의 번역
- Client Components에서의 번역
- Server Actions 지원

### 🌍 다국어 지원

- 한국어 (ko)
- English (en)
- 日本語 (ja)
- 中文 (zh)

### 🎨 UI/UX

- 모던하고 반응형 디자인
- 다크 모드 지원
- 부드러운 애니메이션
- 접근성 최적화

### 🔥 Firebase 통합

- 인증 (Authentication)
- 데이터베이스 (Firestore)
- 파일 업로드 (Storage)
- 실시간 업데이트

### 📊 관리자 대시보드

- 프로젝트 관리
- 번역 통계
- 사용자 관리
- 다운로드 추적

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/manNomi/i18nexus.git
cd i18nexus/apps/demo
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Analytics (선택사항)
NEXT_PUBLIC_GA_ID=your-ga-id
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 📁 프로젝트 구조

```
apps/demo/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 + I18nProvider
│   ├── page.tsx                  # 홈페이지
│   ├── getting-started/          # 시작하기 페이지
│   ├── showcase/                 # 쇼케이스
│   ├── server-example/           # Server Component 예제
│   ├── admin/                    # 관리자 페이지
│   │   ├── dashboard/
│   │   └── login/
│   ├── api/                      # API 라우트
│   │   ├── downloads/
│   │   ├── metadata/
│   │   └── submissions/
│   └── docs/                     # 문서 페이지
│       ├── i18nexus/
│       └── i18nexus-tools/
├── locales/                      # 번역 파일
│   ├── ko.json                   # 한국어 공통 번역
│   ├── en.json                   # 영어 공통 번역
│   ├── page.tsx/                 # 홈페이지 번역
│   ├── getting-started/          # 시작하기 페이지 번역
│   └── docs/                     # 문서 페이지 번역
├── entities/                     # 엔티티 (Feature-Sliced Design)
│   ├── download/
│   └── project/
├── features/                     # 기능 (Feature-Sliced Design)
│   ├── auth-login/
│   ├── language-switch/
│   ├── project-manage/
│   └── project-submit/
├── widgets/                      # 위젯
│   ├── navigation/
│   └── showcase-list/
├── page-components/              # 페이지 컴포넌트
│   └── admin-dashboard/
├── shared/                       # 공유 컴포넌트 및 유틸
│   ├── ui/
│   └── lib/
├── lib/                          # 라이브러리 설정
│   ├── firebase.ts
│   └── analytics.ts
├── public/                       # 정적 파일
├── i18nexus.config.json          # i18nexus 설정
├── next.config.ts                # Next.js 설정
└── package.json
```

## 🎯 주요 예제

### Server Component에서 번역 사용

```tsx
// app/server-example/page.tsx
import { getServerTranslation } from "i18nexus/server";

export default async function ServerExample() {
  const t = await getServerTranslation("server-example");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

### Client Component에서 번역 사용

```tsx
// app/components/LanguageSwitch.tsx
"use client";
import { useTranslation } from "i18nexus";

export default function LanguageSwitch() {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <div>
      <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}
```

### 네임스페이스 사용

```tsx
// app/docs/i18nexus/page.tsx
"use client";
import { useTranslation } from "i18nexus";

export default function DocsPage() {
  // 페이지별 네임스페이스 사용
  const { t } = useTranslation("docs/i18nexus");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("content")}</p>
    </div>
  );
}
```

### 동적 번역

```tsx
"use client";
import { useTranslation } from "i18nexus";

export default function DynamicExample() {
  const { t } = useTranslation();
  const userName = "홍길동";
  const count = 5;

  return (
    <div>
      <h1>{t("welcome", { name: userName })}</h1>
      <p>{t("items.count", { count })}</p>
    </div>
  );
}
```

## 🔥 Firebase 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 웹 앱 추가
3. 구성 정보를 `.env.local`에 추가

### 2. Firestore 설정

```bash
# Firestore 규칙 배포
firebase deploy --only firestore:rules
```

`firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{project} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Authentication 설정

Firebase Console에서:

1. Authentication > Sign-in method
2. 이메일/비밀번호 활성화
3. 관리자 사용자 생성

자세한 설정은 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)를 참조하세요.

## 📚 데모 페이지

### 🏠 홈페이지 (`/`)

- 프로젝트 소개
- 주요 기능 소개
- 빠른 시작 가이드

### 📖 시작하기 (`/getting-started`)

- 설치 방법
- 기본 설정
- 첫 번째 번역

### 🎨 쇼케이스 (`/showcase`)

- 실제 프로젝트 예제
- 다양한 사용 사례
- 베스트 프랙티스

### ⚡ Server Example (`/server-example`)

- Server Components 예제
- SSR 번역
- 성능 최적화

### 📘 문서 (`/docs`)

- i18nexus Core 문서
- i18nexus Tools 문서
- API 레퍼런스

### 🔐 관리자 (`/admin`)

- 로그인 (`/admin/login`)
- 대시보드 (`/admin/dashboard`)
- 프로젝트 관리
- 통계 및 분석

## 🛠️ 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트
npm run lint

# i18n 키 추출
npm run i18n:extract

# 번역 다운로드
npm run i18n:download
```

## 🎨 커스터마이징

### 스타일 수정

`app/globals.css`에서 전역 스타일을 수정할 수 있습니다:

```css
:root {
  --primary-color: #0070f3;
  --secondary-color: #ff4081;
  /* ... */
}
```

### 컴포넌트 추가

`shared/ui/` 폴더에 공통 UI 컴포넌트를 추가합니다:

```tsx
// shared/ui/Button.tsx
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### 새 언어 추가

1. `i18nexus.config.json`에 언어 추가:

```json
{
  "supportedLanguages": ["ko", "en", "ja", "zh", "fr"]
}
```

2. 번역 파일 생성:

```bash
touch locales/fr.json
```

3. 번역 추가:

```json
{
  "welcome": "Bienvenue",
  "hello": "Bonjour, {{name}}"
}
```

## 📱 반응형 디자인

모든 페이지는 다양한 화면 크기에 최적화되어 있습니다:

- 📱 모바일 (< 768px)
- 💻 태블릿 (768px - 1024px)
- 🖥️ 데스크톱 (> 1024px)

## ♿ 접근성

WCAG 2.1 AA 레벨을 준수합니다:

- 키보드 네비게이션
- 스크린 리더 지원
- 적절한 대비율
- ARIA 속성

## 🚀 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

또는 [Vercel Dashboard](https://vercel.com)에서 GitHub 저장소를 연결하세요.

### 환경 변수 설정

Vercel Dashboard에서 환경 변수를 추가합니다:

1. 프로젝트 설정 > Environment Variables
2. `.env.local`의 모든 변수 추가
3. 재배포

자세한 내용은 [VERCEL_SETUP.md](../../VERCEL_SETUP.md)를 참조하세요.

## 🧪 테스트

```bash
# 단위 테스트
npm test

# E2E 테스트 (TODO)
npm run test:e2e

# 테스트 커버리지
npm run test:coverage
```

## 📊 성능

- ⚡ Lighthouse Score: 95+
- 🎯 First Contentful Paint: < 1s
- 🚀 Time to Interactive: < 2s
- 📦 Bundle Size: < 100KB (gzipped)

## 🐛 알려진 이슈

- [ ] 일부 브라우저에서 쿠키 설정 문제 (Safari)
- [ ] 네임스페이스 동적 로딩 시 깜빡임 (해결 중)

## 🤝 기여하기

데모 앱 개선에 기여해주세요:

1. 새로운 예제 추가
2. UI/UX 개선
3. 버그 수정
4. 문서 업데이트

## 📄 라이선스

MIT License

## 📞 지원

- 🐛 [이슈 리포트](https://github.com/manNomi/i18nexus/issues)
- 💬 [토론](https://github.com/manNomi/i18nexus/discussions)
- 📧 Email: support@i18nexus.com

## 🔗 관련 링크

- [i18nexus Core](../../packages/core/README.md)
- [i18nexus Tools](../../packages/tools/README.md)
- [Documentation](https://i18nexus.dev)
- [Blog](https://blog.i18nexus.dev)

---

**Made with ❤️ by the i18nexus team**
