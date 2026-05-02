export type CascaderExpandTrigger = "click" | "hover";

export type CascaderPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

export type CascaderSize = "small" | "medium" | "large";

export type CascaderStatus = "error" | "warning";

export type CascaderVariant = "outlined" | "borderless" | "filled" | "underlined";

export type CascaderOption = {
  children?: CascaderOption[];
  disabled?: boolean;
  isLeaf?: boolean;
  label?: string;
  value: string;
};

export type CascaderPath = string[];

export type CascaderSelectedItem = {
  label: string;
  path: CascaderPath;
};

export type CascaderOpenChangeSource = "trigger" | "keyboard" | "option" | "clear" | "outside";

export type CascaderChangeDetail = {
  selectedOptions: CascaderOption[];
  value: CascaderPath;
  values: CascaderPath[];
};

export type CascaderClearDetail = {
  previousValues: CascaderPath[];
};

export type CascaderOpenChangeDetail = {
  open: boolean;
  source: CascaderOpenChangeSource;
};

export type CascaderSearchDetail = {
  value: string;
};

export type CascaderSearchMatch = {
  labels: string[];
  path: CascaderPath;
};
