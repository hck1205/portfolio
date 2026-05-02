export type InputMode = "input" | "textarea" | "search" | "password";

export type InputSize = "small" | "medium" | "large";

export type InputStatus = "error" | "warning";

export type InputVariant = "outlined" | "borderless" | "filled" | "underlined";

export type InputInputDetail = {
  value: string;
  nativeEvent: InputEvent;
};

export type InputChangeDetail = {
  value: string;
  nativeEvent: Event;
};

export type InputClearDetail = {
  previousValue: string;
};

export type InputSearchDetail = {
  source: "input" | "clear" | "button";
  value: string;
};
