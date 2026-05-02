export const STEPS_ELEMENT_NAME = "ds-steps";
export const STEP_ELEMENT_NAME = "ds-step";

export const STEPS_CHANGE_EVENT = "ds-steps-change";

export const STEPS_OBSERVED_ATTRIBUTES = [
  "clickable",
  "current",
  "initial",
  "orientation",
  "percent",
  "progress-dot",
  "size",
  "status",
  "title-placement",
  "type",
  "variant"
] as const;

export const STEP_OBSERVED_ATTRIBUTES = [
  "description",
  "disabled",
  "icon",
  "item-key",
  "status",
  "sub-title",
  "title"
] as const;
