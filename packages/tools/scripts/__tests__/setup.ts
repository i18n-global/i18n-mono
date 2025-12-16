/**
 * Jest 설정 파일
 * 모든 테스트 실행 전에 실행되는 초기화 코드
 */

// Console 출력 억제 (테스트 중 불필요한 로그 방지)
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // 테스트 환경에서 console.log를 억제할 수 있도록 설정
  // 필요시 각 테스트에서 개별적으로 활성화 가능
});

afterAll(() => {
  // 정리 작업
});

// 각 테스트 후 정리
afterEach(() => {
  jest.clearAllMocks();
});
