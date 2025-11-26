# 🌍 i18nexus Showcase System

Firebase 기반의 프로젝트 쇼케이스 시스템으로, i18nexus를 사용하는 실제 프로젝트들을 자동으로 수집하고 관리합니다.

## ✨ 주요 기능

### 사용자 기능

- **3초 제출**: URL만 입력하면 자동으로 메타데이터 수집
- **실시간 미리보기**: microlink.io를 통한 자동 썸네일 생성
- **간편한 UX**: 최소한의 입력으로 최대의 효과
- **모바일 최적화**: 스마트폰에서도 편리한 제출 및 탐색

### 관리자 기능

- **승인 시스템**: Firebase Auth 기반 보안 로그인
- **직관적 대시보드**: 제출/승인/거부를 한 화면에서
- **필터링**: 승인 대기/승인됨/전체 탭으로 쉬운 관리
- **반응형 UI**: 데스크탑/태블릿/모바일 모두 최적화

## 🚀 시작하기

### 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Firestore Database 활성화 (production mode)
3. Authentication 활성화 (Email/Password 활성화)
4. 프로젝트 설정에서 웹 앱 추가 후 config 정보 복사

### 2. 환경 변수 설정

`.env.local` 파일에 Firebase 설정 추가:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore 보안 규칙 설정

Firebase Console > Firestore Database > Rules에서:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // submissions 컬렉션
    match /submissions/{document} {
      // 읽기: 모두 가능
      allow read: if true;

      // 생성: 모두 가능 (사용자 제출)
      allow create: if true;

      // 수정/삭제: 인증된 사용자만 (관리자)
      allow update, delete: if request.auth != null;
    }
  }
}
```

### 4. 관리자 계정 생성

Firebase Console > Authentication > Users > Add user:

```
Email: admin@yourproject.com
Password: (secure password)
```

### 5. 개발 서버 실행

```bash
pnpm dev
# 또는
npm run dev
```

## 📂 프로젝트 구조

```
app/
├── showcase/
│   ├── page.tsx              # 공개 쇼케이스 페이지
│   └── submit/
│       └── page.tsx          # 프로젝트 제출 페이지
├── admin/
│   ├── login/
│   │   └── page.tsx          # 관리자 로그인
│   └── dashboard/
│       └── page.tsx          # 관리자 대시보드
├── api/
│   ├── metadata/
│   │   └── route.ts          # URL 메타데이터 추출
│   └── submissions/
│       └── route.ts          # 제출 CRUD API
└── components/
    └── ProjectCard.tsx       # 프로젝트 카드 컴포넌트

lib/
└── firebase.ts               # Firebase 클라이언트 설정
```

## 🔗 페이지 URL

| 페이지   | URL                | 접근 권한 | 설명                 |
| -------- | ------------------ | --------- | -------------------- |
| 쇼케이스 | `/showcase`        | 공개      | 승인된 프로젝트 목록 |
| 제출     | `/showcase/submit` | 공개      | 프로젝트 제출 폼     |
| 로그인   | `/admin/login`     | 공개      | 관리자 로그인        |
| 대시보드 | `/admin/dashboard` | 인증 필요 | 제출 관리            |

## 🎯 사용 흐름

### 사용자 제출 흐름

1. `/showcase/submit` 페이지 접속
2. URL 입력 → "미리보기 생성" 클릭
3. 자동으로 제목, 설명, 썸네일 생성됨
4. (선택) 프로젝트 이름 수정
5. 동의 체크박스 선택
6. 제출 → Firestore에 `approved: false`로 저장

### 관리자 승인 흐름

1. `/admin/login`에서 로그인
2. `/admin/dashboard`로 자동 이동
3. "승인 대기 중" 탭에서 제출 확인
4. 미리보기 카드로 내용 검토
5. [승인] 클릭 → `approved: true`로 변경
6. 또는 [삭제] 클릭 → Firestore에서 삭제

### 공개 표시 흐름

1. `/showcase` 페이지에서 `approved: true`인 프로젝트만 표시
2. 카드 클릭 시 원본 URL로 이동

## 🗄️ Firestore 데이터 구조

**컬렉션**: `submissions`

**Document 필드**:

```typescript
{
  url: string; // 프로젝트 URL (필수)
  projectName: string | null; // 사용자 입력 이름 (선택)
  autoTitle: string; // 자동 추출된 제목
  autoDescription: string; // 자동 추출된 설명
  thumbnailUrl: string; // 썸네일 URL (microlink.io)
  contactEmail: string | null; // 연락처 이메일 (선택)
  approved: boolean; // 승인 상태 (기본: false)
  submittedAt: Timestamp; // 제출 시각
}
```

## 🔌 API 엔드포인트

### POST `/api/metadata`

URL에서 메타데이터 추출

**요청**:

```json
{
  "url": "https://example.com"
}
```

**응답**:

```json
{
  "autoTitle": "Example Site",
  "autoDescription": "Site description",
  "thumbnailUrl": "https://...",
  "url": "https://example.com"
}
```

### POST `/api/submissions`

새 제출 생성

**요청**:

```json
{
  "url": "https://example.com",
  "projectName": "My Project",
  "autoTitle": "Example",
  "autoDescription": "Description",
  "thumbnailUrl": "https://...",
  "contactEmail": "user@example.com"
}
```

### GET `/api/submissions?approved=true`

제출 목록 조회 (필터 옵션)

### PATCH `/api/submissions`

제출 수정 (승인/거부)

**요청**:

```json
{
  "id": "doc_id",
  "approved": true
}
```

### DELETE `/api/submissions?id=doc_id`

제출 삭제

## 🎨 커스터마이징

### 썸네일 서비스 변경

`app/api/metadata/route.ts`에서 microlink.io 대신 다른 서비스 사용 가능:

- [urlbox.io](https://urlbox.io/)
- [screenshotapi.net](https://screenshotapi.net/)
- [apiflash.com](https://apiflash.com/)

### 스타일 수정

Tailwind CSS 반응형 클래스로 쉽게 커스터마이징 가능:

- `app/_entities/project/ui/ProjectCard.tsx` - 카드 디자인
- `app/_widgets/showcase-list/ui/ShowcaseList.tsx` - 쇼케이스 레이아웃
- `app/_widgets/admin-dashboard/ui/AdminDashboard.tsx` - 대시보드 UI
- `app/_widgets/navigation/ui/Navigation.tsx` - 반응형 네비게이션

**모바일 최적화 패턴:**
```tsx
// 텍스트 크기
className="text-base sm:text-xl md:text-2xl"

// 패딩
className="p-4 sm:p-6 lg:p-8"

// 버튼
className="px-6 py-3 sm:px-8 sm:py-4"
```

## 🔒 보안 고려사항

### 이미 구현된 보안

✅ Firestore 읽기 규칙: 공개 (쇼케이스용)  
✅ Firestore 쓰기 규칙: 인증 필요 (관리자만)  
✅ 클라이언트 인증 체크: `onAuthStateChanged`  
✅ API 오류 처리: try-catch 및 적절한 HTTP 상태 코드

### 추가 권장사항

- [ ] Rate limiting 추가 (제출 남용 방지)
- [ ] reCAPTCHA 통합 (봇 방지)
- [ ] 이메일 알림 (새 제출 시 관리자에게)
- [ ] 로그 시스템 (감사 추적)

## 🚀 배포

### Vercel 배포

1. GitHub에 푸시
2. Vercel에 연결
3. 환경 변수 설정 (Firebase config)
4. 배포 완료!

### 환경 변수 확인

배포 전 `.env.local`의 모든 변수를 Vercel/Netlify 대시보드에 추가:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## 📊 모니터링

### Firebase Console에서 확인 가능

- **Firestore**: 제출 수, 승인율
- **Authentication**: 활성 관리자 수
- **Usage**: API 호출 횟수, 데이터 전송량

## 🐛 트러블슈팅

### "Failed to fetch metadata"

- microlink.io API 제한 확인
- URL이 공개적으로 접근 가능한지 확인
- CORS 정책 확인

### Firebase 초기화 오류

- `.env.local`의 모든 변수가 설정되었는지 확인
- `NEXT_PUBLIC_` 접두사 확인
- 개발 서버 재시작

### 관리자 로그인 실패

- Firebase Authentication에서 Email/Password 활성화 확인
- 관리자 계정이 생성되었는지 확인
- 네트워크 탭에서 인증 오류 확인

## 📝 라이선스

MIT License - 자유롭게 사용하세요!

## 🙏 기여

이슈와 PR은 언제나 환영합니다!

---

Made with ❤️ for the i18nexus community
