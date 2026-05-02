import "./styles.css";

import { defineDsButton, defineDsCollapse, defineDsSplitter } from "./components";

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
  defineDsSplitter,
  DsSplitter,
  DsSplitterPanel
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
  SplitterDraggerDoubleClickDetail,
  SplitterOrientation,
  SplitterPanelProps,
  SplitterProps,
  SplitterResizeDetail,
  SplitterResizeEndDetail,
  SplitterResizeStartDetail
} from "./components";

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsButton(registry);
  defineDsCollapse(registry);
  defineDsSplitter(registry);
}

defineDesignSystemElements();
