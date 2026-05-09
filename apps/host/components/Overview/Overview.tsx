import OverviewView from "./Overview.view";
import { createOverviewItems } from "./Overview.utils";

/**
 * Host 앱의 기본 overview 화면에 필요한 데이터를 구성하고 view 컴포넌트로 전달합니다.
 */
function Overview() {
  const items = createOverviewItems();

  return <OverviewView items={items} title="Hello World!" />;
}

export default Overview;
