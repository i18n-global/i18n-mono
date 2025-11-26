# Turborepo 설정 완료

## 생성된 파일

### 1. 루트 package.json
- Workspaces 설정: `packages/*`, `apps/*`
- Turborepo 스크립트 추가
- Turbo 의존성 추가

### 2. turbo.json
- 빌드 파이프라인 설정
- 의존성 그래프 기반 빌드
- 캐싱 설정

### 3. 최적화된 배포 워크플로우
- 변경 감지 자동화
- 조건부 배포
- 의존성 인식 배포

## 사용 방법

### 로컬 개발

```bash
# 모든 패키지 빌드
npm run build

# 특정 패키지만 빌드
npx turbo run build --filter=i18nexus

# 테스트
npm run test

# 개발 모드 (watch)
npm run dev
```

### 배포

#### 자동 배포 (변경 감지)
- `packages/core/**` 변경 시 → Core만 배포
- `packages/tools/**` 변경 시 → Tools만 배포
- `apps/demo/**` 또는 의존 패키지 변경 시 → Demo 배포

#### 수동 배포
GitHub Actions에서 "Deploy Packages" 워크플로우를 수동 실행하고 패키지 선택:
- `all`: 모든 패키지 배포
- `core`: Core만 배포
- `tools`: Tools만 배포
- `demo`: Demo만 배포

## 최적화 포인트

### 1. 변경 감지
- `dorny/paths-filter` 사용
- 변경된 패키지만 빌드/배포

### 2. Turborepo 캐싱
- 변경되지 않은 패키지는 재빌드하지 않음
- 캐시는 `.turbo` 디렉토리에 저장

### 3. 의존성 그래프
- Core 변경 시 Demo도 자동 감지
- 의존성 순서대로 빌드

### 4. 병렬 실행
- 독립적인 패키지는 병렬로 빌드/테스트

## 필요한 Secrets

GitHub 저장소 Settings → Secrets and variables → Actions:

- `NPM_TOKEN`: npm 배포용
- `VERCEL_TOKEN`: Vercel 배포용
- `VERCEL_ORG_ID`: Vercel Organization ID
- `VERCEL_PROJECT_ID`: Vercel Project ID

## 다음 단계

1. ✅ Turborepo 설정 완료
2. ✅ 최적화된 배포 워크플로우 생성
3. ✅ CI 워크플로우 업데이트
4. ⏳ 빌드 에러 수정 (진행 중)
5. ⏳ 테스트 및 검증

