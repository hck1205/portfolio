export type MenuMode = "vertical" | "horizontal" | "inline";
export type MenuTheme = "light" | "dark";
export type MenuItemType = "item" | "submenu" | "group" | "divider";

export type MenuSelectDetail = {
  key: string;
  keyPath: string[];
  nativeEvent: MouseEvent | KeyboardEvent;
  selectedKeys: string[];
};

export type MenuOpenChangeDetail = {
  key: string;
  open: boolean;
  openKeys: string[];
};

export type MenuItemClickDetail = {
  key: string;
  keyPath: string[];
  nativeEvent: MouseEvent | KeyboardEvent;
};

export type MenuItemToggleDetail = {
  key: string;
  open: boolean;
};
