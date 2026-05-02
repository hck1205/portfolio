export type TabsSize = "large" | "medium" | "small";

export type TabsType = "line" | "card";

export type TabsPlacement = "top" | "bottom" | "start" | "end";

export type TabItemData = {
  closable: boolean;
  disabled: boolean;
  icon: string;
  key: string;
  label: string;
};

export type TabsChangeDetail = {
  activeKey: string;
  previousActiveKey: string;
};

export type TabsEditDetail =
  | {
      action: "add";
      key: string;
    }
  | {
      action: "remove";
      key: string;
    };
