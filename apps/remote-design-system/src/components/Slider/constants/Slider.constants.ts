export const SLIDER_ELEMENT_NAME = "ds-slider";

export const SLIDER_CHANGE_EVENT = "ds-slider-change";

export const SLIDER_CHANGE_COMPLETE_EVENT = "ds-slider-change-complete";

export const SLIDER_OBSERVED_ATTRIBUTES = [
  "default-value",
  "disabled",
  "dots",
  "included",
  "marks",
  "max",
  "min",
  "range",
  "reverse",
  "step",
  "tooltip",
  "value",
  "vertical"
] as const;

export const DEFAULT_SLIDER_MIN = 0;
export const DEFAULT_SLIDER_MAX = 100;
export const DEFAULT_SLIDER_STEP = 1;
