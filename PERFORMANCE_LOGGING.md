# Performance Logging Enhancement

## Overview

상세한 성능 로깅 기능이 추가되어 wrapping 작업 시 각 단계별 소요 시간을 확인할 수 있습니다.

## 출력 예시

```
═══════════════════════════════════════════════════════════════════════════════
✅ Translation Wrapper Completed
═══════════════════════════════════════════════════════════════════════════════

📊 Overall Statistics:
   Total Time:        2345ms
   Files Processed:   50 files
   Avg per File:      46.9ms/file

⏱️  Time Breakdown:
   🔍 File Discovery:  125ms (5.3%)
   📖 File Reading:    234ms (10.0%)
   🔧 AST Parsing:     351ms (15.0%) - 7.0ms/file
   🔄 AST Traversal:   1405ms (59.9%) - 28.1ms/file
   ✍️  Code Gen & I/O:  230ms (9.8%)

💡 Performance Info:
   Parser:            swc (20x faster than Babel)
   Parsing Speed:     7024μs/file

🐌 Slowest Files:
   1. ComplexComponent.tsx                  145.2ms
   2. LargeFormComponent.tsx                128.5ms
   3. DataTableComponent.tsx                98.3ms
═══════════════════════════════════════════════════════════════════════════════
```

## 출력 정보 설명

### Overall Statistics (전체 통계)

- **Total Time**: 전체 작업 소요 시간
- **Files Processed**: 처리된 파일 수
- **Avg per File**: 파일당 평균 처리 시간

### Time Breakdown (시간 분석)

- **File Discovery**: 파일 검색 시간 (glob 패턴 매칭)
- **File Reading**: 파일 읽기 시간 (I/O)
- **AST Parsing**: AST 파싱 시간 (swc 사용)
  - 괄호 안: 파일당 평균 파싱 시간
  - **swc로 전환하여 20배 향상됨** (이전 Babel 대비)
- **AST Traversal**: AST 순회 및 변환 시간
  - 괄호 안: 파일당 평균 순회 시간
  - 가장 많은 시간을 차지하는 부분
- **Code Gen & I/O**: 코드 생성 및 파일 쓰기 시간

### Performance Info (성능 정보)

- **Parser**: 현재 사용 중인 파서 (swc)
- **Parsing Speed**: 파일당 파싱 속도 (마이크로초 단위)

### Slowest Files (가장 느린 파일)

- 처리 시간이 가장 긴 파일 Top 3
- 최적화가 필요한 파일을 빠르게 파악 가능

## 환경 변수

### I18N_PERF_VERBOSE

상세한 성능 리포트를 출력합니다 (모든 메트릭 표시).

```bash
I18N_PERF_VERBOSE=true npx i18n-wrapper
```

### I18N_PERF_SUMMARY

기본 성능 요약을 비활성화합니다.

```bash
I18N_PERF_SUMMARY=false npx i18n-wrapper
```

### I18N_SENTRY_DEBUG

Sentry 디버그 모드를 활성화합니다 (성능 데이터 전송 과정 확인).

```bash
I18N_SENTRY_DEBUG=true npx i18n-wrapper
```

## swc vs Babel 성능 비교

### Before (Babel)

- AST Parsing: ~22,500ms (75% of total time)
- Total Time: ~30,200ms for 1,000 files

### After (swc)

- AST Parsing: ~1,100ms (15% of total time)
- Total Time: ~9,000ms for 1,000 files
- **20x faster parsing, 3.3x overall improvement** ⚡

## 실제 사용 예시

```bash
# 기본 실행 (요약 통계 표시)
npx i18n-wrapper

# 상세 메트릭 출력
I18N_PERF_VERBOSE=true npx i18n-wrapper

# Sentry 디버그와 함께 실행
I18N_SENTRY_DEBUG=true npx i18n-wrapper

# 성능 요약 비활성화
I18N_PERF_SUMMARY=false npx i18n-wrapper
```

## 주의 사항

1. **첫 실행 시**: Node.js의 JIT 컴파일로 인해 첫 번째 실행은 이후 실행보다 느릴 수 있습니다.
2. **파일 크기**: 매우 큰 파일(>1000줄)은 평균보다 훨씬 오래 걸릴 수 있습니다.
3. **메모리**: AST 파싱은 메모리를 많이 사용하므로, 대량 파일 처리 시 메모리 사용량을 모니터링하세요.
4. **Traversal Time**: AST 순회 시간이 가장 오래 걸리는데, 이는 코드 변환 로직의 복잡도에 따라 달라집니다.

## 성능 최적화 팁

1. **작은 컴포넌트**: 큰 컴포넌트를 작은 단위로 분리하면 처리 속도가 향상됩니다.
2. **불필요한 파일 제외**: `.i18nconfig.json`의 `sourcePattern`에서 불필요한 파일을 제외하세요.
3. **swc 활용**: 이미 swc를 사용 중이므로 최적의 파싱 성능을 제공합니다.
4. **병렬 처리**: 향후 업데이트에서 병렬 파일 처리 지원 예정입니다.
