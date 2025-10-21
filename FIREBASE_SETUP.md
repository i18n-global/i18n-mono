# 🔥 Firebase 설정 가이드

## 현재 상태

✅ 환경 변수 설정 완료  
✅ Firebase SDK 설치 완료  
⚠️ Firebase Console에서 추가 설정 필요

---

## 🚀 Firebase Console 설정 단계

### 1. Firestore Database 활성화

1. Firebase Console 접속: https://console.firebase.google.com/u/0/project/i18nexus/firestore
2. **"Create database"** 클릭
3. **Production mode** 선택 (보안 규칙 설정 예정)
4. 지역 선택: `asia-northeast3 (Seoul)` 권장
5. **"Enable"** 클릭

### 2. Firestore 보안 규칙 설정

Firestore Database > Rules 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // submissions 컬렉션
    match /submissions/{document} {
      // 읽기: 모두 가능 (공개 쇼케이스)
      allow read: if true;

      // 생성: 모두 가능 (사용자 제출)
      allow create: if true;

      // 수정/삭제: 인증된 사용자만 (관리자)
      allow update, delete: if request.auth != null;
    }
  }
}
```

**"Publish"** 클릭하여 규칙 저장

### 3. Authentication 활성화

1. Firebase Console 접속: https://console.firebase.google.com/u/0/project/i18nexus/authentication
2. **"Get started"** 클릭
3. **Sign-in method** 탭 선택
4. **Email/Password** 활성화
   - "Email/Password" 클릭
   - 첫 번째 옵션(Email/Password) **Enable** 토글
   - **"Save"** 클릭

### 4. 관리자 계정 생성

1. Authentication > **Users** 탭
2. **"Add user"** 클릭
3. 입력:
   ```
   Email: admin@i18nexus.com
   Password: [강력한 비밀번호 설정]
   ```
4. **"Add user"** 클릭

---

## 🔍 Firebase 설정 확인

개발 서버를 실행하면 화면 우측 하단에 Firebase 상태 표시:

```bash
npm run dev
```

### 상태 표시 의미

- ✅ **Authentication: Connected** - Firebase Auth 정상 작동
- ✅ **Firestore: Connected** - Firestore 정상 작동
- ⚠️ **Firestore: Setup Needed** - Firestore Database 생성 필요
- ❌ **Failed** - 환경 변수 또는 네트워크 오류

---

## 📝 현재 환경 변수 (`.env.local`)

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCoY0-CeXusR-bgiT1tn94LPvRLrqS1QdA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=i18nexus.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=i18nexus
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=i18nexus.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=967344995358
NEXT_PUBLIC_FIREBASE_APP_ID=1:967344995358:web:f6c8c8a8c8a8c8a8c8a8c8
```

---

## 🧪 테스트 방법

### 1. 프로젝트 제출 테스트

1. 브라우저에서 http://localhost:3000/showcase/submit 접속
2. URL 입력: `https://example.com`
3. "미리보기 생성" 클릭
4. 제출하기

**예상 결과**: Firestore `submissions` 컬렉션에 데이터 저장됨

### 2. 관리자 로그인 테스트

1. http://localhost:3000/admin/login 접속
2. 생성한 관리자 이메일/비밀번호로 로그인
3. 자동으로 `/admin/dashboard`로 이동

**예상 결과**: 제출된 프로젝트 목록 표시

### 3. 승인 테스트

1. Admin Dashboard에서 프로젝트 카드 확인
2. **"승인"** 버튼 클릭
3. http://localhost:3000/showcase 접속

**예상 결과**: 승인된 프로젝트가 공개 쇼케이스에 표시됨

---

## 🐛 문제 해결

### Firestore 연결 오류

**증상**: "Firestore: Setup Needed" 표시

**해결**:

1. Firebase Console에서 Firestore Database 생성 확인
2. 보안 규칙 설정 확인
3. 개발 서버 재시작: `npm run dev`

### Authentication 오류

**증상**: 로그인 실패

**해결**:

1. Firebase Console > Authentication 활성화 확인
2. Email/Password 로그인 방법 활성화 확인
3. 관리자 계정 생성 확인
4. 네트워크 탭에서 에러 메시지 확인

### 환경 변수 인식 안됨

**증상**: Firebase 초기화 오류

**해결**:

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 모든 변수가 `NEXT_PUBLIC_` 접두사를 가지는지 확인
3. 개발 서버 재시작 (환경 변수 변경 시 필수)

---

## 📊 Firebase Console 바로가기

- **프로젝트 개요**: https://console.firebase.google.com/u/0/project/i18nexus
- **Firestore Database**: https://console.firebase.google.com/u/0/project/i18nexus/firestore
- **Authentication**: https://console.firebase.google.com/u/0/project/i18nexus/authentication
- **프로젝트 설정**: https://console.firebase.google.com/u/0/project/i18nexus/settings/general

---

## ✅ 완료 체크리스트

- [ ] Firestore Database 생성
- [ ] Firestore 보안 규칙 설정
- [ ] Authentication 활성화
- [ ] Email/Password 로그인 활성화
- [ ] 관리자 계정 생성
- [ ] 개발 서버에서 Firebase 상태 확인
- [ ] 프로젝트 제출 테스트
- [ ] 관리자 로그인 테스트
- [ ] 승인/거부 기능 테스트

---

## 🎉 설정 완료 후

모든 설정이 완료되면:

1. 우측 하단 Firebase Status가 모두 ✅ 표시
2. `/showcase/submit`에서 프로젝트 제출 가능
3. `/admin/dashboard`에서 제출 관리 가능
4. `/showcase`에서 승인된 프로젝트 공개 표시

Firebase 연동이 완료되었습니다! 🚀
