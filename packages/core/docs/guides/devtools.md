# I18NexusDevtools

React Query 스타일의 개발자 도구로, 개발 모드에서만 렌더링됩니다.

## 기능

- ✅ **현재 언어 표시**: 활성화된 언어 확인
- ✅ **브라우저 언어 감지**: 사용자의 브라우저 언어 표시 및 빠른 전환
- ✅ **언어 전환**: 사용 가능한 모든 언어로 빠르게 전환
- ✅ **번역 통계**: 로드된 키 수와 언어 수 확인
- ✅ **기본 언어로 리셋**: 원클릭으로 기본 언어로 되돌리기
- ✅ **개발 모드 전용**: production 빌드에서 자동으로 제거됨
- ✅ **ESC 키 지원**: ESC 키로 패널 닫기

## 사용법

### 기본 사용

```tsx
import { I18nProvider, I18NexusDevtools } from "i18nexus";

function App() {
  return (
    <I18nProvider
      languageManagerOptions={{
        supportedLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
          { code: "ja", name: "日本語" },
        ],
        defaultLanguage: "en",
      }}
      translations={{
        en: { greeting: "Hello" },
        ko: { greeting: "안녕하세요" },
        ja: { greeting: "こんにちは" },
      }}>
      <YourApp />

      {/* 개발자 도구 추가 */}
      <I18NexusDevtools />
    </I18nProvider>
  );
}
```

### 고급 사용

```tsx
<I18NexusDevtools
  // 처음에 패널을 열린 상태로 시작
  initialIsOpen={true}
  // 위치 설정
  position="bottom-right" // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  // 커스텀 스타일
  panelStyles={{
    width: "500px",
    maxHeight: "800px",
  }}
  buttonStyles={{
    backgroundColor: "#10b981",
  }}
/>
```

## Props

| Prop            | Type                                                           | Default         | Description                             |
| --------------- | -------------------------------------------------------------- | --------------- | --------------------------------------- |
| `initialIsOpen` | `boolean`                                                      | `false`         | 패널을 처음에 열린 상태로 표시할지 여부 |
| `position`      | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-left'` | 패널의 화면 위치                        |
| `panelStyles`   | `React.CSSProperties`                                          | `{}`            | 패널의 커스텀 스타일                    |
| `buttonStyles`  | `React.CSSProperties`                                          | `{}`            | 토글 버튼의 커스텀 스타일               |

## 스크린샷 미리보기

개발자 도구는 다음을 표시합니다:

1. **현재 언어**: 활성화된 언어와 로딩 상태
2. **브라우저 언어**: 감지된 브라우저 언어 및 빠른 전환 버튼
3. **사용 가능한 언어**: 모든 지원 언어 목록과 전환 버튼
4. **번역 통계**: 로드된 키 수와 언어 수
5. **액션**: 기본 언어로 리셋

## 주의사항

- 이 컴포넌트는 `process.env.NODE_ENV === 'production'`일 때 자동으로 `null`을 반환합니다.
- 프로덕션 빌드에서는 자동으로 제거되므로 번들 크기에 영향을 주지 않습니다.
- ESC 키를 눌러 패널을 닫을 수 있습니다.

## 스타일링

완전히 커스터마이징 가능한 인라인 스타일을 사용합니다. `panelStyles`와 `buttonStyles` props를 통해 원하는 대로 스타일을 변경할 수 있습니다.

```tsx
<I18NexusDevtools
  panelStyles={{
    width: "600px",
    backgroundColor: "#1f2937",
    color: "white",
  }}
  buttonStyles={{
    backgroundColor: "#059669",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
  }}
/>
```
