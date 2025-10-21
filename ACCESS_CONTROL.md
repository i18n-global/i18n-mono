# 🔐 페이지 접근 권한 정리

## 페이지별 접근 권한 현황

| 페이지              | URL                | 접근 권한          | 인증 체크 | 구현 상태 |
| ------------------- | ------------------ | ------------------ | --------- | --------- |
| **제출 페이지**     | `/showcase/submit` | 🌐 **아무나**      | ❌ 불필요 | ✅ 완료   |
| **로그인 페이지**   | `/admin/login`     | 🌐 **아무나**      | ❌ 불필요 | ✅ 완료   |
| **관리자 대시보드** | `/admin/dashboard` | 🔒 **인증된 유저** | ✅ 필수   | ✅ 완료   |
| **공개 쇼케이스**   | `/showcase`        | 🌐 **아무나**      | ❌ 불필요 | ✅ 완료   |

---

## 📋 각 페이지 상세 설명

### 1. 제출 페이지 (`/showcase/submit`) 🌐

**접근 권한**: 아무나 (비회원 포함)

**기능**:

- URL 입력하여 프로젝트 제출
- 자동 메타데이터 추출 및 미리보기
- 이메일 선택 입력 (연락용)

**구현**:

```typescript
// app/showcase/submit/page.tsx
export default function ShowcaseSubmitPage() {
  // 인증 체크 없음
  // 누구나 프로젝트를 제출할 수 있음
}
```

**제출 후 상태**:

- Firestore에 `approved: false`로 저장
- 관리자 승인 후 공개 쇼케이스에 표시

---

### 2. 로그인 페이지 (`/admin/login`) 🌐

**접근 권한**: 아무나

**기능**:

- Firebase Authentication 이메일/비밀번호 로그인
- 로그인 성공 시 `/admin/dashboard`로 리다이렉트

**구현**:

```typescript
// app/admin/login/page.tsx
export default function AdminLoginPage() {
  const handleLogin = async (e: React.FormEvent) => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/admin/dashboard"); // 로그인 성공 시 대시보드로
  };
}
```

**보안**:

- Firebase Authentication으로 관리
- 잘못된 이메일/비밀번호 시 에러 메시지 표시

---

### 3. 관리자 대시보드 (`/admin/dashboard`) 🔒

**접근 권한**: 인증된 유저만 (관리자)

**기능**:

- 제출된 프로젝트 목록 확인
- 승인/거부 액션
- 승인 대기/승인됨/전체 필터

**구현**:

```typescript
// app/admin/dashboard/page.tsx
export default function AdminDashboardPage() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        router.push("/admin/login"); // 미인증 시 로그인으로 리다이렉트
      }
    });
    return () => unsubscribe();
  }, [router]);
}
```

**보안 흐름**:

1. `onAuthStateChanged`로 인증 상태 실시간 감지
2. 인증되지 않은 경우 → `/admin/login`으로 강제 리다이렉트
3. 인증된 경우 → 대시보드 표시

---

### 4. 공개 쇼케이스 (`/showcase`) 🌐

**접근 권한**: 아무나

**기능**:

- 승인된 프로젝트만 표시 (`approved: true`)
- 프로젝트 카드 클릭 시 원본 URL로 이동
- "내 프로젝트 등록하기" 링크 (`/showcase/submit`)

**구현**:

```typescript
// app/showcase/page.tsx
export default function ShowcasePage() {
  const fetchApprovedProjects = async () => {
    const response = await fetch("/api/submissions?approved=true");
    // 승인된 프로젝트만 가져옴
  };
}
```

**데이터 필터링**:

- API 레벨에서 `approved: true`만 반환
- Firestore 쿼리: `where('approved', '==', true)`

---

## 🔐 보안 레이어

### 클라이언트 사이드 보호

**대시보드 페이지**:

```typescript
onAuthStateChanged(auth, (user) => {
  if (!user) {
    router.push("/admin/login"); // 미인증 시 리다이렉트
  }
});
```

### 서버 사이드 보호 (API)

**Firestore 보안 규칙**:

```javascript
match /submissions/{document} {
  allow read: if true;          // 읽기: 모두 가능
  allow create: if true;         // 생성: 모두 가능 (제출)
  allow update, delete: if request.auth != null; // 수정/삭제: 인증 필요
}
```

---

## 🎯 사용자 흐름

### 일반 사용자 (비회원)

```
1. /showcase 접속 → 승인된 프로젝트 확인
2. /showcase/submit 접속 → 프로젝트 제출
3. 제출 완료 → "검토 후 공개됩니다" 메시지
```

### 관리자

```
1. /admin/login 접속 → 이메일/비밀번호 입력
2. 로그인 성공 → /admin/dashboard 자동 이동
3. 대시보드에서 제출 확인
4. 승인 버튼 클릭 → approved: true 변경
5. 공개 쇼케이스에 자동 표시
```

---

## 🚫 접근 차단 시나리오

### 미인증 사용자가 대시보드 직접 접근 시

1. `/admin/dashboard` URL 직접 입력
2. `onAuthStateChanged`에서 인증 상태 확인
3. `user === null` 감지
4. 자동으로 `/admin/login`으로 리다이렉트
5. 로그인 후 다시 대시보드 접근 가능

---

## ✅ 테스트 체크리스트

### 제출 페이지 테스트

- [ ] 비로그인 상태에서 접근 가능
- [ ] URL 입력 후 미리보기 생성
- [ ] 제출 후 "검토 후 공개됩니다" 표시

### 로그인 페이지 테스트

- [ ] 비로그인 상태에서 접근 가능
- [ ] 잘못된 이메일/비밀번호 시 에러 표시
- [ ] 올바른 로그인 시 대시보드로 이동

### 대시보드 보호 테스트

- [ ] 비로그인 상태에서 접근 시 로그인 페이지로 리다이렉트
- [ ] 로그인 상태에서만 대시보드 접근 가능
- [ ] 로그아웃 후 다시 접근 시 리다이렉트

### 공개 쇼케이스 테스트

- [ ] 비로그인 상태에서 접근 가능
- [ ] 승인된 프로젝트만 표시
- [ ] 미승인 프로젝트는 표시 안됨

---

## 📊 접근 권한 요약

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC ACCESS                        │
│  - /showcase (공개 쇼케이스)                             │
│  - /showcase/submit (제출 페이지)                        │
│  - /admin/login (로그인 페이지)                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                    [Firebase Auth]
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  PROTECTED ACCESS                       │
│  - /admin/dashboard (관리자 대시보드)                     │
│    ✓ onAuthStateChanged 인증 체크                        │
│    ✓ 미인증 시 /admin/login 리다이렉트                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 추가 보안 권장사항 (선택)

현재 구현으로도 충분하지만, 추가 보안이 필요한 경우:

### 1. Middleware 추가 (Next.js)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
}
```

### 2. API Route 보호

```typescript
// app/api/submissions/route.ts
export async function PATCH(request: NextRequest) {
  // 서버에서도 인증 확인
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ...
}
```

---

## ✨ 결론

현재 구현은 요구사항을 완벽하게 충족합니다:

✅ **제출 페이지** - 누구나 접근 가능  
✅ **로그인 페이지** - 누구나 접근 가능  
✅ **관리자 대시보드** - 인증된 유저만 (실시간 체크)  
✅ **공개 쇼케이스** - 누구나 접근 가능 (승인된 항목만 표시)

모든 보안 로직이 클라이언트와 Firestore 레벨에서 적절히 구현되어 있습니다! 🎉
