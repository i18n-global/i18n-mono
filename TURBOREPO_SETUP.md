# Turborepo 설정 가이드

## 커밋 컨벤션

모든 커밋은 다음 형식을 따라야 합니다:

```
<type>[<scope>]: <subject>
```

### 필수 Scope

- `core` - i18nexus 패키지
- `tools` - i18nexus-tools 패키지
- `demo` - demo 앱

### Type

- `feat` - 새로운 기능
- `fix` - 버그 수정
- `docs` - 문서 변경
- `style` - 코드 포맷팅 (기능 변경 없음)
- `refactor` - 리팩토링
- `test` - 테스트 추가/수정
- `chore` - 빌드/설정 변경

### 예시

```bash
feat[core]: add lazy loading support
fix[tools]: fix extractor crash on empty files
docs[demo]: update getting started guide
```

## 자동 버전 관리 및 배포

### Release 커밋 형식

특정 형식의 커밋 메시지를 사용하면 자동으로 버전 업데이트와 NPM 배포가 진행됩니다:

```
feat[<scope>]: version <X.X.X> release
```

### 예시

```bash
# Core 패키지 2.12.0 릴리즈
git commit -m "feat[core]: version 2.12.0 release"

# Tools 패키지 1.5.0 릴리즈
git commit -m "feat[tools]: version 1.5.0 release"

# Demo 앱 3.4.0 릴리즈
git commit -m "feat[demo]: version 3.4.0 release"
```

### 자동 실행 프로세스

1. **커밋 감지**: GitHub Actions가 release 패턴 감지
2. **버전 업데이트**: `package.json`의 version 필드 자동 업데이트
3. **빌드**: Turbo 캐시를 활용한 빌드 실행
4. **배포**:
   - Core/Tools: NPM에 자동 배포
   - Demo: Vercel에서 자동 배포 (GitHub 연동)
5. **태그 생성**: `core-vX.X.X`, `tools-vX.X.X`, `demo-vX.X.X` 형태의 Git 태그 생성

## Turbo 원격 캐싱 설정

### 1. Vercel에서 Turbo 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. Settings → Turborepo → Enable Remote Caching
3. `TURBO_TOKEN` 생성

### 2. GitHub Secrets 설정

Repository → Settings → Secrets and variables → Actions

다음 secrets 추가:
- `TURBO_TOKEN`: Vercel에서 생성한 토큰
- `TURBO_TEAM`: Vercel 팀 ID (선택사항)
- `NPM_TOKEN`: NPM 배포를 위한 토큰

### 3. 로컬에서 캐싱 사용

```bash
# .env 파일에 추가
TURBO_TOKEN=your-token-here
TURBO_TEAM=your-team-id-here

# 또는 환경변수 직접 설정
export TURBO_TOKEN=your-token-here
export TURBO_TEAM=your-team-id-here
```

## CI/CD 파이프라인

### CI (Continuous Integration)

- **트리거**: Push to main, Pull Request
- **작업**:
  1. 변경된 패키지 감지
  2. 의존성 설치
  3. 린트 실행
  4. 빌드 실행 (Turbo 캐시 활용)
  5. 테스트 실행 (Turbo 캐시 활용)

### CD (Continuous Deployment)

- **트리거**: `feat[scope]: version X.X.X release` 커밋
- **작업**:
  1. 버전 번호 파싱
  2. `package.json` 버전 업데이트
  3. Turbo로 빌드
  4. NPM 배포 (Core/Tools)
  5. Git 태그 생성 및 푸시

## 패키지별 배포

### Core 패키지 (i18nexus)

```bash
# 버전 업데이트 및 배포
git add packages/core/
git commit -m "feat[core]: version 2.12.0 release"
git push origin main

# 자동 실행:
# 1. package.json 버전 2.12.0으로 업데이트
# 2. NPM에 i18nexus@2.12.0 배포
# 3. core-v2.12.0 태그 생성
```

### Tools 패키지 (i18nexus-tools)

```bash
# 버전 업데이트 및 배포
git add packages/tools/
git commit -m "feat[tools]: version 1.5.0 release"
git push origin main

# 자동 실행:
# 1. package.json 버전 1.5.0으로 업데이트
# 2. NPM에 i18nexus-tools@1.5.0 배포
# 3. tools-v1.5.0 태그 생성
```

### Demo 앱

```bash
# 버전 업데이트
git add apps/demo/
git commit -m "feat[demo]: version 3.4.0 release"
git push origin main

# 자동 실행:
# 1. package.json 버전 3.4.0으로 업데이트
# 2. demo-v3.4.0 태그 생성
# 3. Vercel이 자동으로 배포 (GitHub push 감지)
```

## Turbo 캐싱 확인

```bash
# 첫 빌드 (캐시 없음)
npx turbo run build

# 두 번째 빌드 (캐시 히트)
npx turbo run build
# >>> FULL TURBO 메시지 확인

# 캐시 상태 확인
npx turbo run build --summarize
```

## 문제 해결

### Commitlint 에러

```bash
# 커밋 메시지 형식 확인
feat[core]: add new feature  # ✅ 올바름
feat: add new feature        # ❌ scope 누락
feat(core): add new feature  # ❌괄호 대신 대괄호 사용
```

### Turbo 캐시 문제

```bash
# 캐시 삭제
npx turbo run build --force

# 로그 확인
npx turbo run build --verbosity=3
```

### NPM 배포 실패

1. `NPM_TOKEN`이 GitHub Secrets에 올바르게 설정되어 있는지 확인
2. NPM 계정에 해당 패키지 배포 권한이 있는지 확인
3. 버전이 이미 NPM에 존재하는지 확인

```bash
# NPM 버전 확인
npm view i18nexus versions
npm view i18nexus-tools versions
```

## 참고

- [Turborepo 문서](https://turbo.build/repo/docs)
- [Commitlint 문서](https://commitlint.js.org/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

