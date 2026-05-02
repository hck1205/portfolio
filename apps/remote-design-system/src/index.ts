import "./styles.css";

import { defineDsButton, defineDsCollapse, defineDsLayout } from "./components";

export {
  breakPoints,
  breakpointTokens,
  colorTokens,
  convertColorKeyToCssVariable,
  foundationTokenGroups,
  foundationTokens,
  radius,
  radiusTokens,
  shadow,
  shadowTokens,
  spacing,
  spacingTokens,
  fontTokens
} from "./foundation";
export type {
  BreakPoints,
  ColorToken,
  ColorTokenNames,
  Colors,
  FoundationToken,
  FoundationTokenGroup,
  Radius,
  Shadow,
  Spacing,
  TokenCategory
} from "./foundation";
export {
  defineDsButton,
  DsButton,
  defineDsCollapse,
  DsCollapse,
  DsCollapseItem,
  defineDsLayout,
  DsLayout,
  DsLayoutContent,
  DsLayoutFooter,
  DsLayoutHeader,
  DsLayoutSider
} from "./components";
export type {
  ButtonClickDetail,
  ButtonColor,
  ButtonHtmlType,
  ButtonIconPlacement,
  ButtonProps,
  ButtonShape,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  CollapseCollapsible,
  CollapseExpandIconPlacement,
  CollapseHeadingLevel,
  CollapseItemProps,
  CollapseProps,
  CollapseSize,
  LayoutBreakpoint,
  LayoutProps,
  LayoutSiderCollapseDetail,
  LayoutSiderCollapseType,
  LayoutSiderProps,
  LayoutSiderTheme
} from "./components";

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsButton(registry);
  defineDsCollapse(registry);
  defineDsLayout(registry);
}

defineDesignSystemElements();
