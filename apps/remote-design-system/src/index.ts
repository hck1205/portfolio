import "./styles.css";

import { defineDsButton, defineDsCollapse, defineDsFloatButton } from "./components";

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
  defineDsFloatButton,
  DsFloatButton,
  DsFloatButtonGroup,
  defineDsCollapse,
  DsCollapse,
  DsCollapseItem
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
  FloatButtonClickDetail,
  FloatButtonGroupOpenChangeDetail,
  FloatButtonGroupPlacement,
  FloatButtonGroupProps,
  FloatButtonGroupTrigger,
  FloatButtonHtmlType,
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonType,
  CollapseCollapsible,
  CollapseExpandIconPlacement,
  CollapseHeadingLevel,
  CollapseItemProps,
  CollapseProps,
  CollapseSize
} from "./components";

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsButton(registry);
  defineDsFloatButton(registry);
  defineDsCollapse(registry);
}

defineDesignSystemElements();
