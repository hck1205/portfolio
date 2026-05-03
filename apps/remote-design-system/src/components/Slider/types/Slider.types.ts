export type SliderValue = number | [number, number];

export type SliderMark = {
  label: string;
  value: number;
};

export type SliderTooltipMode = "auto" | "open" | "closed";

export type SliderChangeDetail = {
  value: SliderValue;
};

export type SliderElements = {
  lowerThumb: HTMLButtonElement;
  markList: HTMLDivElement;
  rail: HTMLDivElement;
  root: HTMLDivElement;
  track: HTMLDivElement;
  upperThumb: HTMLButtonElement;
};

export type SliderSyncOptions = {
  disabled: boolean;
  dots: boolean;
  included: boolean;
  marks: SliderMark[];
  max: number;
  min: number;
  range: boolean;
  reverse: boolean;
  tooltip: SliderTooltipMode;
  value: [number, number];
  vertical: boolean;
};
