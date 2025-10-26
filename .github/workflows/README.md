# GitHub Actions Workflows

이 디렉토리에는 i18nexus 패키지의 CI/CD 워크플로우가 포함되어 있습니다.

## 📋 Workflows

### 1. CI Workflow (`ci.yml`)

Pull Request 및 개발 브랜치의 코드 품질을 보장합니다.

**트리거:**

- Pull Request가 main 브랜치로 열릴 때
- main 브랜치가 아닌 브랜치에 푸시될 때

**작업:**

- 린터 검사
- 테스트 실행 (Node.js 16, 18, 20)
- 빌드 검증
- 패키지 배포 가능 여부 확인

### 2. Publish Workflow (`publish.yml`)

main 브랜치에 푸시될 때 npm에 자동으로 배포합니다.

**트리거:**

- main 브랜치에 푸시될 때
- packages/i18nexus 디렉토리의 변경사항이 있을 때

**작업:**

1. 테스트 실행
2. 패키지 빌드
3. 버전 확인 (이미 배포된 버전인지 체크)
4. npm 배포 (새 버전인 경우만)
5. Git 태그 생성
6. GitHub Release 생성

**중요:** NPM_TOKEN 시크릿이 설정되어 있어야 합니다.

## 🔧 필수 설정

### NPM Token

1. [npmjs.com](https://www.npmjs.com)에서 Access Token 생성:
   - 계정 Settings → Access Tokens → Generate New Token
   - Token Type: **Automation**
   - 생성된 토큰 복사

2. GitHub Repository Settings에서 Secret 추가:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `NPM_TOKEN`
   - Value: 복사한 npm 토큰

## 📚 추가 문서

자세한 배포 가이드는 [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md)를 참조하세요.
