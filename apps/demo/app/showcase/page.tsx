import { ShowcaseList } from "@/app/_widgets/showcase-list";

// ISR을 비활성화하고 On-Demand Revalidation만 사용
// 데이터 변경(추가/삭제/수정) 시에만 재검증
export const revalidate = false;

export default function ShowcasePage() {
  return <ShowcaseList />;
}
