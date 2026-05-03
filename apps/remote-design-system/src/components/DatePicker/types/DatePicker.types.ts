export type DatePickerSize = "large" | "middle" | "small";
export type DatePickerStatus = "error" | "warning";
export type DatePickerVariant = "borderless" | "filled" | "outlined" | "underlined";
export type DatePickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type DatePickerPicker = "date" | "month" | "year";

export type DatePickerChangeDetail = {
  value: string;
  dateString: string;
};

export type DatePickerOpenChangeDetail = {
  open: boolean;
};

export type DatePickerPanelChangeDetail = {
  picker: DatePickerPicker;
  panelValue: string;
};

export type DatePickerCell = {
  disabled: boolean;
  key: string;
  label: string;
  outside: boolean;
  selected: boolean;
  today: boolean;
  value: string;
};
