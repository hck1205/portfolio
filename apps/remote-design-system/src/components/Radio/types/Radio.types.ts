export type RadioValue = string | number | boolean;

export type RadioSize = "large" | "middle" | "small";
export type RadioOptionType = "button" | "default";
export type RadioButtonStyle = "outline" | "solid";
export type RadioOrientation = "horizontal" | "vertical";

export type RadioGroupOption = {
  className?: string;
  disabled?: boolean;
  label: string;
  title?: string;
  value: RadioValue;
};

export type RadioGroupOptionInput = RadioValue | RadioGroupOption;

export type RadioChangeDetail = {
  checked: boolean;
  nativeEvent: Event;
  value: RadioValue;
};

export type RadioGroupChangeDetail = {
  nativeEvent: Event;
  value: RadioValue;
};

export type RadioGroupSyncOptions = {
  block: boolean;
  buttonStyle: RadioButtonStyle;
  checked: boolean;
  disabled: boolean;
  name: string;
  optionType: RadioOptionType;
  size: RadioSize;
};
