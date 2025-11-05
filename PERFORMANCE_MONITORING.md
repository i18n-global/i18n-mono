# 🚀 Performance Monitoring - Quick Start

## ✅ 설치 완료!

성능 측정 기능이 `i18nexus-tools`에 추가되었습니다.

## 📊 기본 사용법

### 1. 로컬에서 성능 측정

```bash
# 성능 모니터링 활성화
I18N_PERF_MONITOR=true npx i18n-wrapper

# 상세 정보 출력
I18N_PERF_VERBOSE=true npx i18n-wrapper
```

**출력 예시:**

```
📁 Found 150 files to process...
✅ Translation wrapper completed in 2847ms
📊 Processed 150 files

📊 Performance Report
════════════════════════════════════════════════════════════════════════════════
⏱️  Total Duration: 2847.23ms
📈 Total Operations: 458
📊 Average Duration: 6.22ms
🐌 Slowest: processFiles:parse (342.15ms)
⚡ Fastest: processFiles:readFile (0.12ms)
════════════════════════════════════════════════════════════════════════════════
```

### 2. Sentry 연동

#### Step 1: Sentry 계정 생성

1. https://sentry.io 에서 회원가입
2. New Project 생성
3. DSN 복사 (예: `https://abc123@o123.ingest.sentry.io/456`)

#### Step 2: 환경 변수 설정

```bash
export SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# 실행
npx i18n-wrapper
```

#### Step 3: Sentry 대시보드에서 확인

- **Performance 탭**: 실행 시간 추이
- **Issues 탭**: 느린 작업 경고
- **Discover 탭**: 커스텀 쿼리

## 🎯 측정되는 항목

### 파일 처리

| 메트릭 | 설명 |
|--------|------|
| `processFiles:total` | 전체 처리 시간 |
| `processFiles:glob` | 파일 찾기 |
| `processFiles:parse` | AST 파싱 |
| `processFiles:analyzeConstants` | 상수 분석 |
| `analyzeExternalFile` | 외부 파일 분석 |

### 메모리 사용량

- Heap Used
- Heap Total
- RSS (Resident Set Size)

### 에러 추적

- 파싱 에러
- 파일 접근 에러
- 모든 에러에 파일 컨텍스트 포함

## 📝 Configuration (선택사항)

`i18nexus.config.json`에 추가:

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{js,jsx,ts,tsx}",
  "enablePerformanceMonitoring": true,
  "sentryDsn": "https://your-dsn@sentry.io/project-id"
}
```

## 🔧 환경 변수

```bash
# 성능 모니터링 활성화/비활성화 (기본: true)
I18N_PERF_MONITOR=true

# 상세 출력 (기본: false)
I18N_PERF_VERBOSE=true

# Sentry DSN
SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# 환경 (development, staging, production)
NODE_ENV=production
```

## 🎨 CI/CD 통합

### GitHub Actions 예시

```yaml
name: i18n Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run i18n wrapper with monitoring
        env:
          I18N_PERF_MONITOR: true
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
        run: npx i18n-wrapper
```

## 📈 성능 최적화 팁

### 1. 느린 파싱 발견시

```bash
# .i18nexusignore 파일 생성
echo "src/legacy/**" >> .i18nexusignore
```

### 2. 많은 외부 파일 분석시

```json
{
  "constantPatterns": ["_ITEMS", "_MENU", "_CONFIG"]
}
```

### 3. 메모리 사용량이 높을 때

```bash
# 배치 처리
node --max-old-space-size=4096 node_modules/.bin/i18n-wrapper
```

## 🐛 문제 해결

### Sentry에 데이터가 안 보일 때

```bash
# DSN 확인
echo $SENTRY_DSN

# 연결 테스트
curl -I https://sentry.io/api/0/

# 디버그 모드
DEBUG=sentry:* npx i18n-wrapper
```

### 성능 측정이 너무 느릴 때

```bash
# 개발 환경에서 비활성화
NODE_ENV=development I18N_PERF_MONITOR=false npx i18n-wrapper
```

## 📚 더 알아보기

- [상세 가이드](./docs/guides/performance-monitoring.md)
- [Configuration 가이드](./docs/guides/configuration.md)
- [Sentry 공식 문서](https://docs.sentry.io/)

## 💡 실전 사용 예시

### 예시 1: 빌드 시간 최적화

```bash
# Before
$ npx i18n-wrapper
✅ Completed in 12,345ms

# 성능 분석 실행
$ I18N_PERF_VERBOSE=true npx i18n-wrapper
# → 발견: ComplexComponent.tsx 파싱에 3초 소요

# .i18nexusignore 추가 후
$ npx i18n-wrapper
✅ Completed in 3,456ms  # 3.6배 빠름!
```

### 예시 2: Sentry로 성능 추적

```bash
# 매일 빌드 실행
$ SENTRY_DSN="..." npx i18n-wrapper

# Sentry 대시보드에서 확인
# - 평균 빌드 시간: 2.5초
# - 가장 느린 파일: Header.tsx (850ms)
# - 메모리 사용: 평균 145MB
```

### 예시 3: CI/CD에서 성능 회귀 감지

```yaml
# GitHub Actions
- name: Build with performance tracking
  env:
    SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
  run: |
    npx i18n-wrapper
    
# Sentry에서 알림 설정
# - 빌드 시간 > 5초: Slack 알림
# - 메모리 사용 > 500MB: 이메일 알림
```

## 🎉 완료!

성능 모니터링이 설정되었습니다. 이제 다음을 할 수 있습니다:

- ✅ 각 함수의 실행 시간 측정
- ✅ 메모리 사용량 추적
- ✅ Sentry로 성능 데이터 전송
- ✅ 느린 작업 자동 감지
- ✅ 빌드 성능 최적화

궁금한 점이 있으시면:
- 📖 [문서](./docs/README.md)
- 🐛 [이슈](https://github.com/i18n-global/i18nexus-tools/issues)
- 💬 [토론](https://github.com/i18n-global/i18nexus-tools/discussions)

