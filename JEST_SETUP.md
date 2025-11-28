# Jest 설정 가이드

## 📚 프로젝트 구조

```
i18nexus-turborepo/
├── jest.config.js              # 루트 Jest 설정 (Monorepo projects 모드)
├── .vscode/
│   ├── settings.json          # VSCode/Cursor Jest 확장 설정
│   └── extensions.json        # 추천 확장 프로그램
└── packages/
    ├── core/
    │   └── jest.config.js     # Core 패키지 Jest 설정
    └── tools/
        └── jest.config.js     # Tools 패키지 Jest 설정
```

## 🎯 설정 목적

### 문제 상황

- **터미널**: `npm test` → ✅ 정상 작동
- **Cursor/VSCode**: Jest 확장으로 실행 → ❌ "Missing semicolon" 에러

### 원인

Cursor/VSCode의 Jest 확장은 루트 Jest 설정만 읽고, 패키지별 `jest.config.js`를 인식하지 못함.
→ TypeScript transform이 적용되지 않아 파싱 에러 발생

## ✅ 해결 방법

### 1. 루트 Jest 설정 (`jest.config.js`)

```javascript
module.exports = {
  projects: ["<rootDir>/packages/*/jest.config.js"],
};
```

**효과:**

- Cursor/VSCode가 모든 패키지의 Jest 설정을 인식
- 각 패키지의 `ts-jest` transform 자동 적용
- Monorepo 구조에서 안정적인 테스트 실행

### 2. VSCode/Cursor 설정 (`.vscode/settings.json`)

```json
{
  "jest.autoRun": "off",
  "jest.runMode": "on-demand",
  "jest.rootPath": ".",
  "jest.jestCommandLine": "npm test --"
}
```

**효과:**

- Jest를 수동으로만 실행 (자동 실행으로 인한 성능 저하 방지)
- 프로젝트 루트를 올바르게 인식
- `npm test` 명령어로 실행 (package.json의 설정 사용)

## 🚀 사용법

### 터미널에서 실행

```bash
# 전체 테스트
npm test

# 커버리지 포함
npm run test:coverage

# 특정 패키지만
cd packages/tools && npm test

# Watch 모드
npm run test:watch
```

### Cursor/VSCode에서 실행

1. **Jest 확장 설치**: `orta.vscode-jest`
2. **테스트 파일 열기**: 예) `wrapper.test.ts`
3. **테스트 실행**:
   - 전체 테스트: Command Palette → "Jest: Run All Tests"
   - 단일 테스트: 코드 옆 ▶️ 버튼 클릭

## 📊 현재 테스트 결과

```
✅ packages/core: 169 tests passed
✅ packages/tools: 73 tests passed (12 skipped)
───────────────────────────────────
✅ Total: 242 tests passed
```

## 🔍 트러블슈팅

### "Missing semicolon" 에러가 여전히 발생하는 경우

1. **Jest 캐시 클리어**:

   ```bash
   npx jest --clearCache
   ```

2. **Cursor/VSCode 재시작**:
   - Command Palette → "Developer: Reload Window"

3. **Jest 확장 재시작**:
   - Command Palette → "Jest: Stop Runner"
   - Command Palette → "Jest: Start Runner"

### 특정 패키지에서만 에러가 발생하는 경우

패키지의 `jest.config.js`에 transform 설정 확인:

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest", // ← 반드시 필요
  },
};
```

## 📚 참고 자료

- [Jest Monorepo 설정](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig)
- [ts-jest 설정](https://kulshekhar.github.io/ts-jest/)
- [VSCode Jest 확장](https://github.com/jest-community/vscode-jest)
