export type TokenCategory =
  | "color"
  | "spacing"
  | "radius"
  | "shadow"
  | "breakpoint"
  | "font";

export type FoundationToken = {
  name: string;
  value: string;
  variable: `--${string}`;
  description: string;
};

export type FoundationTokenGroup = {
  category: TokenCategory;
  label: string;
  tokens: readonly FoundationToken[];
};
