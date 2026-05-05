export const CARD_ELEMENT_NAME = "ds-card";
export const CARD_GRID_ELEMENT_NAME = "ds-card-grid";
export const CARD_META_ELEMENT_NAME = "ds-card-meta";

export const CARD_OBSERVED_ATTRIBUTES = [
  "cover-src",
  "extra",
  "extra-href",
  "extra-rel",
  "extra-target",
  "hoverable",
  "loading",
  "size",
  "title",
  "type",
  "variant"
] as const;

export const CARD_GRID_OBSERVED_ATTRIBUTES = ["hoverable"] as const;
export const CARD_META_OBSERVED_ATTRIBUTES = ["avatar-src", "description", "title"] as const;
