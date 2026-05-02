import './styles.css';

import {
  defineDsButton,
  defineDsCollapse,
  defineDsDivider,
  defineDsLayout,
  defineDsSplitter,
  defineDsTypography,
} from './components';

export {
  breakPoints,
  breakpointTokens,
  colorTokens,
  convertColorKeyToCssVariable,
  foundationTokenGroups,
  foundationTokens,
  fontTokens,
  radius,
  radiusTokens,
  shadow,
  shadowTokens,
  spacing,
  spacingTokens,
} from './foundation';
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
  TokenCategory,
} from './foundation';
export {
  defineDsButton,
  DsButton,
  defineDsDivider,
  DsDivider,
  defineDsTypography,
  DsTypography,
  defineDsCollapse,
  DsCollapse,
  DsCollapseItem,
  defineDsLayout,
  DsLayout,
  DsLayoutContent,
  DsLayoutFooter,
  DsLayoutHeader,
  DsLayoutSider,
  defineDsSplitter,
  DsSplitter,
  DsSplitterPanel,
} from './components';
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
  DividerOrientation,
  DividerProps,
  DividerSize,
  DividerTitlePlacement,
  DividerVariant,
  TypographyCopyDetail,
  TypographyEditDetail,
  TypographyProps,
  TypographyTitleLevel,
  TypographyType,
  TypographyVariant,
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
  LayoutSiderTheme,
  SplitterDraggerDoubleClickDetail,
  SplitterOrientation,
  SplitterPanelProps,
  SplitterProps,
  SplitterResizeDetail,
  SplitterResizeEndDetail,
  SplitterResizeStartDetail,
} from './components';

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsButton(registry);
  defineDsDivider(registry);
  defineDsTypography(registry);
  defineDsCollapse(registry);
  defineDsLayout(registry);
  defineDsSplitter(registry);
}

defineDesignSystemElements();
