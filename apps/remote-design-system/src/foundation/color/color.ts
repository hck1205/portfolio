import type { FoundationToken } from "../types";
import { tokenNameToCssVariable } from "../utils";

type ColorFamily = "Rose" | "Coral" | "Amber" | "Moss" | "Violet" | "Cyan" | "Indigo" | "Teal";

type ColorTokenName =
  | `Neutral/Solid/N${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`
  | `Neutral/Alpha/N${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `Neutral/Static/${"Light" | "Dark"}`
  | `${ColorFamily}/Solid/${ColorFamily}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`
  | `${ColorFamily}/Alpha/${ColorFamily}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `Semantic/${string}/${string}`;

export type ColorToken = FoundationToken & {
  name: ColorTokenName;
  variable: `--color-${string}`;
};

const neutralSolid = {
  N0: "#ffffff",
  N1: "#f8f8fa",
  N2: "#f0f1f3",
  N3: "#e1e3e8",
  N4: "#caced6",
  N5: "#a9afba",
  N6: "#858d9b",
  N7: "#626b7a",
  N8: "#3f4652",
  N9: "#252b35",
  N10: "#111316"
} as const;

const neutralAlpha = {
  N1: "rgba(17, 19, 22, 0.04)",
  N2: "rgba(17, 19, 22, 0.08)",
  N3: "rgba(17, 19, 22, 0.14)",
  N4: "rgba(17, 19, 22, 0.22)",
  N5: "rgba(17, 19, 22, 0.32)",
  N6: "rgba(17, 19, 22, 0.46)",
  N7: "rgba(17, 19, 22, 0.62)",
  N8: "rgba(17, 19, 22, 0.78)",
  N9: "rgba(17, 19, 22, 0.9)"
} as const;

const neutralStatic = {
  Light: "#ffffff",
  Dark: "#111316"
} as const;

const colorScale = {
  Rose: {
    solid: [
      "#fff0f6",
      "#ffd8e9",
      "#ffb6d7",
      "#ff8cc2",
      "#f264a9",
      "#d53f8c",
      "#b42b72",
      "#8f245a",
      "#6a1d43",
      "#43142c"
    ],
    alphaBase: "213, 63, 140"
  },
  Coral: {
    solid: [
      "#fff1ed",
      "#ffd9d1",
      "#ffb6a9",
      "#ff8d7c",
      "#ef6758",
      "#cf483d",
      "#ad342f",
      "#8a2a29",
      "#632222",
      "#3f1719"
    ],
    alphaBase: "207, 72, 61"
  },
  Amber: {
    solid: [
      "#fff8d6",
      "#ffeb9a",
      "#ffdc5c",
      "#f5c331",
      "#dca812",
      "#bc8b07",
      "#9a7008",
      "#79560a",
      "#58400b",
      "#3a2a08"
    ],
    alphaBase: "188, 139, 7"
  },
  Moss: {
    solid: [
      "#effbe8",
      "#d6f4c7",
      "#b1e89e",
      "#87d574",
      "#5ebb51",
      "#40973a",
      "#30782f",
      "#275e28",
      "#204621",
      "#162e17"
    ],
    alphaBase: "64, 151, 58"
  },
  Violet: {
    solid: [
      "#f6f0ff",
      "#e8dbff",
      "#d4bfff",
      "#bd9bff",
      "#9d76ee",
      "#7f57cf",
      "#6641aa",
      "#503584",
      "#3b285f",
      "#261b3e"
    ],
    alphaBase: "127, 87, 207"
  },
  Cyan: {
    solid: [
      "#e8fbff",
      "#c7f2fb",
      "#98e4f1",
      "#65d0de",
      "#35b5c6",
      "#1695a6",
      "#0e7888",
      "#0d5f6d",
      "#0d4652",
      "#092f37"
    ],
    alphaBase: "22, 149, 166"
  },
  Indigo: {
    solid: [
      "#eef5ff",
      "#d8e8ff",
      "#b8d5ff",
      "#8ebcff",
      "#609fec",
      "#3e7ccc",
      "#2c62a9",
      "#244d85",
      "#1c3a62",
      "#132640"
    ],
    alphaBase: "62, 124, 204"
  },
  Teal: {
    solid: [
      "#e8fbf3",
      "#caf2df",
      "#9be4c8",
      "#69d0ad",
      "#3bb58f",
      "#229576",
      "#1a765f",
      "#175d4b",
      "#134638",
      "#0d2d25"
    ],
    alphaBase: "34, 149, 118"
  }
} as const satisfies Record<ColorFamily, { solid: readonly string[]; alphaBase: string }>;

const alphaLevels = ["0.06", "0.1", "0.16", "0.24", "0.34", "0.46", "0.6", "0.74", "0.88"] as const;

function createColorToken(name: ColorTokenName, value: string, description: string): ColorToken {
  return {
    name,
    value,
    variable: tokenNameToCssVariable("color", name) as `--color-${string}`,
    description
  };
}

const neutralTokens = [
  ...Object.entries(neutralSolid).map(([shade, value]) =>
    createColorToken(`Neutral/Solid/${shade}` as ColorTokenName, value, "Theme-aware neutral solid")
  ),
  ...Object.entries(neutralAlpha).map(([shade, value]) =>
    createColorToken(`Neutral/Alpha/${shade}` as ColorTokenName, value, "Transparent neutral overlay")
  ),
  ...Object.entries(neutralStatic).map(([shade, value]) =>
    createColorToken(`Neutral/Static/${shade}` as ColorTokenName, value, "Theme-independent neutral")
  )
];

const paletteTokens = Object.entries(colorScale).flatMap(([family, palette]) => [
  ...palette.solid.map((value, index) =>
    createColorToken(
      `${family}/Solid/${family}${index + 1}` as ColorTokenName,
      value,
      `${family} solid color`
    )
  ),
  ...alphaLevels.map((alpha, index) =>
    createColorToken(
      `${family}/Alpha/${family}${index + 1}` as ColorTokenName,
      `rgba(${palette.alphaBase}, ${alpha})`,
      `${family} alpha overlay`
    )
  )
]);

const semanticColorTokens = [
  createColorToken("Semantic/Surface/Canvas", neutralSolid.N1, "Default app and documentation background"),
  createColorToken("Semantic/Surface/Raised", neutralSolid.N0, "Raised component surface"),
  createColorToken("Semantic/Text/Primary", neutralSolid.N10, "Primary readable text"),
  createColorToken("Semantic/Text/Muted", neutralSolid.N7, "Secondary labels and helper text"),
  createColorToken("Semantic/Stroke/Default", neutralSolid.N3, "Default component border"),
  createColorToken("Semantic/Intent/Primary/Base", colorScale.Indigo.solid[6], "Primary action fill"),
  createColorToken("Semantic/Intent/Primary/Hover", colorScale.Indigo.solid[7], "Primary action hover fill"),
  createColorToken("Semantic/Intent/Neutral/Base", neutralSolid.N8, "Neutral action fill"),
  createColorToken("Semantic/Intent/Neutral/Hover", neutralSolid.N10, "Neutral action hover fill"),
  createColorToken("Semantic/Intent/Danger/Base", colorScale.Coral.solid[6], "Destructive action fill"),
  createColorToken("Semantic/Intent/Danger/Hover", colorScale.Coral.solid[7], "Destructive action hover fill")
];

export const colorTokens = [
  ...neutralTokens,
  ...paletteTokens,
  ...semanticColorTokens
] as const satisfies readonly ColorToken[];

export type Colors = typeof colorTokens;
export type ColorTokenNames = (typeof colorTokens)[number]["name"];

export const convertColorKeyToCssVariable = (key: string) =>
  `var(--color-${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/\//g, "-")})`;
