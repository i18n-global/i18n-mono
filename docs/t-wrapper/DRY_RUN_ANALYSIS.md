# dryRun 옵션 분석

## 현재 상태

### 사용 위치
- `translation-wrapper.ts`: 파일 쓰기 전 체크
- CLI 옵션: `--dry-run` 또는 `-d`
- 기본값: `false`

### 동작
```typescript
if (!this.config.dryRun) {
  fs.writeFileSync(filePath, output.code, "utf-8");
}
```

## 제 의견: **필요합니다** ✅

### 이유

#### 1. **안전성** (가장 중요)
- 파일을 수정하기 전에 어떤 변경이 일어날지 확인 가능
- 실수로 잘못된 변환이 일어나는 것을 방지
- 특히 대규모 프로젝트에서 중요

#### 2. **일관성**
- 다른 도구들도 모두 `--dry-run` 지원:
  - `i18n-extractor --dry-run`
  - `i18n-clean-legacy --dry-run`
  - `i18n-upload --dry-run`
  - `i18n-download --dry-run`
- 사용자가 일관된 경험을 가질 수 있음

#### 3. **사용자 경험**
- 실제 적용 전에 미리보기 가능
- "이 파일이 어떻게 변환될까?" 확인 가능
- 신뢰도 향상

#### 4. **CI/CD 통합**
- 실제 수정 없이 검증 가능
- PR 생성 전에 변환 결과 확인
- 자동화된 검증 파이프라인에 유용

#### 5. **디버깅**
- 변환 로직이 올바른지 확인
- 예상치 못한 변환 감지
- 테스트에서도 유용 (파일 수정 없이 로직 확인)

## 현재 문제점

### 1. **출력이 없음**
```typescript
// 현재: dryRun일 때 아무것도 출력하지 않음
if (!this.config.dryRun) {
  fs.writeFileSync(filePath, output.code, "utf-8");
}
```

**문제:**
- 사용자가 무엇이 변환되었는지 확인 불가
- 변환 결과를 볼 수 없음

**개선 방안:**
```typescript
if (this.config.dryRun) {
  // 변환 결과를 콘솔에 출력
  console.log(`[DRY RUN] Would modify: ${filePath}`);
  console.log(`[DRY RUN] Changes:\n${diff}`);
} else {
  fs.writeFileSync(filePath, output.code, "utf-8");
}
```

### 2. **변환 통계 부족**
- 몇 개 파일이 변환되었는지 알 수 없음
- 어떤 파일이 변환되었는지 알 수 없음

**개선 방안:**
```typescript
if (this.config.dryRun) {
  console.log(`[DRY RUN] Would process ${processedFiles.length} files`);
  console.log(`[DRY RUN] Would modify ${modifiedFiles.length} files`);
}
```

## 개선 제안

### 1. **변환 결과 출력**
```typescript
if (this.config.dryRun) {
  console.log(`\n[DRY RUN] File: ${filePath}`);
  console.log(`[DRY RUN] Would modify: ${isFileModified}`);
  if (isFileModified) {
    console.log(`[DRY RUN] Diff:\n${generateDiff(code, output.code)}`);
  }
}
```

### 2. **요약 리포트**
```typescript
if (this.config.dryRun) {
  console.log(`\n[DRY RUN] Summary:`);
  console.log(`  - Files processed: ${processedFiles.length}`);
  console.log(`  - Files would be modified: ${modifiedFiles.length}`);
  console.log(`  - Files unchanged: ${unchangedFiles.length}`);
}
```

### 3. **파일별 상세 정보**
```typescript
if (this.config.dryRun && isFileModified) {
  console.log(`\n[DRY RUN] ${filePath}:`);
  console.log(`  - Components modified: ${modifiedComponents.length}`);
  console.log(`  - Strings converted: ${convertedStrings.length}`);
}
```

## 대안: dryRun 제거?

### 제거 시 문제점

1. **안전성 저하**
   - 파일을 수정하기 전에 확인 불가
   - 실수로 잘못된 변환 적용 가능

2. **일관성 저하**
   - 다른 도구들과 일관성 없음
   - 사용자 혼란

3. **사용자 경험 저하**
   - 신뢰도 하락
   - 실제 적용 전 확인 불가

### 제거 시 대안

1. **Git 사용**
   ```bash
   git add -A
   npx i18n-wrapper
   git diff  # 변경사항 확인
   git reset  # 되돌리기
   ```
   - 하지만 Git이 없는 환경에서는 불가능
   - 더 복잡함

2. **백업 생성**
   - 자동으로 백업 생성
   - 하지만 dry-run보다 복잡하고 느림

## 결론

### **dryRun은 필요합니다** ✅

**이유:**
1. ✅ 안전성 (가장 중요)
2. ✅ 일관성 (다른 도구들과 일관)
3. ✅ 사용자 경험
4. ✅ CI/CD 통합
5. ✅ 디버깅

**하지만 개선이 필요합니다:**
1. ⚠️ 변환 결과 출력 추가
2. ⚠️ 변환 통계 제공
3. ⚠️ 파일별 상세 정보

**제거하지 말고 개선하세요!**

---

**작성 일자**: 2025년 11월 19일  
**관련 문서**: 
- [FLOW.md](./FLOW.md)
- [INTERNAL_WORKINGS.md](./INTERNAL_WORKINGS.md)

