export const SELECT_ELEMENT_NAME = "ds-select";
export const SELECT_OPTION_ELEMENT_NAME = "ds-select-option";

export const SELECT_CHANGE_EVENT = "ds-select-change";
export const SELECT_CLEAR_EVENT = "ds-select-clear";
export const SELECT_OPEN_CHANGE_EVENT = "ds-select-open-change";
export const SELECT_OPTION_CHANGE_EVENT = "ds-select-option-change";
export const SELECT_SELECT_EVENT = "ds-select-select";

export const SELECT_OBSERVED_ATTRIBUTES = [
  "allow-clear",
  "default-active-first-option",
  "disabled",
  "filter-option",
  "max-count",
  "mode",
  "not-found-content",
  "open",
  "options",
  "placeholder",
  "placement",
  "show-search",
  "size",
  "status",
  "value",
  "variant"
] as const;

export const SELECT_OPTION_OBSERVED_ATTRIBUTES = ["disabled", "label", "title", "value"] as const;
