export const ANCHOR_ELEMENT_NAME = "ds-anchor";
export const ANCHOR_LINK_ELEMENT_NAME = "ds-anchor-link";

export const ANCHOR_CHANGE_EVENT = "ds-anchor-change";
export const ANCHOR_CLICK_EVENT = "ds-anchor-click";
export const ANCHOR_SCROLL_SETTLE_DELAY = 80;

export const ANCHOR_OBSERVED_ATTRIBUTES = [
  "active-href",
  "direction",
  "offset",
  "replace",
  "target-offset"
] as const;

export const ANCHOR_LINK_OBSERVED_ATTRIBUTES = ["disabled", "href", "target", "title"] as const;
