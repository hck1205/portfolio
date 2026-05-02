export type InputNumberFormatter = "decimal" | "currency" | "percent";

export type InputNumberSize = "small" | "medium" | "large";

export type InputNumberStatus = "error" | "warning";

export type InputNumberVariant = "outlined" | "borderless" | "filled" | "underlined";

export type InputNumberChangeDetail = {
  displayValue: string;
  nativeEvent?: Event;
  value: number | null;
};

export type InputNumberStepDetail = {
  offset: number;
  value: number | null;
};
