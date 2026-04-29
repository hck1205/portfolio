import type { FoundationToken } from "../types";
import { spacing } from "../spacing";
import { createToken } from "../utils";

export const radius = {
  level1: spacing.xs1,
  level2: spacing.xs2,
  level3: spacing.xs3,
  level4: spacing.xs4,
  level5: spacing.s1,
  level6: spacing.s2,
  level7: spacing.m1,
  full: "9999px"
} as const;

export const radiusTokens = Object.entries(radius).map(([name, value]) =>
  createToken("radius", name, value, "Radius scale")
) satisfies readonly FoundationToken[];

export type Radius = typeof radius;
