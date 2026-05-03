export type SelectSize = "large" | "middle" | "small";
export type SelectStatus = "error" | "warning";
export type SelectVariant = "borderless" | "filled" | "outlined" | "underlined";
export type SelectPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type SelectMode = "multiple" | "single" | "tags";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  title?: string;
  value: string;
};

export type SelectChangeDetail = {
  option?: SelectOption;
  options: SelectOption[];
  value: string | string[];
};

export type SelectSelectDetail = {
  option: SelectOption;
  value: string;
};

export type SelectClearDetail = {
  previousValue: string | string[];
};

export type SelectOpenChangeDetail = {
  open: boolean;
  source: "clear" | "keyboard" | "option" | "outside" | "trigger";
};
