export const RADIO_ELEMENT_NAME = "ds-radio";
export const RADIO_GROUP_ELEMENT_NAME = "ds-radio-group";

export const RADIO_CHANGE_EVENT = "ds-radio-change";
export const RADIO_GROUP_CHANGE_EVENT = "ds-radio-group-change";

export const RADIO_OBSERVED_ATTRIBUTES = [
  "checked",
  "default-checked",
  "disabled",
  "name",
  "value"
] as const;

export const RADIO_GROUP_OBSERVED_ATTRIBUTES = [
  "block",
  "button-style",
  "default-value",
  "disabled",
  "name",
  "option-type",
  "options",
  "orientation",
  "size",
  "value",
  "vertical"
] as const;
