export type ButtonType = "default" | "primary" | "dashed" | "text" | "link";
export type ButtonColor = "default" | "primary" | "danger";
export type ButtonVariant = "outlined" | "dashed" | "solid" | "filled" | "text" | "link";
export type ButtonSize = "large" | "middle" | "small";
export type ButtonShape = "default" | "round" | "circle";
export type ButtonIconPlacement = "start" | "end";
export type ButtonHtmlType = "button" | "submit" | "reset";

export type ButtonProps = {
  block?: boolean;
  color?: ButtonColor;
  danger?: boolean;
  disabled?: boolean;
  ghost?: boolean;
  href?: string;
  htmlType?: ButtonHtmlType;
  iconPlacement?: ButtonIconPlacement;
  loading?: boolean;
  rel?: string;
  shape?: ButtonShape;
  size?: ButtonSize;
  target?: string;
  type?: ButtonType;
  variant?: ButtonVariant;
};

export type ButtonClickDetail = {
  href: string;
  loading: boolean;
  nativeEvent: MouseEvent;
};

export type ResolvedButtonAppearance = {
  color: ButtonColor;
  variant: ButtonVariant;
};

