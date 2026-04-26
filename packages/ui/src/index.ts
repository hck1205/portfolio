import "./styles.css";

import { defineDsButton, DsButton } from "./components/Button";
import { defineDsSurfaceCard, DsSurfaceCard } from "./components/SurfaceCard";

export {
  colorTokens,
  foundationTokenGroups,
  foundationTokens,
  motionTokens,
  radiusTokens,
  shadowTokens,
  spacingTokens,
  typographyTokens
} from "./foundation";
export type { FoundationToken, FoundationTokenGroup, TokenCategory } from "./foundation";
export { defineDsButton, DsButton };
export type { ButtonProps, ButtonSize, ButtonTone } from "./components/Button";
export { defineDsSurfaceCard, DsSurfaceCard };
export type { SurfaceCardProps } from "./components/SurfaceCard";

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsButton(registry);
  defineDsSurfaceCard(registry);
}

defineDesignSystemElements();
