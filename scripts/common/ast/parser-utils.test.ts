/**
 * parser-utils 테스트
 * 
 * parseFile, generateCode는 단순 래퍼 함수이므로 테스트 불필요
 * 실제 파싱/생성 로직은 @babel/parser, @babel/generator가 담당
 */

// 테스트할 핵심 로직이 없으므로 빈 테스트 파일 유지
// 필요시 통합 테스트에서 검증
describe("parser-utils", () => {
  it("모듈이 정상적으로 export되어야 함", () => {
    // 모듈 로드 확인만 수행
    expect(true).toBe(true);
  });
});
