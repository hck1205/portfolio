import type { ResultStatus } from "../types/Result.types";

const RESULT_STATUSES = new Set<ResultStatus>(["403", "404", "500", "error", "info", "success", "warning"]);

export function getResultStatus(element: HTMLElement): ResultStatus {
  const status = element.getAttribute("status");

  return status && RESULT_STATUSES.has(status as ResultStatus) ? (status as ResultStatus) : "info";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
