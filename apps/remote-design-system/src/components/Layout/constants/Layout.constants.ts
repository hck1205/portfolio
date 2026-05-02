export const LAYOUT_ELEMENT_NAME = "ds-layout";
export const LAYOUT_HEADER_ELEMENT_NAME = "ds-layout-header";
export const LAYOUT_SIDER_ELEMENT_NAME = "ds-layout-sider";
export const LAYOUT_CONTENT_ELEMENT_NAME = "ds-layout-content";
export const LAYOUT_FOOTER_ELEMENT_NAME = "ds-layout-footer";

export const LAYOUT_OBSERVED_ATTRIBUTES = ["has-sider"] as const;

export const LAYOUT_SIDER_OBSERVED_ATTRIBUTES = [
  "breakpoint",
  "collapsed",
  "collapsed-width",
  "collapsible",
  "default-collapsed",
  "reverse-arrow",
  "theme",
  "trigger",
  "width"
] as const;

export const LAYOUT_SIDER_COLLAPSE_EVENT = "ds-layout-sider-collapse";

export const LAYOUT_BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
  xxxl: 1920
} as const;

