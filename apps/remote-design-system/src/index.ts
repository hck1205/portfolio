import "./styles.css";

import { defineDsButton, DsButton } from "./components/Button";
import { defineDsSurfaceCard, DsSurfaceCard } from "./components/SurfaceCard";

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
export { defineDsButton, DsButton };
export type { ButtonProps, ButtonSize, ButtonTone } from "./components/Button";
export { defineDsSurfaceCard, DsSurfaceCard };
export type { SurfaceCardProps } from "./components/SurfaceCard";

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsButton(registry);
  defineDsSurfaceCard(registry);
}

defineDesignSystemElements();
