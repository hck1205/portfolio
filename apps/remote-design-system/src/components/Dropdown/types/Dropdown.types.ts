export type DropdownPlacement = "bottom-left" | "bottom" | "bottom-right" | "top-left" | "top" | "top-right";

export type DropdownTrigger = "click" | "hover" | "context-menu";

export type DropdownItemType = "item" | "divider";

export type DropdownOpenChangeSource = "trigger" | "menu" | "outside" | "keyboard";

export type DropdownOpenChangeDetail = {
  open: boolean;
  source: DropdownOpenChangeSource;
};

export type DropdownSelectDetail = {
  href: string;
  key: string;
  label: string;
  nativeEvent: MouseEvent | KeyboardEvent;
};

export type DropdownItemClickDetail = DropdownSelectDetail;
