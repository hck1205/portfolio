export type TypographyVariant = "text" | "title" | "paragraph";
export type TypographyType = "default" | "secondary" | "success" | "warning" | "danger";
export type TypographyTitleLevel = 1 | 2 | 3 | 4 | 5;
export type TypographyTextOverflow = "truncate" | "break" | "none";
export type TypographyDisplay =
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "contents"
  | "flow-root"
  | "none";
export type TypographyTextAlign = "left" | "right" | "center" | "justify" | "start" | "end";
export type TypographyTextDecoration = "overline" | "underline" | "line-through" | "none";
export type TypographyProductTheme = "clo" | "connect" | "md";
export type TypographyWeight = "Normal" | "Medium" | "SemiBold" | "Bold";
export type TypographyScope = "Normal" | "UI";
export type TypographyScale =
  | "Display"
  | "LargeTitle"
  | "Headline"
  | "Title"
  | "Subtitle"
  | "Body"
  | "Label"
  | "Callout"
  | "Footnote"
  | "Button";
export type TypographyTypoName =
  | `${TypographyScope}/${TypographyScale}/${number}/${TypographyWeight}`
  | `${TypographyScope}/LargeTitle/${TypographyWeight}`;

export type TypographyProps = {
  as?: string;
  code?: boolean;
  color?: string;
  colorToken?: string;
  copyable?: boolean;
  delete?: boolean;
  disabled?: boolean;
  display?: TypographyDisplay;
  editable?: boolean;
  ellipsis?: boolean;
  href?: string;
  italic?: boolean;
  keyboard?: boolean;
  level?: TypographyTitleLevel;
  mark?: boolean;
  productTheme?: TypographyProductTheme;
  rows?: number;
  strong?: boolean;
  target?: string;
  textAlign?: TypographyTextAlign;
  textDecoration?: TypographyTextDecoration;
  textOverflow?: TypographyTextOverflow;
  typoName?: TypographyTypoName;
  type?: TypographyType;
  underline?: boolean;
  variant?: TypographyVariant;
};

export type TypographyCopyDetail = {
  text: string;
};

export type TypographyEditDetail = {
  value: string;
};
