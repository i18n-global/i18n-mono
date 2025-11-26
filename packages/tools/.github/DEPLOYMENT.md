# NPM 배포 가이드

## 자동 배포 설정

이 워크플로우는 GitHub Actions를 통해 npm에 자동으로 배포합니다.

### 필요한 Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secret을 추가해야 합니다:

1. **NPM_TOKEN**: npm 계정의 Access Token
   - npm.com에서 "Access Tokens" 메뉴에서 생성
   - "Automation" 타입의 토큰을 권장합니다

### 배포 트리거

#### 자동 배포
- `main` 브랜치에 push 시 자동으로 버전을 올리고 배포
- 커밋 메시지에서 버전 타입을 자동 감지:
  - `release: major` 또는 `[major]` → major 버전 증가
  - `release: minor` 또는 `[minor]` → minor 버전 증가
  - `release: patch` 또는 `[patch]` → patch 버전 증가
  - 버전 타입이 없으면 기본적으로 patch 버전 증가

#### 수동 배포
- GitHub Actions에서 "Publish to npm" 워크플로우를 수동 실행
- 버전 타입 선택 가능 (patch, minor, major)

### 배포 프로세스

1. 버전 타입 결정 (커밋 메시지 또는 수동 입력)
2. package.json 버전 업데이트
3. Git 태그 생성 및 푸시
4. 패키지 빌드 및 테스트
5. npm에 배포 (이미 배포된 버전은 건너뜀)
6. GitHub Release 생성

### 버전 관리

- 버전은 Semantic Versioning을 따릅니다
- 이미 배포된 버전은 자동으로 건너뜁니다
- 배포 후 자동으로 Git 태그가 생성됩니다

