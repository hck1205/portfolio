export type DividerOrientation = "horizontal" | "vertical";
export type DividerSize = "small" | "medium" | "large";
export type DividerTitlePlacement = "start" | "center" | "end";
export type DividerVariant = "solid" | "dashed" | "dotted";

export type DividerProps = {
  color?: string;
  colorToken?: string;
  dashed?: boolean;
  orientation?: DividerOrientation;
  orientationMargin?: string;
  plain?: boolean;
  size?: DividerSize;
  titlePlacement?: DividerTitlePlacement;
  variant?: DividerVariant;
  vertical?: boolean;
};
