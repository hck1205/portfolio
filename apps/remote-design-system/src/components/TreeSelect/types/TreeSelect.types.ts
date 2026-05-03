export type TreeSelectPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type TreeSelectSize = "small" | "medium" | "large";
export type TreeSelectStatus = "error" | "warning";
export type TreeSelectVariant = "outlined" | "filled" | "borderless" | "underlined";

export type TreeSelectNode = {
  children?: TreeSelectNode[];
  disabled?: boolean;
  label: string;
  value: string;
};

export type TreeSelectChangeDetail = {
  labels: string[];
  value: string | string[];
};

export type TreeSelectOpenChangeDetail = {
  open: boolean;
};

export type TreeSelectSearchDetail = {
  value: string;
};
