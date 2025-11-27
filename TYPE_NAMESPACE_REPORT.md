# 타입 지원 및 네임스페이스 작동 검증 리포트

## 📊 요약

### ✅ 타입 지원: **완벽하게 작동**

### ⚠️ 네임스페이스: **타입 안전성은 작동하지만, 런타임 격리는 미작동**

---

## 1️⃣ 타입 지원 분석

### ✅ 완전한 타입 추론

#### 1. **네임스페이스 타입 추론**

```typescript
const i18n = createI18n(translations);

// ✅ 네임스페이스 자동 추론
const { t } = i18n.useTranslation("common"); // 타입 안전!
//                                 ^^^^^^^
//                                 "common" | "menu" | "errors"

// ❌ 잘못된 네임스페이스 → TypeScript 에러
const { t } = i18n.useTranslation("invalid"); // Type error!
```

#### 2. **번역 키 타입 추론**

```typescript
// ✅ 각 네임스페이스별 키 타입 자동 추론
const { t: tCommon } = i18n.useTranslation("common");
tCommon("welcome"); // ✅ "welcome" | "goodbye" | "greeting"
tCommon("invalid"); // ❌ Type error!

const { t: tMenu } = i18n.useTranslation("menu");
tMenu("home"); // ✅ "home" | "about" | "settings"
tMenu("welcome"); // ❌ Type error! (welcome은 common에만 있음)
```

#### 3. **IDE 자동완성**

- ✅ 네임스페이스 선택 시 자동완성
- ✅ 번역 키 입력 시 자동완성
- ✅ 변수 인터폴레이션 타입 체크
- ✅ 컴파일 타임 에러 감지

### 📊 타입 시스템 계층

```typescript
// 레이어 1: 네임스페이스 추론
type ExtractNamespaces<T> = keyof T & string;
// Result: "common" | "menu" | "errors"

// 레이어 2: 키 추론
type ExtractNamespaceKeys<T, NS> = ExtractI18nKeys<T[NS]>;
// Result for "common": "welcome" | "goodbye" | "greeting"

// 레이어 3: 번역 함수 타입
type TranslationFunction<Keys> = (
  key: Keys,
  variables?: Record<string, any>,
) => string | ReactElement;
```

---

## 2️⃣ 네임스페이스 작동 분석

### ⚠️ 현재 동작: **평탄화(Flattening) 방식**

#### 문제 발견

테스트 결과, 네임스페이스가 **격리되지 않고 평탄화**됩니다:

```typescript
// packages/core/src/utils/createI18n.ts (96-104줄)
function TypedI18nProvider(props) {
  // ⚠️ 모든 네임스페이스를 하나의 객체로 병합!
  const flattenedTranslations = Object.keys(
    props.translations || translations,
  ).reduce(
    (acc, namespace) => {
      const nsTranslations = (props.translations || translations)[namespace];
      Object.keys(nsTranslations).forEach((lang) => {
        acc[lang] = { ...acc[lang], ...nsTranslations[lang] };
      });
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  );
  // ...
}
```

#### 실제 동작 예시

**정의:**

```typescript
const translations = {
  common: { en: { welcome: "Welcome" } },
  menu: { en: { home: "Home" } },
};
```

**평탄화 결과:**

```typescript
{
  en: {
    welcome: "Welcome",  // common에서
    home: "Home"         // menu에서
  }
}
```

**결과:**

```typescript
const { t: tCommon } = i18n.useTranslation("common");
const { t: tMenu } = i18n.useTranslation("menu");

// ✅ 타입 체크는 통과하지만...
tCommon("welcome"); // ✅ OK (타입 안전)
tMenu("home"); // ✅ OK (타입 안전)

// ⚠️ 런타임에서는 둘 다 접근 가능!
tCommon("home"); // ❌ 타입 에러지만 런타임에서는 "Home" 반환!
tMenu("welcome"); // ❌ 타입 에러지만 런타임에서는 "Welcome" 반환!
```

### 📊 테스트 증거

```typescript
// packages/core/src/__tests__/namespace-translation.test.tsx (340-363줄)
it("should return translation when namespace not found but key exists", () => {
  const { t } = i18n.useTranslation("nonexistent" as any);

  // ⚠️ 존재하지 않는 네임스페이스지만,
  // 평탄화된 풀에서 'welcome' 키를 찾아서 반환!
  expect(screen.getByTestId("translation")).toHaveTextContent("Welcome");
});
```

---

## 3️⃣ 타입 vs 런타임 비교

### ✅ 타입 레벨 (컴파일 타임)

| 기능                     | 상태    | 설명                             |
| ------------------------ | ------- | -------------------------------- |
| 네임스페이스 타입 추론   | ✅ 작동 | `"common" \| "menu" \| "errors"` |
| 키 타입 추론             | ✅ 작동 | 각 네임스페이스별 키 타입 분리   |
| 잘못된 네임스페이스 감지 | ✅ 작동 | 컴파일 에러 발생                 |
| 잘못된 키 감지           | ✅ 작동 | 컴파일 에러 발생                 |
| IDE 자동완성             | ✅ 작동 | 완벽한 IntelliSense              |

### ⚠️ 런타임 레벨

| 기능                   | 상태      | 설명                             |
| ---------------------- | --------- | -------------------------------- |
| 네임스페이스 격리      | ❌ 미작동 | 모든 키가 전역 풀에 병합         |
| 키 충돌 방지           | ❌ 미작동 | 나중 네임스페이스가 덮어씀       |
| 네임스페이스 경계      | ❌ 미작동 | 다른 네임스페이스 키도 접근 가능 |
| 동적 네임스페이스 로딩 | ❌ 미지원 | 모든 네임스페이스가 즉시 로드    |

---

## 4️⃣ 키 충돌 시나리오

### 🚨 문제 상황

```typescript
const translations = {
  common: {
    en: { title: "Welcome Page" },
  },
  admin: {
    en: { title: "Admin Dashboard" }, // ⚠️ 키 충돌!
  },
};

const i18n = createI18n(translations);

// 평탄화 결과:
// { en: { title: "Admin Dashboard" } }  ← admin이 common을 덮어씀!

const { t: tCommon } = i18n.useTranslation("common");
console.log(tCommon("title")); // "Admin Dashboard" (예상: "Welcome Page")
```

### 해결 방법 (현재 없음)

- ⚠️ 개발자가 수동으로 키 충돌 방지 필요
- ⚠️ 네임스페이스는 타입 안전성만 제공, 격리는 제공하지 않음

---

## 5️⃣ 장단점 분석

### ✅ 장점

#### 1. **타입 안전성**

```typescript
// ✅ 완벽한 타입 추론과 자동완성
const { t } = i18n.useTranslation("common");
t("welcome"); // IDE 자동완성, 타입 체크
```

#### 2. **단순한 구조**

- 내부적으로 flat한 구조 → 빠른 조회
- 복잡한 네임스페이스 관리 로직 불필요

#### 3. **하위 호환성**

- 기존 `I18nProvider` API와 호환
- 네임스페이스 없이도 사용 가능

### ⚠️ 단점

#### 1. **키 충돌 위험**

```typescript
// ⚠️ 같은 키 이름 사용 시 덮어씌워짐
common: {
  title: "...";
}
admin: {
  title: "...";
} // 이게 최종값
```

#### 2. **네임스페이스 격리 없음**

```typescript
// ⚠️ 다른 네임스페이스 키도 접근 가능
const { t: tCommon } = useTranslation("common");
tCommon("adminOnlyKey"); // 타입 에러지만 런타임 작동!
```

#### 3. **메모리 효율성**

- 모든 네임스페이스가 항상 메모리에 로드
- 큰 프로젝트에서는 비효율적일 수 있음

#### 4. **코드 분할 불가**

- 네임스페이스별 lazy loading 불가능
- 번들 크기 최적화 어려움

---

## 6️⃣ 실제 사용 예시

### ✅ 권장 사용 패턴

#### 1. **고유한 키 이름 사용**

```typescript
const translations = {
  common: {
    en: {
      common_welcome: "Welcome", // ✅ 접두사 사용
      common_goodbye: "Goodbye",
    },
  },
  menu: {
    en: {
      menu_home: "Home", // ✅ 접두사 사용
      menu_about: "About",
    },
  },
};
```

#### 2. **명확한 네임스페이스 구분**

```typescript
// ✅ 용도별로 명확히 구분
const translations = {
  ui: {
    /* UI 텍스트 */
  },
  errors: {
    /* 에러 메시지 */
  },
  validation: {
    /* 폼 검증 */
  },
  navigation: {
    /* 네비게이션 */
  },
};
```

### ⚠️ 피해야 할 패턴

#### 1. **중복 키 이름**

```typescript
// ❌ 피하기: 키 충돌
const translations = {
  page1: { en: { title: "Page 1" } },
  page2: { en: { title: "Page 2" } }, // ← 덮어씌워짐!
};
```

#### 2. **네임스페이스 격리 의존**

```typescript
// ❌ 피하기: 격리 가정
const { t: tAdmin } = useTranslation("admin");
// 다른 네임스페이스 키도 접근 가능하므로 위험!
```

---

## 7️⃣ 개선 권장사항

### 🔧 단기 개선

#### 1. **문서화 강화**

```markdown
# ⚠️ 중요: 네임스페이스 동작 방식

네임스페이스는 **타입 안전성만** 제공합니다.
런타임에서는 모든 키가 하나의 풀에 병합됩니다.

**권장사항:**

- 네임스페이스별로 고유한 키 이름 사용
- 키 충돌 방지를 위해 접두사 사용 고려
```

#### 2. **키 충돌 경고**

```typescript
// 개발 모드에서 키 충돌 감지 및 경고
if (process.env.NODE_ENV === "development") {
  const allKeys = new Set();
  Object.entries(flattenedTranslations).forEach(([lang, keys]) => {
    Object.keys(keys).forEach((key) => {
      if (allKeys.has(key)) {
        console.warn(
          `⚠️ Key collision: "${key}" exists in multiple namespaces`,
        );
      }
      allKeys.add(key);
    });
  });
}
```

### 🚀 장기 개선

#### 1. **진짜 네임스페이스 격리 옵션**

```typescript
const i18n = createI18n(translations, {
  isolateNamespaces: true, // 옵션 추가
});

// 격리 모드에서는:
const { t } = i18n.useTranslation("common");
t("adminKey"); // ❌ 런타임 에러 발생!
```

#### 2. **네임스페이스 프리픽싱 자동화**

```typescript
const i18n = createI18n(translations, {
  autoPrefix: true, // 자동으로 "namespace.key" 형식으로 변환
});

// 내부적으로:
// "welcome" → "common.welcome"
// "home" → "menu.home"
```

#### 3. **Lazy Loading 지원**

```typescript
const i18n = createI18n({
  common: () => import("./locales/common"), // 지연 로딩
  admin: () => import("./locales/admin"),
});
```

---

## 8️⃣ 최종 결론

### ✅ **타입 지원: 완벽함 (10/10)**

**작동 내역:**

- ✅ 네임스페이스 타입 추론
- ✅ 키 타입 추론
- ✅ 컴파일 타임 에러 감지
- ✅ IDE 자동완성
- ✅ 변수 인터폴레이션 타입 체크

### ⚠️ **네임스페이스: 부분적 작동 (6/10)**

**작동 내역:**

- ✅ 타입 레벨 네임스페이스 구분
- ✅ IDE 자동완성에서 네임스페이스별 키 분리
- ❌ 런타임 네임스페이스 격리 없음
- ❌ 키 충돌 방지 없음
- ❌ 동적 로딩 미지원

### 📊 종합 평가

| 항목              | 점수               | 평가                                   |
| ----------------- | ------------------ | -------------------------------------- |
| 타입 안전성       | ⭐⭐⭐⭐⭐         | 완벽함                                 |
| 개발자 경험       | ⭐⭐⭐⭐⭐         | IDE 지원 우수                          |
| 네임스페이스 격리 | ⭐⭐               | 타입만, 런타임 없음                    |
| 키 충돌 방지      | ⭐                 | 수동 관리 필요                         |
| 코드 분할         | ⭐                 | 미지원                                 |
| **총점**          | **⭐⭐⭐⭐ (4/5)** | **프로덕션 사용 가능, 개선 여지 있음** |

---

## 9️⃣ 사용 가이드

### ✅ 현재 버전 사용법

```typescript
// 1. 고유한 키 이름으로 네임스페이스 정의
const translations = {
  common: {
    en: {
      common_welcome: "Welcome",
      common_logout: "Logout"
    }
  },
  admin: {
    en: {
      admin_dashboard: "Dashboard",
      admin_users: "Users"
    }
  }
} as const;

// 2. 타입 안전한 i18n 생성
const i18n = createI18n(translations);

// 3. 컴포넌트에서 사용
function MyComponent() {
  const { t } = i18n.useTranslation("common");

  // ✅ 타입 안전한 번역
  return <h1>{t("common_welcome")}</h1>;
}

// 4. Provider로 감싸기
<i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
  <MyComponent />
</i18n.I18nProvider>
```

### 📚 추가 리소스

- **타입 안전성 테스트**: `packages/core/src/__tests__/createI18n.test.tsx`
- **네임스페이스 테스트**: `packages/core/src/__tests__/namespace-translation.test.tsx`
- **구현 코드**: `packages/core/src/utils/createI18n.ts`

---

## 🎯 권장사항

1. **현재 사용**:
   - ✅ 타입 안전성은 훌륭하니 적극 활용
   - ⚠️ 네임스페이스는 타입 구조화 도구로만 사용
   - ⚠️ 키 충돌 방지를 위해 접두사 사용

2. **향후 개선**:
   - 🔧 진짜 네임스페이스 격리 옵션 추가
   - 🔧 개발 모드 키 충돌 경고
   - 🔧 Lazy loading 지원

3. **문서화**:
   - 📝 현재 동작 방식 명확히 문서화
   - 📝 권장 패턴 가이드 작성
   - 📝 마이그레이션 가이드 제공
