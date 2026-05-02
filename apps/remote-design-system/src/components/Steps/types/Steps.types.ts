export type StepsOrientation = "horizontal" | "vertical";

export type StepsSize = "medium" | "small";

export type StepsStatus = "wait" | "process" | "finish" | "error";

export type StepsTitlePlacement = "horizontal" | "vertical";

export type StepsType = "default" | "dot" | "inline" | "navigation" | "panel";

export type StepsVariant = "filled" | "outlined";

export type StepItemData = {
  description: string;
  disabled: boolean;
  icon: string;
  index: number;
  key: string;
  status: StepsStatus;
  subTitle: string;
  title: string;
};

export type StepsChangeDetail = {
  current: number;
  key: string;
  previousCurrent: number;
};
