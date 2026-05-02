export const TABS_ELEMENT_NAME = "ds-tabs";
export const TAB_ELEMENT_NAME = "ds-tab";

export const TABS_CHANGE_EVENT = "ds-tabs-change";
export const TABS_EDIT_EVENT = "ds-tabs-edit";
export const TAB_CHANGE_EVENT = "ds-tab-change";

export const TABS_OBSERVED_ATTRIBUTES = [
  "active-key",
  "centered",
  "default-active-key",
  "editable",
  "hide-add",
  "size",
  "tab-placement",
  "type"
] as const;

export const TAB_OBSERVED_ATTRIBUTES = ["closable", "disabled", "icon", "item-key", "label"] as const;
