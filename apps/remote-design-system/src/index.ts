import "./styles.css";

import { defineDsCollapse } from "./components";

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
  defineDsCollapse,
  DsCollapse,
  DsCollapseItem
} from "./components";
export type {
  CollapseCollapsible,
  CollapseExpandIconPlacement,
  CollapseItemProps,
  CollapseProps,
  CollapseSize
} from "./components";

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsCollapse(registry);
}

defineDesignSystemElements();
