import {
  OverviewItem,
  OverviewItemLabel,
  OverviewItemValue,
  OverviewList,
  OverviewRoot,
  OverviewTitle
} from "./Overview.styles";
import type { OverviewViewProps } from "./Overview.types";

function OverviewView({ items, title }: OverviewViewProps) {
  return (
    <OverviewRoot>
      <OverviewTitle>{title}</OverviewTitle>
      <OverviewList>
        {items.map((item) => (
          <OverviewItem key={item.label}>
            <OverviewItemLabel>{item.label}</OverviewItemLabel>
            <OverviewItemValue>{item.value}</OverviewItemValue>
          </OverviewItem>
        ))}
      </OverviewList>
    </OverviewRoot>
  );
}

export default OverviewView;
