# i18nexus 기여 가이드

i18nexus에 기여해주셔서 감사합니다! 🎉

버그 리포트, 기능 요청, 문서 개선, 코드 기여 등 모든 형태의 기여를 환영합니다.

[English](./CONTRIBUTING.md) | **한국어**

---

## 📋 목차

- [행동 강령](#행동-강령)
- [시작하기](#시작하기)
- [개발 워크플로우](#개발-워크플로우)
- [코딩 가이드라인](#코딩-가이드라인)
- [커밋 컨벤션](#커밋-컨벤션)
- [Pull Request 프로세스](#pull-request-프로세스)
- [버그 리포트](#버그-리포트)
- [기능 요청](#기능-요청)
- [문서화](#문서화)

---

## 📜 행동 강령

이 프로젝트는 행동 강령을 준수합니다. 참여하시는 모든 분들은 이 강령을 지켜주시기 바랍니다. 모든 상호작용에서 존중과 배려를 부탁드립니다.

---

## 🚀 시작하기

### 사전 요구사항

시작하기 전에 다음 항목이 설치되어 있는지 확인하세요:

- **Node.js**: 16.x 이상
- **npm**: 8.x 이상
- **Git**: 최신 버전

### Fork 및 Clone

1. **GitHub에서 저장소를 Fork** 하세요
2. **Fork한 저장소를 Clone**:
   ```bash
   git clone https://github.com/your-username/i18nexus.git
   cd i18nexus
   ```

3. **Upstream 리모트 추가**:
   ```bash
   git remote add upstream https://github.com/manNomi/i18nexus.git
   ```

### 의존성 설치

```bash
npm install
```

### 프로젝트 빌드

```bash
npm run build
```

### 테스트 실행

```bash
npm test
```

### Watch 모드로 테스트 실행

```bash
npm run test:watch
```

---

## 🔄 개발 워크플로우

### 1. 브랜치 생성

항상 새로운 브랜치를 생성하여 작업하세요:

```bash
git checkout -b feature/your-feature-name
# 또는
git checkout -b fix/your-bug-fix
```

**브랜치 네이밍 컨벤션:**
- `feature/` - 새로운 기능
- `fix/` - 버그 수정
- `docs/` - 문서 변경
- `refactor/` - 코드 리팩토링
- `test/` - 테스트 개선
- `chore/` - 유지보수 작업

### 2. 변경사항 작성

- 깔끔하고 읽기 쉬운 코드를 작성하세요
- 기존 코드 스타일을 따르세요
- 새로운 기능에는 테스트를 추가하세요
- 필요에 따라 문서를 업데이트하세요

### 3. 변경사항 테스트

```bash
# 모든 테스트 실행
npm test

# 린터 실행
npm run lint

# 프로젝트 빌드
npm run build
```

### 4. 변경사항 커밋

[커밋 컨벤션](#커밋-컨벤션)을 따라주세요:

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
```

### 5. 브랜치 최신 상태 유지

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Fork로 Push

```bash
git push origin feature/your-feature-name
```

### 7. Pull Request 생성

GitHub로 가서 본인의 브랜치에서 `main`으로 Pull Request를 생성하세요.

---

## 📝 코딩 가이드라인

### TypeScript

- 모든 새로운 코드는 TypeScript로 작성하세요
- 적절한 타입 정의를 제공하세요
- `any` 타입 사용을 피하세요
- 객체 타입에는 `interface` 사용
- Union과 복잡한 타입에는 `type` 사용

**예시:**

```typescript
// 좋은 예 ✅
interface TranslationConfig {
  language: string;
  fallback?: string;
}

// 나쁜 예 ❌
const config: any = { language: "ko" };
```

### React 컴포넌트

- 함수형 컴포넌트와 Hooks 사용
- 의미있는 컴포넌트 이름 사용
- 재사용 가능한 로직은 커스텀 Hook으로 분리
- Props를 TypeScript로 적절히 타입 지정

**예시:**

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### 코드 스타일

코드 포맷팅에는 **Prettier**, 린팅에는 **ESLint**를 사용합니다.

```bash
# 코드 포맷
npm run format

# 린터 실행
npm run lint
```

### 파일 구조

```
src/
├── components/          # React 컴포넌트
│   ├── I18nProvider.tsx
│   └── I18NexusDevtools.tsx
├── hooks/              # 커스텀 React Hooks
│   └── useTranslation.ts
├── utils/              # 유틸리티 함수
│   ├── cookie.ts
│   ├── server.ts
│   └── types.ts
├── __tests__/          # 테스트 파일
│   ├── I18nProvider.test.tsx
│   └── cookie.test.ts
└── index.ts            # 메인 진입점
```

---

## 💬 커밋 컨벤션

**Conventional Commits** 규격을 따릅니다.

### 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (포맷팅, 세미콜론 누락 등)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가 또는 수정
- `chore`: 유지보수 작업 (빌드, 의존성 등)
- `perf`: 성능 개선
- `ci`: CI/CD 변경

### 예시

```bash
# 기능 추가
feat: 변수 삽입 기능 추가

# 버그 수정
fix: Safari에서 쿠키 파싱 이슈 해결

# 문서
docs: Accept-Language 가이드로 README 업데이트

# 리팩토링
refactor: 번역 로딩 로직 단순화

# 유지보수
chore: 의존성을 최신 버전으로 업데이트
```

### Scope (선택사항)

```bash
feat(server): Accept-Language 감지 추가
fix(devtools): 위치 지정 이슈 해결
docs(api): 서버 유틸리티 문서 추가
```

---

## 🔍 Pull Request 프로세스

### 제출 전 체크리스트

- [ ] 테스트 통과 (`npm test`)
- [ ] 린터 통과 (`npm run lint`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 문서 업데이트
- [ ] CHANGELOG.md 업데이트 (중요한 변경사항)
- [ ] 커밋 메시지가 컨벤션을 따름

### PR 제목

커밋 메시지와 동일한 형식 사용:

```
feat: 복수형 지원 추가
fix: SSR에서 hydration 불일치 해결
docs: TypeScript 설정 가이드 개선
```

### PR 설명 템플릿

```markdown
## 설명
변경사항에 대한 간단한 설명.

## 변경 타입
- [ ] 버그 수정 (기존 기능에 영향 없는 수정)
- [ ] 새로운 기능 (기존 기능에 영향 없는 추가)
- [ ] 주요 변경사항 (기존 기능에 영향을 주는 수정 또는 추가)
- [ ] 문서 업데이트

## 테스트 방법
실행한 테스트와 재현 방법을 설명해주세요.

## 체크리스트
- [ ] 프로젝트의 스타일 가이드를 따름
- [ ] 코드 자체 검토 완료
- [ ] 이해하기 어려운 부분에 주석 추가
- [ ] 문서에 해당 변경사항 반영
- [ ] 새로운 경고가 발생하지 않음
- [ ] 수정사항이 효과적이거나 기능이 작동함을 증명하는 테스트 추가
- [ ] 모든 테스트가 로컬에서 통과

## 스크린샷 (해당하는 경우)
변경사항을 설명하는 스크린샷 추가.
```

### 리뷰 프로세스

1. **자동 검사**: CI/CD가 테스트와 린팅을 실행
2. **코드 리뷰**: 관리자가 코드를 리뷰
3. **피드백**: 요청된 변경사항 반영
4. **승인**: 승인 후 PR이 머지됨

---

## 🐛 버그 리포트

### 리포트 전 확인사항

- [Issues](https://github.com/manNomi/i18nexus/issues)에서 이미 리포트된 버그인지 확인
- 최신 버전으로 버그 재현 시도
- `main` 브랜치에서 이미 수정되었는지 확인

### 버그 리포트 템플릿

```markdown
## 버그 설명
버그에 대한 명확하고 간결한 설명.

## 환경
- **i18nexus 버전**: 2.7.0
- **Node.js 버전**: 18.0.0
- **npm 버전**: 9.0.0
- **운영체제**: macOS 13.0
- **프레임워크**: Next.js 14.0.0

## 재현 단계
1. i18nexus 설치
2. 다음과 같이 컴포넌트 생성...
3. 애플리케이션 실행
4. 에러 발생

## 예상 동작
예상했던 동작.

## 실제 동작
실제로 발생한 동작.

## 코드 샘플
```typescript
// 최소한의 재현 코드
import { useTranslation } from "i18nexus";

export default function Component() {
  const { t } = useTranslation();
  return <div>{t("key")}</div>;
}
```

## 에러 메시지
```
전체 에러 출력 또는 콘솔 로그
```

## 추가 정보
도움이 될 만한 기타 정보.
```

---

## 💡 기능 요청

### 요청 전 확인사항

- 이미 요청된 기능인지 확인
- 프로젝트 범위에 맞는지 고려
- 하위 호환성에 대해 생각해보기

### 기능 요청 템플릿

```markdown
## 기능 설명
보고 싶은 기능에 대한 명확한 설명.

## 문제 정의
이 기능이 어떤 문제를 해결하나요?

## 제안하는 솔루션
이 기능이 어떻게 작동해야 하나요?

## 사용 예시
```typescript
// 이 기능을 어떻게 사용할 것으로 예상하시나요
const { t } = useTranslation();
t("key", { 
  plural: true, 
  count: 5 
});
```

## 고려한 대안
고려한 다른 솔루션이 있나요?

## 추가 정보
기타 정보나 스크린샷.
```

---

## 📚 문서화

### 문서 유형

1. **README.md** - 메인 프로젝트 문서
2. **API 문서** - `docs/api/`에 위치
3. **가이드** - `docs/guides/`에 위치
4. **릴리즈 노트** - `docs/releases/`에 위치
5. **코드 주석** - 코드 내 JSDoc 주석

### 문서 작성

- 명확하고 간결한 언어 사용
- 코드 예시 제공
- 간단한 예시와 고급 예시 모두 포함
- 코드 변경사항과 동기화 유지

### 문서 스타일

```markdown
# 제목 (H1)

간단한 소개.

## 섹션 (H2)

### 하위 섹션 (H3)

**예시:**

```typescript
// 주석이 포함된 코드 예시
const example = "value";
```

**출력:**
```
예상 출력
```
```

---

## 🧪 테스트

### 테스트 작성

- 모든 새로운 기능에 테스트 작성
- 설명적인 테스트 이름 사용
- 엣지 케이스 커버
- 테스트를 집중적이고 간단하게 유지

**예시:**

```typescript
describe("useTranslation", () => {
  it("번역 함수를 반환해야 함", () => {
    const { t } = useTranslation();
    expect(typeof t).toBe("function");
  });

  it("키를 올바르게 번역해야 함", () => {
    const { t } = useTranslation();
    expect(t("환영합니다")).toBe("환영합니다");
  });

  it("없는 키를 처리해야 함", () => {
    const { t } = useTranslation();
    expect(t("존재하지않는키")).toBe("존재하지않는키");
  });
});
```

### 테스트 커버리지

- 높은 테스트 커버리지 목표
- 중요한 경로에 집중
- 성공과 실패 케이스 모두 테스트

```bash
# 커버리지와 함께 테스트 실행
npm test -- --coverage
```

---

## 🏷️ 릴리즈 프로세스

`main` 브랜치로 푸시하면 GitHub Actions를 통해 자동으로 릴리즈됩니다.

### 버저닝

[Semantic Versioning](https://semver.org/)을 따릅니다:

- **Patch** (2.7.1): 버그 수정, 작은 개선
- **Minor** (2.8.0): 새로운 기능, 하위 호환
- **Major** (3.0.0): 주요 변경사항

### 릴리즈 생성

1. `package.json`의 버전 업데이트
2. `CHANGELOG.md` 업데이트
3. `docs/releases/`에 릴리즈 노트 생성
4. 변경사항 커밋
5. `main`으로 푸시
6. GitHub Actions가 자동으로 npm에 배포

---

## 🤝 커뮤니티

### 도움 받기

- 💬 **Discussions**: [GitHub Discussions](https://github.com/manNomi/i18nexus/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/manNomi/i18nexus/issues)
- 📧 **이메일**: hanmw110@naver.com

### 기여자

모든 기여자는 다음에서 인정받습니다:
- README.md 기여자 섹션
- 릴리즈 노트
- Package.json 기여자 필드

---

## 📄 라이센스

기여함으로써, 귀하의 기여가 **MIT 라이센스** 하에 라이센스됨에 동의하게 됩니다.

---

## 🙏 감사합니다!

i18nexus에 기여해주셔서 감사합니다! 작든 크든, 모든 기여가 큰 도움이 됩니다. 🌍✨

---

**즐거운 코딩 되세요!** 🚀

