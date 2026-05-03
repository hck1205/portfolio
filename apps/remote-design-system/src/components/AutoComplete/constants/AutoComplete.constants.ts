export const AUTO_COMPLETE_ELEMENT_NAME = "ds-auto-complete";

export const AUTO_COMPLETE_OPTION_ELEMENT_NAME = "ds-auto-complete-option";

export const AUTO_COMPLETE_CHANGE_EVENT = "ds-auto-complete-change";

export const AUTO_COMPLETE_SEARCH_EVENT = "ds-auto-complete-search";

export const AUTO_COMPLETE_SELECT_EVENT = "ds-auto-complete-select";

export const AUTO_COMPLETE_CLEAR_EVENT = "ds-auto-complete-clear";

export const AUTO_COMPLETE_OPEN_CHANGE_EVENT = "ds-auto-complete-open-change";

export const AUTO_COMPLETE_OPTION_CHANGE_EVENT = "ds-auto-complete-option-change";

export const AUTO_COMPLETE_OBSERVED_ATTRIBUTES = [
  "allow-clear",
  "backfill",
  "default-active-first-option",
  "disabled",
  "filter-option",
  "input-mode",
  "not-found-content",
  "open",
  "options",
  "placeholder",
  "size",
  "status",
  "value",
  "variant"
] as const;

export const AUTO_COMPLETE_OPTION_OBSERVED_ATTRIBUTES = ["disabled", "label", "value"] as const;
