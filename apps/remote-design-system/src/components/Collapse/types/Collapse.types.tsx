export type CollapseSize = "large" | "middle" | "small";
export type CollapseExpandIconPlacement = "start" | "end";
export type CollapseCollapsible = "header" | "icon" | "disabled";

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
  itemKey: string;
  label: string;
  showArrow?: boolean;
};

export type CollapseToggleDetail = {
  itemKey: string;
  open: boolean;
};
