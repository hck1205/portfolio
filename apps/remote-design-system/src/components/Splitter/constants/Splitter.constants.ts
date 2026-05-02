export const SPLITTER_ELEMENT_NAME = "ds-splitter";
export const SPLITTER_PANEL_ELEMENT_NAME = "ds-splitter-panel";

export const SPLITTER_OBSERVED_ATTRIBUTES = ["lazy", "orientation", "vertical"] as const;

export const SPLITTER_PANEL_OBSERVED_ATTRIBUTES = [
  "default-size",
  "max",
  "min",
  "resizable",
  "size"
] as const;

export const SPLITTER_RESIZE_START_EVENT = "ds-splitter-resize-start";
export const SPLITTER_RESIZE_EVENT = "ds-splitter-resize";
export const SPLITTER_RESIZE_END_EVENT = "ds-splitter-resize-end";
export const SPLITTER_DRAGGER_DOUBLE_CLICK_EVENT = "ds-splitter-dragger-double-click";
