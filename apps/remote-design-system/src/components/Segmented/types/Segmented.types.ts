export type SegmentedSize = "large" | "middle" | "small";

export type SegmentedOrientation = "horizontal" | "vertical";

export type SegmentedShape = "default" | "round";

export type SegmentedIconName = "calendar" | "chart" | "table";

export type SegmentedOption = {
  disabled?: boolean;
  icon?: SegmentedIconName;
  label: string;
  value: string;
};

export type SegmentedChangeDetail = {
  value: string;
};
