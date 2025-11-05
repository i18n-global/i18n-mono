# 🔒 보안 가이드

## ⚠️ DSN 보안 주의사항

### Sentry DSN의 특성

Sentry DSN은 **공개 키(Public Key)**입니다:
- ✅ 클라이언트 사이드에서 사용하도록 설계됨
- ✅ 프론트엔드 코드에 포함 가능
- ✅ 읽기 전용 (Sentry 데이터는 읽을 수 없음)

**하지만 주의:**
- ❌ 악의적 사용자가 스팸 데이터 전송 가능
- ❌ Quota 고갈 공격 가능
- ❌ Rate limiting 문제 발생 가능

---

## 🛡️ 보안 전략

### 1. 소스 코드에 DSN 노출 방지 ✅

**현재 구조 (안전):**

```typescript
// scripts/performance-monitor.ts
// ✅ 소스 코드에는 환경 변수만 있음
const DEFAULT_SENTRY_DSN = process.env.I18NEXUS_TOOLS_SENTRY_DSN || "";
```

**빌드 프로세스:**
```bash
# 1. 로컬/개발 환경 (DSN 노출 안 됨)
git add scripts/performance-monitor.ts
git commit -m "Add performance monitoring"
git push  # ✅ DSN이 GitHub에 올라가지 않음

# 2. 배포 시에만 DSN 주입
I18NEXUS_TOOLS_SENTRY_DSN="your-dsn" npm run build

# 3. npm 배포
npm publish  # ✅ dist/ 폴더만 배포됨
```

### 2. .gitignore 설정 ✅

```gitignore
# ✅ 빌드된 파일은 Git에 올리지 않음
dist/

# ✅ 환경 변수 파일도 제외
.env
.env.local
.env.*.local
```

**확인:**
```bash
# dist/ 폴더가 Git에 추적되지 않는지 확인
git status
# → dist/는 보이지 않아야 함
```

### 3. 환경 변수 관리

**로컬 개발:**
```bash
# .env.local 생성 (Git에 포함 안 됨)
echo 'I18NEXUS_TOOLS_SENTRY_DSN="your-dsn"' > .env.local
```

**CI/CD:**
```yaml
# GitHub Actions Secrets 사용
- name: Build with Sentry
  env:
    I18NEXUS_TOOLS_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
  run: npm run build
```

---

## 🚨 실수 방지 체크리스트

### 절대 하지 말아야 할 것

- [ ] ❌ DSN을 코드에 하드코딩
- [ ] ❌ DSN을 Git에 커밋
- [ ] ❌ DSN을 README에 작성
- [ ] ❌ 스크린샷에 DSN 노출
- [ ] ❌ 블로그/문서에 실제 DSN 공개

### 반드시 해야 할 것

- [x] ✅ 환경 변수로 관리
- [x] ✅ .gitignore에 dist/ 추가
- [x] ✅ .gitignore에 .env* 추가
- [x] ✅ 빌드 시에만 주입
- [x] ✅ GitHub Secrets 사용 (CI/CD)

---

## 🔍 DSN 노출 여부 확인

### Git 히스토리 확인

```bash
# DSN이 과거 커밋에 없는지 확인
git log -p | grep -i "sentry"
git log -p | grep -i "50a55d33b83fee01061aee34e4c96a3e"
```

### GitHub 검색

```bash
# GitHub에서 저장소 검색
# https://github.com/your-org/i18nexus-tools/search?q=sentry

# 결과에 실제 DSN이 나오면 안 됨!
```

### npm 패키지 확인

```bash
# 배포된 패키지 다운로드
npm pack i18nexus-tools

# 압축 해제
tar -xzf i18nexus-tools-*.tgz

# DSN 검색
grep -r "50a55d33b83fee01061aee34e4c96a3e" package/
# → dist/ 파일에만 있어야 함 (소스 코드에는 없음)
```

---

## 🛡️ Sentry 보안 설정

### 1. Rate Limiting

**Sentry 대시보드 → Settings → Security & Privacy**

```yaml
Rate Limits:
  # IP당 제한
  - Per IP: 100 events/minute
  
  # 프로젝트당 제한  
  - Per Project: 1000 events/hour
  
  # DSN당 제한
  - Per DSN: 10000 events/day
```

### 2. Inbound Filters

**Sentry 대시보드 → Settings → Inbound Filters**

```yaml
Filter events from:
  - Known web crawlers
  - Localhost
  - Legacy browsers (IE < 11)
  
Filter errors:
  - Browser extensions
  - Known SDK errors
```

### 3. IP Whitelist (선택적)

```yaml
# CI/CD 서버 IP만 허용 (엄격한 경우)
Allowed IPs:
  - 123.45.67.89  (GitHub Actions)
  - 98.76.54.32   (Your CI server)
```

### 4. Spike Protection

```yaml
Spike Protection:
  ✅ Enable automatic spike protection
  
  Thresholds:
    - Normal: 100 events/minute
    - Spike detected: >500 events/minute
    - Action: Throttle for 10 minutes
```

---

## 🚨 DSN이 노출되었다면

### 즉시 조치

**1. DSN 교체**
```bash
# Sentry 대시보드
Settings → Client Keys (DSN) → Regenerate DSN
```

**2. 이전 DSN 비활성화**
```bash
# Sentry 대시보드
Settings → Client Keys (DSN) → Revoke Old DSN
```

**3. 새 DSN으로 재배포**
```bash
I18NEXUS_TOOLS_SENTRY_DSN="new-dsn" npm run build
npm version patch
npm publish
```

### Git 히스토리 정리 (필요시)

```bash
# ⚠️ 주의: 이미 push된 경우 복잡함

# BFG Repo-Cleaner 사용
brew install bfg
bfg --replace-text passwords.txt

# 또는 git filter-branch
git filter-branch --tree-filter \
  'find . -name "*.ts" -exec sed -i "s/old-dsn/REDACTED/g" {} \;' HEAD

# Force push (위험!)
git push --force
```

---

## 💰 Rate Limiting으로 비용 보호

### 무료 Tier 보호

```typescript
// scripts/performance-monitor.ts
const DEFAULT_SENTRY_DSN = process.env.I18NEXUS_TOOLS_SENTRY_DSN || "";

// ✅ 샘플링으로 quota 보호
Sentry.init({
  dsn,
  tracesSampleRate: 0.1,      // 10%만 수집
  profilesSampleRate: 0.1,     // 10%만 프로파일링
  
  // ✅ 환경별 제한
  beforeSend(event, hint) {
    // 개발 환경에서는 전송 안 함
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
  
  // ✅ 에러 필터링
  ignoreErrors: [
    // 브라우저 확장 프로그램 에러 무시
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
  ],
});
```

### 비용 모니터링

**Sentry 대시보드 → Stats**

```
Daily Usage:
  Events: 234 / 10,000  (2.3%)
  Performance: 567 / 10,000  (5.6%)
  
Monthly Projection:
  Events: 7,020  ✅ (Within limit)
  Performance: 17,010  ⚠️  (Over limit!)
  
Action: Reduce sampling to 5%
```

---

## 🔐 베스트 프랙티스

### 1. 환경 분리

```bash
# 개발 환경 (로컬 Sentry)
I18NEXUS_TOOLS_SENTRY_DSN="dev-dsn"

# 프로덕션 환경 (실제 Sentry)
I18NEXUS_TOOLS_SENTRY_DSN="prod-dsn"
```

### 2. 최소 권한 원칙

```yaml
# Sentry Team 권한
Developers:
  - Read events
  - Write events
  
Admins:
  - Manage keys
  - Change settings
```

### 3. 정기 감사

```bash
# 매월 체크리스트
- [ ] 이상한 트래픽 없는지 확인
- [ ] Quota 사용량 확인
- [ ] Rate limiting 로그 확인
- [ ] DSN 노출 여부 재확인
```

---

## 📊 모니터링 알람

### Sentry Alerts 설정

```yaml
Alert 1: Unusual Traffic
  Condition: Events > 1000/hour
  Action: Email + Slack notification
  
Alert 2: Quota Warning
  Condition: Usage > 80% of limit
  Action: Email to admin
  
Alert 3: Suspicious IPs
  Condition: >100 events from single IP
  Action: Auto-block + notification
```

---

## ✅ 보안 체크리스트 (배포 전)

### 코드 검토

```bash
# 1. DSN 하드코딩 없는지 확인
grep -r "ingest.sentry.io" scripts/
# → 결과 없어야 함

# 2. 환경 변수만 사용하는지 확인
grep -r "process.env.I18NEXUS_TOOLS_SENTRY_DSN" scripts/
# → performance-monitor.ts에만 있어야 함

# 3. .gitignore 확인
cat .gitignore | grep -E "dist|.env"
# → 둘 다 있어야 함
```

### Git 상태 확인

```bash
# 4. dist/ 폴더가 추적되지 않는지 확인
git status
# → dist/가 보이면 안 됨

# 5. 민감한 파일 없는지 확인
git diff --cached
# → DSN이 보이면 안 됨
```

### 빌드 & 배포

```bash
# 6. DSN 주입 빌드
I18NEXUS_TOOLS_SENTRY_DSN="your-dsn" npm run build

# 7. 빌드 결과 확인
grep "ingest.sentry.io" dist/scripts/performance-monitor.js
# → dist/ 파일에만 있어야 함 (정상)

# 8. npm 배포
npm publish
```

---

## 🎉 현재 보안 상태

### ✅ 안전함

- ✅ 소스 코드에 DSN 없음
- ✅ 환경 변수로 관리
- ✅ .gitignore 설정 완료
- ✅ 빌드 시에만 주입
- ✅ dist/ 폴더 Git 제외

### 작동 방식

```
1. 개발자 (로컬)
   scripts/performance-monitor.ts → process.env.I18NEXUS_TOOLS_SENTRY_DSN
   ↓
2. 빌드 (CI/CD)
   inject-sentry-dsn.js → 실제 DSN 주입
   ↓
3. npm 패키지
   dist/performance-monitor.js → DSN 포함 (괜찮음)
   ↓
4. 사용자
   npm install → 빌드된 코드 받음 → 자동으로 Sentry 전송
```

---

## 📚 참고 자료

- 📖 [Sentry Security Best Practices](https://docs.sentry.io/security-legal-pii/)
- 📖 [Rate Limiting Guide](https://docs.sentry.io/product/accounts/quotas/)
- 📖 [DSN Management](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)

---

## 🔒 요약

**Q: DSN을 노출하면 안 되나요?**

**A: 기술적으로는 괜찮지만, 베스트 프랙티스는:**
- ✅ 소스 코드에는 환경 변수만
- ✅ 빌드 시에만 주입
- ✅ Rate limiting으로 보호
- ✅ 정기적인 모니터링

**현재 구조는 안전합니다! ✅**

궁금한 점 있으시면 말씀해주세요! 🙌

