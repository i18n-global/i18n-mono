# 🔥 Firebase 빠른 설정 가이드

`auth/invalid-credential` 에러가 발생하는 이유는 **Firebase Authentication이 아직 활성화되지 않았거나 사용자 계정이 없기 때문**입니다.

## 📋 설정 체크리스트

### ✅ Step 1: Firebase Authentication 활성화

1. [Firebase Console](https://console.firebase.google.com/u/0/project/i18nexus/authentication) 접속
2. 좌측 메뉴에서 **"Authentication"** 클릭
3. **"Get Started"** 또는 **"시작하기"** 버튼 클릭

### ✅ Step 2: 이메일/비밀번호 로그인 활성화

1. **"Sign-in method"** 탭 클릭
2. **"Email/Password"** 찾기
3. **"Enable"** (활성화) 토글 ON
4. **"Save"** 클릭

### ✅ Step 3: 관리자 계정 생성

1. **"Users"** 탭 클릭
2. **"Add user"** 버튼 클릭
3. 정보 입력:
   - Email: `admin@i18nexus.com` (원하는 이메일)
   - Password: 최소 6자 이상 (예: `admin123456`)
4. **"Add user"** 클릭

### ✅ Step 4: Firestore Database 생성

1. 좌측 메뉴에서 **"Firestore Database"** 클릭
2. **"Create database"** 버튼 클릭
3. **Location**: 가까운 지역 선택 (예: `asia-northeast3 (Seoul)`)
4. **Security rules**: **"Start in test mode"** 선택
   - 30일 동안 모든 읽기/쓰기 허용 (개발용)
5. **"Enable"** 클릭

⚠️ **프로덕션 전 보안 규칙 수정 필수!**

### ✅ Step 5: Firestore 인덱스 생성 ⭐ 중요!

인덱스가 없으면 `The query requires an index` 에러가 발생합니다.

#### 방법 1: 자동 생성 링크 사용 (추천)

1. 브라우저 콘솔(F12)에서 에러 메시지 확인
2. 콘솔에 출력된 **🔗 Firestore 인덱스 생성 링크** 클릭
3. Firebase Console에서 **"Create Index"** 버튼 클릭
4. 인덱스 생성 완료까지 **2-5분** 대기

#### 방법 2: 수동 생성

1. [Firestore Indexes](https://console.firebase.google.com/u/0/project/i18nexus/firestore/indexes) 접속
2. **"Create Index"** 클릭
3. 다음 정보 입력:
   - Collection ID: `submissions`
   - Fields to index:
     - Field: `approved`, Order: `Ascending`
     - Field: `submittedAt`, Order: `Descending`
   - Query scope: `Collection`
4. **"Create"** 클릭
5. 인덱스 상태가 **"Enabled"**가 될 때까지 대기

#### 필요한 인덱스 목록:

```
컬렉션: submissions
- approved (Ascending) + submittedAt (Descending)
```

## 🧪 테스트

설정 완료 후:

1. 개발 서버 재시작: `npm run dev`
2. `/admin/login` 페이지 접속
3. Step 3에서 생성한 이메일/비밀번호로 로그인

## 🔐 보안 규칙 (프로덕션용)

테스트 모드 만료 전에 Firestore 규칙 업데이트:

### 방법 1: Firebase Console에서 직접 업데이트 (빠름)

1. [Firestore Rules](https://console.firebase.google.com/u/0/project/i18nexus/firestore/rules) 접속
2. 다음 규칙을 복사해서 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Submissions 컬렉션
    match /submissions/{submissionId} {
      // 읽기: 모든 사용자 (approved=true만 클라이언트에서 필터링)
      allow read: if true;

      // 생성: 모든 사용자 (제출 허용)
      allow create: if true;

      // 업데이트/삭제: 인증된 사용자만 (관리자)
      allow update, delete: if request.auth != null;
    }
  }
}
```

3. **"Publish"** 버튼 클릭

### 방법 2: Firebase CLI로 배포

프로젝트 루트에 `firestore.rules` 파일이 이미 준비되어 있습니다.

```bash
# Firebase CLI 설치 (처음 한번만)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firestore Rules 배포
firebase deploy --only firestore:rules
```

## 🚨 자주 발생하는 에러

### `auth/invalid-credential`

➡️ **해결**: Step 3에서 입력한 이메일/비밀번호가 맞는지 확인

### `auth/configuration-not-found`

➡️ **해결**: `.env.local` 파일의 Firebase 설정 확인

### `The query requires an index` ⭐

➡️ **해결**: Step 5 인덱스 생성 (가장 중요!)
➡️ 브라우저 콘솔(F12)에서 **🔗 인덱스 생성 링크** 확인 및 클릭

### `Missing or insufficient permissions` ⭐

이 에러는 **Firestore Security Rules가 접근을 거부**할 때 발생합니다.

➡️ **해결 방법**:

1. [Firestore Rules](https://console.firebase.google.com/u/0/project/i18nexus/firestore/rules) 접속
2. 위의 **"🔐 보안 규칙 (프로덕션용)"** 섹션의 규칙을 복사해서 붙여넣기
3. **"Publish"** 버튼 클릭
4. 페이지 새로고침

또는 Step 4에서 **"Start in test mode"**를 선택했는지 확인하세요.

## 💡 인덱스 생성 팁

- 인덱스 생성은 **2-5분** 소요됨
- 브라우저 콘솔에 **🔗 Firestore 인덱스 생성 링크**가 출력됨
- 링크를 클릭하면 자동으로 올바른 인덱스 설정이 입력됨
- 여러 필터 조합마다 다른 인덱스가 필요할 수 있음

## 📞 도움말

설정 중 문제가 발생하면:

- Firebase Console에서 **Authentication > Users**에 사용자가 생성되었는지 확인
- Firestore Database가 **"Enabled"** 상태인지 확인
- **Firestore > Indexes 탭**에서 인덱스가 **"Enabled"** 상태인지 확인 (Building 중이면 대기)
- 브라우저 콘솔(F12)에서 상세한 에러 메시지 및 인덱스 링크 확인
- `FIREBASE_SETUP.md` 파일 참고
