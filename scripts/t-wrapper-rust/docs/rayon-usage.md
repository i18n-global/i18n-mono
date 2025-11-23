# Rayon 사용법

## 개요

Rayon은 Rust에서 데이터 병렬 처리를 위한 라이브러리입니다. `par_iter()`를 사용하여 컬렉션의 요소들을 여러 스레드에서 동시에 처리할 수 있습니다.

## 기본 사용법

### 1. `par_iter()` - 병렬 이터레이터

```rust
use rayon::prelude::*;

let items = vec![1, 2, 3, 4, 5];

// 순차 처리
let result: Vec<i32> = items.iter()
    .map(|x| x * 2)
    .collect();

// 병렬 처리
let result: Vec<i32> = items.par_iter()  // ← 병렬 이터레이터
    .map(|x| x * 2)
    .collect();
```

### 2. `filter_map()` - 필터링 + 변환

```rust
let processed_files: Vec<String> = file_paths
    .par_iter()
    .filter_map(|file_path| {
        // 처리 로직
        if success {
            Some(file_path.to_string())  // ← 결과에 포함
        } else {
            None  // ← 결과에서 제외
        }
    })
    .collect();
```

## 실제 사용 예시

### 파일 처리 예시

```rust
use rayon::prelude::*;
use std::fs;
use std::path::PathBuf;

let file_paths: Vec<PathBuf> = glob("**/*.tsx")?.collect();

let processed_files: Vec<String> = file_paths
    .par_iter()  // 병렬 처리 시작
    .filter_map(|file_path| {
        // 파일 읽기
        let code = match fs::read_to_string(file_path) {
            Ok(c) => c,
            Err(_) => return None,  // 실패 시 제외
        };

        // 처리 로직
        if should_process(&code) {
            Some(file_path.to_string_lossy().to_string())
        } else {
            None
        }
    })
    .collect();  // 결과 수집
```

## 주요 메서드

### `par_iter()` vs `into_par_iter()`

```rust
// 참조로 빌림 (원본 유지)
items.par_iter()  // &T

// 소유권 이동 (원본 소비)
items.into_par_iter()  // T
```

### 체이닝 가능한 메서드

```rust
file_paths.par_iter()
    .map(|x| x * 2)              // 변환
    .filter(|x| x > 10)          // 필터링
    .filter_map(|x| Some(x))   // 필터링 + 변환
    .flat_map(|x| vec![x])      // 평탄화
    .collect()                   // 수집
```

## 성능 고려사항

1. **작은 데이터셋**: 순차 처리가 더 빠를 수 있음
2. **큰 데이터셋**: 병렬 처리가 효과적
3. **오버헤드**: 스레드 생성 비용 고려
4. **CPU 바운드 작업**: 병렬 처리에 적합

## 주의사항

### 스레드 안전성

```rust
use std::sync::{Arc, Mutex};

let shared_data = Arc::new(Mutex::new(Vec::new()));

file_paths.par_iter().for_each(|file_path| {
    let mut data = shared_data.lock().unwrap();
    data.push(file_path.to_string());
});
```

### 클로저의 소유권

```rust
let config = config.clone();  // 각 스레드에서 사용하기 위해 복제

file_paths.par_iter().for_each(|file_path| {
    // config 사용 가능
    process_file(file_path, &config);
});
```

## 요약

- `par_iter()`: 병렬 이터레이터 생성
- `filter_map()`: 처리 후 `Some`만 포함, `None`은 제외
- `collect()`: 결과를 컬렉션으로 수집
- CPU 바운드 작업에 효과적
- 스레드 안전성 고려 필요
