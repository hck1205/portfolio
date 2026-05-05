import type { ProgressStatus } from "../types/Progress.types";

const STATUS_ICON_MARKUP: Partial<Record<ProgressStatus, string>> = {
  active:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2a6 6 0 0 1 5.7 4.1l-1.5.5A4.4 4.4 0 1 0 8 12.4V14A6 6 0 0 1 8 2Z" fill="currentColor"/></svg>',
  exception:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m8 6.9 3-3L12.1 5l-3 3 3 3-1.1 1.1-3-3-3 3L3.9 11l3-3-3-3L5 3.9l3 3Z" fill="currentColor"/></svg>',
  success:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.4 11.2 3.2 8l1.1-1.1 2.1 2.1 5.3-5.3 1.1 1.1-6.4 6.4Z" fill="currentColor"/></svg>'
};

export function getProgressStatusIconMarkup(status: ProgressStatus) {
  return STATUS_ICON_MARKUP[status] ?? "";
}
