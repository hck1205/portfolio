export type CollapseSize = "large" | "middle" | "small";
export type CollapseExpandIconPlacement = "start" | "end";
export type CollapseCollapsible = "header" | "icon" | "disabled";
export type CollapseHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type CollapseProps = {
  accordion?: boolean;
  activeKey?: string;
  bordered?: boolean;
  defaultActiveKey?: string;
  expandIconPlacement?: CollapseExpandIconPlacement;
  ghost?: boolean;
  size?: CollapseSize;
};

export type CollapseItemProps = {
  collapsible?: CollapseCollapsible;
  disabled?: boolean;
  extra?: string;
  headingLevel?: CollapseHeadingLevel;
  itemKey: string;
  label: string;
  showArrow?: boolean;
};

export type CollapseToggleDetail = {
  itemKey: string;
  open: boolean;
};
