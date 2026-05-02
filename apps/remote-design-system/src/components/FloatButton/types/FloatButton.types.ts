export type FloatButtonType = "default" | "primary";
export type FloatButtonShape = "circle" | "square";
export type FloatButtonHtmlType = "button" | "submit" | "reset";
export type FloatButtonGroupPlacement = "top" | "right" | "bottom" | "left";
export type FloatButtonGroupTrigger = "click" | "hover";

export type FloatButtonProps = {
  badge?: string;
  content?: string;
  disabled?: boolean;
  href?: string;
  htmlType?: FloatButtonHtmlType;
  shape?: FloatButtonShape;
  target?: string;
  tooltip?: string;
  type?: FloatButtonType;
};

export type FloatButtonGroupProps = {
  open?: boolean;
  placement?: FloatButtonGroupPlacement;
  shape?: FloatButtonShape;
  trigger?: FloatButtonGroupTrigger;
};

export type FloatButtonClickDetail = {
  backTop: boolean;
  href: string;
  nativeEvent: MouseEvent;
};

export type FloatButtonGroupOpenChangeDetail = {
  nativeEvent?: Event;
  open: boolean;
};
