import type { PaginationItem } from "../types/Pagination.types";

type CreatePaginationItemsOptions = {
  current: number;
  pageCount: number;
  showLessItems: boolean;
};

export function createPaginationItems({ current, pageCount, showLessItems }: CreatePaginationItemsOptions) {
  const pageItems = createPageItems({ current, pageCount, showLessItems });
  const items: PaginationItem[] = [
    {
      disabled: current <= 1,
      label: "Previous page",
      page: Math.max(1, current - 1),
      selected: false,
      type: "prev"
    },
    ...pageItems,
    {
      disabled: current >= pageCount,
      label: "Next page",
      page: Math.min(pageCount, current + 1),
      selected: false,
      type: "next"
    }
  ];

  return items;
}

function createPageItems({ current, pageCount, showLessItems }: CreatePaginationItemsOptions): PaginationItem[] {
  const siblingCount = showLessItems ? 1 : 2;
  const boundaryCount = 1;

  if (pageCount <= 5 + siblingCount * 2) {
    return createContiguousPageItems(1, pageCount, current);
  }

  const startPages = createContiguousPageItems(1, boundaryCount, current);
  const endPages = createContiguousPageItems(pageCount - boundaryCount + 1, pageCount, current);
  const siblingStart = Math.max(
    Math.min(current - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingEnd = Math.min(
    Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2),
    pageCount - boundaryCount - 1
  );
  const items: PaginationItem[] = [...startPages];

  if (siblingStart > boundaryCount + 2) {
    items.push(createJumpItem("jump-prev", Math.max(1, current - (siblingCount * 2 + 1))));
  } else {
    items.push(...createContiguousPageItems(boundaryCount + 1, siblingStart - 1, current));
  }

  items.push(...createContiguousPageItems(siblingStart, siblingEnd, current));

  if (siblingEnd < pageCount - boundaryCount - 1) {
    items.push(createJumpItem("jump-next", Math.min(pageCount, current + (siblingCount * 2 + 1))));
  } else {
    items.push(...createContiguousPageItems(siblingEnd + 1, pageCount - boundaryCount, current));
  }

  items.push(...endPages);

  return items;
}

function createContiguousPageItems(start: number, end: number, current: number) {
  const items: PaginationItem[] = [];

  for (let page = start; page <= end; page += 1) {
    items.push(createPageItem(page, current));
  }

  return items;
}

function createPageItem(page: number, current: number): PaginationItem {
  return {
    disabled: false,
    label: `Page ${page}`,
    page,
    selected: page === current,
    type: "page"
  };
}

function createJumpItem(type: "jump-prev" | "jump-next", page: number): PaginationItem {
  return {
    disabled: false,
    label: type === "jump-prev" ? "Jump backward 5 pages" : "Jump forward 5 pages",
    page,
    selected: false,
    type
  };
}
