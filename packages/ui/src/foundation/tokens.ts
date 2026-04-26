export type TokenCategory =
  | "color"
  | "typography"
  | "spacing"
  | "radius"
  | "shadow"
  | "motion";

export type FoundationToken = {
  name: string;
  value: string;
  variable: `--ds-${string}`;
  description: string;
};

export type FoundationTokenGroup = {
  category: TokenCategory;
  label: string;
  tokens: readonly FoundationToken[];
};

export const colorTokens = [
  {
    name: "canvas",
    value: "#f7f7f4",
    variable: "--ds-color-background-canvas",
    description: "Default app and documentation background"
  },
  {
    name: "surface",
    value: "#ffffff",
    variable: "--ds-color-background-surface",
    description: "Raised component surface"
  },
  {
    name: "text",
    value: "#171717",
    variable: "--ds-color-content-primary",
    description: "Primary readable text"
  },
  {
    name: "muted",
    value: "#5f635d",
    variable: "--ds-color-content-muted",
    description: "Secondary labels and helper text"
  },
  {
    name: "border",
    value: "#d8d9d2",
    variable: "--ds-color-border-default",
    description: "Default component border"
  },
  {
    name: "primary",
    value: "#155dfc",
    variable: "--ds-color-action-primary",
    description: "Primary action fill"
  },
  {
    name: "primary-hover",
    value: "#0f4ed8",
    variable: "--ds-color-action-primary-hover",
    description: "Primary action hover fill"
  },
  {
    name: "neutral",
    value: "#24292f",
    variable: "--ds-color-action-neutral",
    description: "Neutral action fill"
  },
  {
    name: "neutral-hover",
    value: "#111418",
    variable: "--ds-color-action-neutral-hover",
    description: "Neutral action hover fill"
  },
  {
    name: "danger",
    value: "#c2410c",
    variable: "--ds-color-action-danger",
    description: "Destructive action fill"
  },
  {
    name: "danger-hover",
    value: "#9a3412",
    variable: "--ds-color-action-danger-hover",
    description: "Destructive action hover fill"
  }
] as const satisfies readonly FoundationToken[];

export const typographyTokens = [
  {
    name: "font-sans",
    value: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    variable: "--ds-font-family-sans",
    description: "Default interface font stack"
  },
  {
    name: "font-size-1",
    value: "12px",
    variable: "--ds-font-size-1",
    description: "Compact labels"
  },
  {
    name: "font-size-2",
    value: "14px",
    variable: "--ds-font-size-2",
    description: "Small controls"
  },
  {
    name: "font-size-3",
    value: "15px",
    variable: "--ds-font-size-3",
    description: "Default component text"
  },
  {
    name: "font-size-5",
    value: "24px",
    variable: "--ds-font-size-5",
    description: "Compact section titles"
  },
  {
    name: "font-weight-strong",
    value: "700",
    variable: "--ds-font-weight-strong",
    description: "Button and important label weight"
  },
  {
    name: "font-weight-emphasis",
    value: "800",
    variable: "--ds-font-weight-emphasis",
    description: "Eyebrow and active navigation weight"
  },
  {
    name: "line-height-tight",
    value: "1.2",
    variable: "--ds-line-height-tight",
    description: "Headings and dense labels"
  },
  {
    name: "line-height-readable",
    value: "1.6",
    variable: "--ds-line-height-readable",
    description: "Body copy inside cards"
  }
] as const satisfies readonly FoundationToken[];

export const spacingTokens = [
  {
    name: "space-1",
    value: "4px",
    variable: "--ds-space-1",
    description: "Tiny internal offset"
  },
  {
    name: "space-2",
    value: "8px",
    variable: "--ds-space-2",
    description: "Tight element grouping"
  },
  {
    name: "space-3",
    value: "10px",
    variable: "--ds-space-3",
    description: "Compact inline gap"
  },
  {
    name: "space-4",
    value: "14px",
    variable: "--ds-space-4",
    description: "Small control padding"
  },
  {
    name: "space-5",
    value: "16px",
    variable: "--ds-space-5",
    description: "Default stack gap"
  },
  {
    name: "space-6",
    value: "18px",
    variable: "--ds-space-6",
    description: "Medium control padding"
  },
  {
    name: "space-8",
    value: "24px",
    variable: "--ds-space-8",
    description: "Card padding"
  },
  {
    name: "space-10",
    value: "32px",
    variable: "--ds-space-10",
    description: "Page and showcase padding"
  }
] as const satisfies readonly FoundationToken[];

export const radiusTokens = [
  {
    name: "radius-sm",
    value: "6px",
    variable: "--ds-radius-sm",
    description: "Compact controls"
  },
  {
    name: "radius-md",
    value: "8px",
    variable: "--ds-radius-md",
    description: "Cards and panels"
  }
] as const satisfies readonly FoundationToken[];

export const shadowTokens = [
  {
    name: "shadow-card",
    value: "0 16px 48px rgba(23, 23, 23, 0.08)",
    variable: "--ds-shadow-card",
    description: "Raised card elevation"
  }
] as const satisfies readonly FoundationToken[];

export const motionTokens = [
  {
    name: "duration-fast",
    value: "160ms",
    variable: "--ds-duration-fast",
    description: "Hover and focus transition duration"
  },
  {
    name: "ease-standard",
    value: "ease",
    variable: "--ds-ease-standard",
    description: "Default transition timing"
  }
] as const satisfies readonly FoundationToken[];

export const foundationTokenGroups = [
  { category: "color", label: "Color", tokens: colorTokens },
  { category: "typography", label: "Typography", tokens: typographyTokens },
  { category: "spacing", label: "Spacing", tokens: spacingTokens },
  { category: "radius", label: "Radius", tokens: radiusTokens },
  { category: "shadow", label: "Shadow", tokens: shadowTokens },
  { category: "motion", label: "Motion", tokens: motionTokens }
] as const satisfies readonly FoundationTokenGroup[];

export const foundationTokens = {
  color: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
  motion: motionTokens
} as const;
