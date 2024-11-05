# 외부 상수 분석 기능 제거

## 요약

외부 파일에서 import된 상수를 자동으로 분석하던 기능을 제거했습니다.  
이제 **로컬 파일 내에서 선언된 상수만 분석**합니다.

## 삭제 이유 (핵심 3가지)

### 1. 의도와 다르게 작동 가능성 ⚠️
- 외부 파일의 모든 export를 상수로 가정
- 실제로는 API 응답, 동적 데이터일 수 있음
- 잘못된 추론으로 불필요한 래핑 발생

### 2. 너무 광범위한 분석 범위 🌐
- Import된 모든 파일을 재귀적으로 분석
- 프로젝트 전체 의존성 그래프 탐색
- 성능 저하 및 메모리 사용량 증가

### 3. Framework 강제 이슈 🔒
- 특정 파일 구조나 네이밍 컨벤션 가정
- 다양한 프로젝트 구조에 대응 어려움
- 설정이 복잡하고 유연성 부족

## 삭제된 기능

### 1. Import 문 파싱 및 추적
- `parseImports()`: Import 문에서 상대 경로 import를 파싱
- `importedConstants`: Import된 변수명 → 파일 경로 매핑
- `resolveImportPath()`: Import 경로를 절대 경로로 변환

### 2. 외부 파일 분석
- `analyzeExternalFile()`: 외부 파일에서 export된 상수 분석
- `analyzeImportedFiles()`: Import된 모든 외부 파일 순회 분석
- `analyzedExternalFiles`: 중복 분석 방지를 위한 캐시

### 동작 방식 (삭제 전)
```
1. 파일 파싱 → Import 문 추출
2. 상대 경로 import만 필터링
3. Import된 파일들을 순회하며 상수 분석
4. 외부 상수의 렌더링 가능한 속성 추출
5. 해당 상수 사용 시 자동으로 t() 래핑
```

## 제거 이유

### 1. 의도와 다르게 작동 가능성 ⚠️

**문제점:**
- 외부 파일의 모든 export를 상수로 가정
- 실제로는 API 응답, 동적 데이터일 수 있음
- 잘못된 추론으로 불필요한 래핑 발생

**예시:**
```typescript
// constants.ts (외부 파일)
export const NAV_ITEMS = [...];  // ✅ 상수 (래핑 필요)
export const API_RESPONSE = await fetch(...);  // ❌ 동적 데이터 (래핑 불필요)
```

### 2. 너무 광범위한 분석 범위 🌐

**문제점:**
- Import된 모든 파일을 재귀적으로 분석
- 프로젝트 전체 의존성 그래프 탐색
- 성능 저하 및 메모리 사용량 증가

**영향:**
- 대규모 프로젝트에서 분석 시간 급증
- 불필요한 파일 읽기/파싱 오버헤드
- 캐시 관리 복잡도 증가

### 3. Framework 강제 이슈 🔒

**문제점:**
- 특정 파일 구조나 네이밍 컨벤션 가정
- 다양한 프로젝트 구조에 대응 어려움
- 설정이 복잡하고 유연성 부족

**예시:**
```typescript
// 프로젝트 A: constants/index.ts
export const NAV_ITEMS = [...];

// 프로젝트 B: config/menu.ts
export const menuItems = [...];

// 프로젝트 C: data/navigation.tsx
export default [...];
```

각기 다른 구조에 대해 일관된 분석이 어려움.

### 4. 유지보수 복잡도 📈

**문제점:**
- Import 경로 해석 로직 복잡
- 확장자 자동 감지 (`.ts`, `.tsx`, `.js`, `.jsx`)
- `index` 파일 처리
- 순환 참조 방지
- 에러 처리 및 복구

## 현재 동작 방식

### 로컬 파일만 분석
- 현재 파일 내에서 선언된 상수만 분석
- `const NAV_ITEMS = [...]` 같은 로컬 선언만 처리
- 외부 import는 분석하지 않음

### 장점
- ✅ 단순하고 예측 가능한 동작
- ✅ 성능 향상 (불필요한 파일 분석 제거)
- ✅ 다양한 프로젝트 구조에 유연하게 대응
- ✅ 유지보수 용이

### 제한사항
- ❌ 외부 파일에서 import된 상수는 자동 분석 안 됨
- ❌ 사용자가 수동으로 처리해야 함

## 대안

### 1. 수동 처리 (권장)
```typescript
// constants.ts
export const NAV_ITEMS = [
  { label: "홈", path: "/" },
  { label: "소개", path: "/about" }
];

// 사용하는 파일에서
import { NAV_ITEMS } from "./constants";

// NAV_ITEMS를 사용하기 전에 로컬로 복사
const localNavItems = NAV_ITEMS;  // 이제 분석됨
```

### 2. 설정 기반 제외
```json
// i18nexus.config.json
{
  "constantPatterns": ["_ITEMS", "_MENU"],
  "excludePatterns": ["**/api/**", "**/services/**"]
}
```

### 3. 주석 기반 제어
```typescript
// i18n-analyze
import { NAV_ITEMS } from "./constants";

// i18n-ignore
import { API_DATA } from "./api";
```

## 결론

외부 상수 분석 기능은:
- **의도치 않은 동작**을 유발할 수 있음
- **너무 광범위한 분석**으로 성능 저하
- **프로젝트 구조에 강제적**으로 의존
- **유지보수 복잡도** 증가

따라서 **로컬 파일 분석만 수행**하는 단순한 방식으로 변경하여:
- 예측 가능한 동작
- 향상된 성능
- 다양한 프로젝트 구조 지원
- 쉬운 유지보수

를 달성했습니다.

