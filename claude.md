# 🎯 Clean F.S.D (Feature-Sliced Design) 개요

Clean FSD는 기존 FSD의 모호한 경계를 명확히 하고, 풀스택 개발 환경(특히 Next.js와 React 팀의 서버 퍼스트 전략)에 최적화된 아키텍처 설계를 제공합니다.

## 1. FSD의 기본 원칙 및 목적

FSD는 **기능 중심으로** 폴더 구조를 설계하는 방법론입니다.

💡 **설계의 목적:** 궁극적으로 **변화에 유연하게 대응**하기 위함입니다. 하나의 기능이 변해도 다른 기능들이 영향을 받지 않도록 설계하는 것을 의미합니다.

**🔑 핵심 기준:** FSD는 높은 **응집도 (High Cohesion)**와 낮은 **결합도 (Low Coupling)**를 유지하여 유연한 설계를 목표로 합니다.

### FSD의 구조적 구성 요소

| 구조 | 명칭 (FSD 용어) | 개념 | 역할/기능 |
| :--- | :--- | :--- | :--- |
| **최상위** | **레이어 (Layer)** | 논리적인 계층 구조 | 높은 응집도와 낮은 결합도를 위한 가장 큰 단위. (예: App, Pages, Features, Entities). |
| **도메인** | **슬라이스 (Slice)** | 도메인 기준으로 분리 | 참조 얽힘 방지 및 도메인 단위 관리 (예: User, Post). 같은 레이어 하위의 슬라이스끼리는 서로 참조가 불가능합니다. |
| **역할** | **세그먼트 (Segment)** | 역할 기준으로 분리 | 재사용률 향상 및 분리 기준 제공 (예: API, Model, UI, Action, Lib). |
| **기능** | **파일 (File)** | 가장 작은 기능 단위 | 파일을 생성하는 기준이 기능 단위입니다 (예: `createUser.js`, `signUpAction.js`). |

## 2. 기존 FSD의 한계점

기존 FSD를 실무에 적용할 때 흔히 발견되는 두 가지 주요 한계가 있었습니다:

1. 🤔 **레이어 경계의 모호성:** `Features` 레이어와 `Entities` 레이어의 구분이 모호합니다.
2. 📦 **코드 집중 현상:** `Features`에 너무 많은 코드(콜 코드)가 집중되는 경향이 있었습니다.

## 3. Clean FSD의 핵심 원칙: 경계와 의도의 명확화 ✨

Clean FSD는 기존 FSD의 한계를 극복하기 위해 **의도**와 **경계**를 명확하게 합니다. 이를 위해 **쓰기**와 **읽기**를 분리하는 기준(CQRS 패턴에서 차용)을 Features와 Entities 레이어에 도입했습니다.

### A. 쓰기(Write)와 읽기(Read)의 분리 기준

| 레이어 | 기준 | 책임 / 역할 | 데이터 인터페이스 특징 |
| :--- | :--- | :--- | :--- |
| **Features** | **쓰기 (Write)** | CUD (Create, Update, Delete) / Mutation. | 테이블을 분리하는 것이 쓰기에 더 수월함 (확장/업데이트 용이). |
| **Entities** | **읽기 (Read)** | R (Read) / Query. | 하나의 테이블에 데이터가 계층적으로 포함되는 것이 읽기에 더 수월함 (네트워크 라운드 트립 감소). |

### B. 세그먼트별 코드 위치 명확화

Clean FSD 원칙을 적용하면 각 세그먼트에 어떤 코드가 들어가야 할지 명확해집니다:

*   **Features (쓰기 담당)**
    *   **API:** `Post`, `Put`, `Delete`와 같은 변경 요청 코드가 위치합니다.
    *   **UI:** 폼 (`Form`), 버튼 (`Button`), 인풋 (`Input`) 등 **유저 인터랙션이 있는** 컴포넌트가 위치합니다.
*   **Entities (읽기 담당)**
    *   **API:** `Get` 관련 요청 코드(조회)가 위치합니다.
    *   **UI:** 단순 뷰 (`View`) 역할, 즉 **유저 인터랙션이 없는** 컴포넌트가 위치합니다. 리액트 서버 컴포넌트(RSC)를 활용한 뷰도 포함될 수 있습니다.

## 4. Clean FSD와 Full-Stack 개발 구현 (Next.js 기반)

Clean FSD 아키텍처는 Next.js와 함께 구현될 때 그 의미가 완전해집니다. Next.js는 Clean FSD의 **구현체** 역할을 수행하며, 리액트 팀의 **서버 퍼스트 (Server-First)** 개발 전략을 반영합니다.

### A. 서버 퍼스트 전략

이 전략은 클라이언트에서 JS가 실행되는 비율을 낮추고, 데이터베이스 조작 및 렌더링까지 서버가 담당하도록 하는 것입니다. 이 방향성은 **RSC (React Server Component)**의 등장과 폼 태그 및 **서버 액션 (Server Action)**의 활용으로 구체화되었습니다.

### B. Clean FSD 원칙의 구현 방식 (Next.js)

| FSD 원칙 | 구현 기술 (Next.js/React) |
| :--- | :--- |
| **읽기 (Entities)** | **RSC (React Server Component)**. |
| **쓰기 (Features)** | **폼 태그**와 **서버 액션 (Server Action)** 조합. |

### C. 온전한 기능 단위 개발의 가능성

풀스택 개발이 가능해지면서 **온전한 기능 단위 개발**이 실현됩니다. 여기서 기능은 UI에서 출발하여 비즈니스 로직을 거쳐 **데이터베이스 조작**까지의 일련의 프로세스를 모두 담당하는 것을 의미합니다.

*   기존에는 프론트 개발자의 역할이 API 호출 선언까지였으나, 이제 DB 조작까지 확장됩니다.

## 5. 기대 효과 및 결론

Clean FSD는 단지 폴더 구조 개선을 넘어, 효율적인 협업 및 AI와의 협업을 위한 발판을 마련합니다.

*   🤝 **효율적인 AI 협업:** 경계와 의도가 명확한 설계를 통해, 프롬프트 입력 시 경로 및 로직 함수 이름까지 지정하여 명확한 의도를 전달할 수 있습니다 (엔지니어를 위한 바이브 코딩).
*   📈 **생산성 향상:** 의도가 명확히 전달되므로 수정할 필요가 줄어들어 작업 생산성이 높아집니다.
*   ✅ **경계 명확화:** 폴더 구조가 명확하게 나뉘어 있어, 정해진 경계 안에서만 작업이 이루어지므로 내가 모르는 작업이 일어나지 않습니다.

Clean FSD는 FSD의 한계를 극복하고, **읽기/쓰기** 기준을 추가하여 **의도와 경계가 명확한** 설계를 제공하며, Next.js와 서버 액션을 구현체로 활용하여 리액트 팀의 **서버 퍼스트 전략**을 따를 수 있게 돕는 아키텍처입니다.

---

## 6. 현재 프로젝트 적용 사항 (i18nexus-demo)

### 현재 프로젝트 구조

```
i18nexus-demo/
├── app/                    # Next.js App Router
│   ├── components/        # 공유 컴포넌트 (Shared Layer)
│   ├── page.tsx          # 랜딩 페이지
│   └── ...
├── locales/              # 다국어 번역 파일
└── lib/                  # 유틸리티 및 헬퍼 함수
```

### 향후 Clean FSD 적용 방향

현재는 전통적인 Next.js 구조를 따르고 있으나, 향후 확장 시 Clean FSD 원칙을 적용할 수 있습니다:

```
app/
├── _entities/           # 읽기 담당 (Entities Layer)
│   ├── translation/     # 번역 도메인
│   │   ├── api/        # GET 요청
│   │   ├── model/      # 데이터 모델
│   │   └── ui/         # View 컴포넌트 (인터랙션 없음)
│   └── download/       # 다운로드 통계 도메인
│       ├── api/
│       └── ui/
├── _features/          # 쓰기 담당 (Features Layer)
│   ├── language-switch/  # 언어 전환 기능
│   │   ├── ui/          # Form, Button (인터랙션 있음)
│   │   └── action/      # Server Action
│   └── project-submit/   # 프로젝트 제출 기능
│       ├── ui/
│       └── action/
├── _shared/            # 공유 레이어
│   ├── ui/            # 공통 UI 컴포넌트
│   ├── lib/           # 유틸리티
│   └── api/           # API 클라이언트
└── (pages)/           # Next.js 페이지 라우팅
    ├── page.tsx
    ├── getting-started/
    └── docs/
```

### 핵심 원칙 적용 예시

#### ✅ 읽기 (Entities)
- **위치**: `app/_entities/download/`
- **역할**: NPM 다운로드 통계 조회
- **구현**:
  - `api/getDownloadStats.ts` - GET 요청
  - `ui/DownloadStatsView.tsx` - RSC로 구현된 View

#### ✅ 쓰기 (Features)
- **위치**: `app/_features/project-submit/`
- **역할**: 쇼케이스 프로젝트 제출
- **구현**:
  - `ui/ProjectSubmitForm.tsx` - 폼 컴포넌트
  - `action/submitProject.ts` - Server Action (POST)

이러한 구조는 향후 기능 확장 시 적용 가능하며, 현재는 데모 프로젝트의 특성상 전통적인 구조를 유지하고 있습니다.
