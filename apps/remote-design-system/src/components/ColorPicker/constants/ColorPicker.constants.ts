export const COLOR_PICKER_ELEMENT_NAME = "ds-color-picker";

export const COLOR_PICKER_CHANGE_EVENT = "ds-color-picker-change";
export const COLOR_PICKER_CHANGE_COMPLETE_EVENT = "ds-color-picker-change-complete";
export const COLOR_PICKER_CLEAR_EVENT = "ds-color-picker-clear";
export const COLOR_PICKER_FORMAT_CHANGE_EVENT = "ds-color-picker-format-change";
export const COLOR_PICKER_OPEN_CHANGE_EVENT = "ds-color-picker-open-change";

export const COLOR_PICKER_DEFAULT_COLOR = "#1677ff";
export const COLOR_PICKER_HOVER_CLOSE_DELAY = 120;

export const COLOR_PICKER_PICKER_PLACEMENTS = [
  "bottom-left",
  "bottom-right",
  "top-left",
  "top-right",
  "left-bottom",
  "left-top",
  "right-bottom",
  "right-top",
  "left",
  "right",
  "bottom",
  "top"
] as const;

export const COLOR_PICKER_LEGACY_PICKER_PLACEMENT_BY_VALUE = {
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right",
  leftBottom: "left-bottom",
  leftTop: "left-top",
  rightBottom: "right-bottom",
  rightTop: "right-top",
  topLeft: "top-left",
  topRight: "top-right"
} as const;

export const COLOR_PICKER_OBSERVED_ATTRIBUTES = [
  "allow-clear",
  "aria-label",
  "default-format",
  "default-value",
  "disabled",
  "disabled-alpha",
  "disabled-format",
  "format",
  "open",
  "picker-placement",
  "placement",
  "presets",
  "show-text",
  "size",
  "trigger",
  "value"
];
