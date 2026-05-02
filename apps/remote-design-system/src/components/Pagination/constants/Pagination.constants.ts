export const PAGINATION_ELEMENT_NAME = "ds-pagination";

export const PAGINATION_CHANGE_EVENT = "ds-pagination-change";
export const PAGINATION_PAGE_SIZE_CHANGE_EVENT = "ds-pagination-page-size-change";

export const PAGINATION_OBSERVED_ATTRIBUTES = [
  "align",
  "current",
  "default-current",
  "default-page-size",
  "disabled",
  "hide-on-single-page",
  "page-size",
  "page-size-options",
  "show-less-items",
  "show-quick-jumper",
  "show-size-changer",
  "simple",
  "size",
  "total"
] as const;

export const DEFAULT_CURRENT = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
