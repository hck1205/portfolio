import type { FoundationToken } from "../types";
import { createToken } from "../utils";

export const breakPoints = {
  mobile: 360,
  tablet: 800,
  desktop: 1280,
  desktopLarge: 1440
} as const;

export const breakpointTokens = Object.entries(breakPoints).map(([name, value]) =>
  createToken("breakpoint", name, `${value}px`, "Responsive breakpoint")
) satisfies readonly FoundationToken[];

export type BreakPoints = typeof breakPoints;
