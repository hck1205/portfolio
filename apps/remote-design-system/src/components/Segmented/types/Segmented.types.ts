export type SegmentedSize = "large" | "middle" | "small";

export type SegmentedOrientation = "horizontal" | "vertical";

export type SegmentedShape = "default" | "round";

export type SegmentedOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type SegmentedChangeDetail = {
  value: string;
};
