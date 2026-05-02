export type PaginationAlign = "start" | "center" | "end";

export type PaginationSize = "small" | "middle" | "large";

export type PaginationItemType = "page" | "prev" | "next" | "jump-prev" | "jump-next";

export type PaginationItem = {
  disabled: boolean;
  label: string;
  page: number;
  selected: boolean;
  type: PaginationItemType;
};

export type PaginationChangeDetail = {
  current: number;
  pageSize: number;
  total: number;
};

export type PaginationPageSizeChangeDetail = {
  current: number;
  pageSize: number;
  previousPageSize: number;
  total: number;
};
