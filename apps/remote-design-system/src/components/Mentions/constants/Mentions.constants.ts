export const MENTIONS_ELEMENT_NAME = "ds-mentions";

export const MENTION_OPTION_ELEMENT_NAME = "ds-mention-option";

export const MENTIONS_CHANGE_EVENT = "ds-mentions-change";

export const MENTIONS_SEARCH_EVENT = "ds-mentions-search";

export const MENTIONS_SELECT_EVENT = "ds-mentions-select";

export const MENTIONS_CLEAR_EVENT = "ds-mentions-clear";

export const MENTION_OPTION_CHANGE_EVENT = "ds-mention-option-change";

export const MENTIONS_OBSERVED_ATTRIBUTES = [
  "allow-clear",
  "autosize",
  "block",
  "default-value",
  "disabled",
  "filter-option",
  "max-rows",
  "name",
  "not-found-content",
  "placeholder",
  "placement",
  "prefix",
  "readonly",
  "required",
  "rows",
  "size",
  "split",
  "status",
  "value",
  "variant"
] as const;

export const MENTION_OPTION_OBSERVED_ATTRIBUTES = ["disabled", "label", "value"] as const;
