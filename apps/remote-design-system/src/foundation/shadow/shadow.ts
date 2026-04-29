import type { FoundationToken } from "../types";
import { createToken } from "../utils";

export const shadow = {
  light: {
    "1dp": "0 1px 2px rgba(18, 18, 20, 0.08)",
    "2dp": "0 2px 8px rgba(18, 18, 20, 0.12)",
    "4dp": "0 4px 16px rgba(18, 18, 20, 0.14)",
    "8dp": "0 8px 28px rgba(18, 18, 20, 0.16)",
    "16dp": "0 16px 48px rgba(18, 18, 20, 0.2)"
  },
  dark: {
    "1dp": "0 1px 2px rgba(0, 0, 0, 0.3)",
    "2dp": "0 2px 8px rgba(0, 0, 0, 0.38)",
    "4dp": "0 4px 16px rgba(0, 0, 0, 0.44)",
    "8dp": "0 8px 28px rgba(0, 0, 0, 0.5)",
    "16dp": "0 16px 48px rgba(0, 0, 0, 0.58)"
  }
} as const;

export const shadowTokens = Object.entries(shadow).flatMap(([theme, levels]) =>
  Object.entries(levels).map(([level, value]) =>
    createToken("shadow", `${theme}/${level}`, value, `${theme} shadow ${level}`)
  )
) satisfies readonly FoundationToken[];

export type Shadow = typeof shadow;
