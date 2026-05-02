import type { Home } from "lucide";

import type { LayoutBreakpoint, LayoutSiderTheme } from "../types/Layout.types";

export type LayoutStoryArgs = {
  breakpoint?: LayoutBreakpoint;
  collapsed: boolean;
  collapsedWidth: number;
  collapsible: boolean;
  reverseArrow: boolean;
  theme: LayoutSiderTheme;
  width: string;
};

export type HeaderKey = "overview" | "reports" | "customers" | "settings";
export type SideKey = "home" | "inbox" | "analytics" | "documents" | "teams" | "billing" | "admin";
export type MenuKey = SideKey | `archive-${number}`;
export type StoryIcon = typeof Home;

export type HeaderItem = {
  key: HeaderKey;
  label: string;
};

export type SideItem = {
  icon: StoryIcon;
  key: SideKey;
  label: string;
};

export type ContentCopy = Record<HeaderKey, Record<SideKey, { body: string; title: string }>>;

