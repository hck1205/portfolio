import { OverviewView } from "./Overview.view";
import { createOverviewItems } from "./Overview.utils";

export default function Overview() {
  const items = createOverviewItems();

  return <OverviewView items={items} title="Overview" />;
}
