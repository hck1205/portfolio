import { overviewClassNames } from "./Overview.styled";
import type { OverviewViewProps } from "./Overview.types";

export function OverviewView({ items, title }: OverviewViewProps) {
  return (
    <div className={overviewClassNames.root}>
      <h2 className={overviewClassNames.title}>{title}</h2>
      <div className={overviewClassNames.list}>
        {items.map((item) => (
          <div className={overviewClassNames.item} key={item.label}>
            <span className={overviewClassNames.itemLabel}>{item.label}</span>
            <strong className={overviewClassNames.itemValue}>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
