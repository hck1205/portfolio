import { breakpointTokens } from "../breakpoint";
import { colorTokens } from "../color";
import { radiusTokens } from "../radius";
import { shadowTokens } from "../shadow";
import { spacingTokens } from "../spacing";
import { fontTokens } from "../font";
import type { FoundationTokenGroup } from "../types";

export const foundationTokenGroups = [
  { category: "color", label: "Color", tokens: colorTokens },
  { category: "spacing", label: "Spacing", tokens: spacingTokens },
  { category: "radius", label: "Radius", tokens: radiusTokens },
  { category: "shadow", label: "Shadow", tokens: shadowTokens },
  { category: "breakpoint", label: "Breakpoints", tokens: breakpointTokens },
  { category: "font", label: "Font", tokens: fontTokens }
] as const satisfies readonly FoundationTokenGroup[];

export const foundationTokens = {
  color: colorTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
  breakpoint: breakpointTokens,
  font: fontTokens
} as const;
