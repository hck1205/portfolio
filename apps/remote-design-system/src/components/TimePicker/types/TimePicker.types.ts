export type TimePickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type TimePickerSize = "small" | "medium" | "large";
export type TimePickerStatus = "error" | "warning";
export type TimePickerVariant = "outlined" | "filled" | "borderless" | "underlined";

export type TimeValue = {
  hour: number;
  minute: number;
  second: number;
};

export type TimeColumn = "hour" | "minute" | "second" | "meridiem";

export type TimePickerChangeDetail = {
  timeString: string;
  value: string;
};

export type TimePickerOpenChangeDetail = {
  open: boolean;
};

export type TimePickerElements = {
  clearButton: HTMLButtonElement;
  fieldElement: HTMLDivElement;
  inputElement: HTMLInputElement;
  meridiemColumn: HTMLDivElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  suffixElement: HTMLSpanElement;
  timeColumnsElement: HTMLDivElement;
};
