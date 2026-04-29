import type { FoundationToken } from "../types";
import { createToken } from "../utils";

export const spacing = {
  xs1: "0.25rem",
  xs2: "0.5rem",
  xs3: "0.75rem",
  xs4: "1rem",
  s1: "1.25rem",
  s2: "1.5rem",
  s3: "1.75rem",
  s4: "2rem",
  m1: "2.25rem",
  m2: "2.5rem",
  m3: "3rem",
  m4: "3.5rem",
  l1: "4rem",
  l2: "4.5rem",
  l3: "5rem",
  l4: "5.5rem",
  xl1: "6rem",
  xl2: "7rem",
  xl3: "8rem",
  xl4: "10rem",
  xxl1: "12rem",
  xxl2: "16rem",
  xxl3: "20rem",
  xxl4: "24rem",
  "-1": "-0.5rem",
  "-2": "-1rem",
  "-3": "-1.5rem",
  "-4": "-3rem"
} as const;

export const spacingTokens = Object.entries(spacing).map(([name, value]) =>
  createToken("spacing", name, value, "Spacing scale")
) satisfies readonly FoundationToken[];

export type Spacing = typeof spacing;
