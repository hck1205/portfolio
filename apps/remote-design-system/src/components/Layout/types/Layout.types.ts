import type { LAYOUT_BREAKPOINTS } from "../constants/Layout.constants";

export type LayoutBreakpoint = keyof typeof LAYOUT_BREAKPOINTS;
export type LayoutSiderCollapseType = "clickTrigger" | "responsive";
export type LayoutSiderTheme = "dark" | "light";

export type LayoutProps = {
  hasSider?: boolean;
};

export type LayoutSiderProps = {
  breakpoint?: LayoutBreakpoint;
  collapsed?: boolean;
  collapsedWidth?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  reverseArrow?: boolean;
  theme?: LayoutSiderTheme;
  trigger?: string;
  width?: number | string;
};

export type LayoutSiderCollapseDetail = {
  collapsed: boolean;
  type: LayoutSiderCollapseType;
};

