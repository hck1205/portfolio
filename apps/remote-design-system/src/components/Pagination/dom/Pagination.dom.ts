import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from "../constants/Pagination.constants";
import type { PaginationAlign, PaginationSize } from "../types/Pagination.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  if (!element.hasAttribute(name)) {
    return defaultValue;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function getPaginationAlign(element: HTMLElement): PaginationAlign {
  const value = element.getAttribute("align");

  if (value === "center" || value === "end") {
    return value;
  }

  return "start";
}

export function getPaginationSize(element: HTMLElement): PaginationSize {
  const value = element.getAttribute("size");

  if (value === "small" || value === "large") {
    return value;
  }

  return "middle";
}

export function getPositiveIntegerAttribute(element: HTMLElement, name: string, fallback: number) {
  const value = Number(element.getAttribute(name));

  if (Number.isInteger(value) && value > 0) {
    return value;
  }

  return fallback;
}

export function getNonNegativeIntegerAttribute(element: HTMLElement, name: string, fallback: number) {
  const value = Number(element.getAttribute(name));

  if (Number.isInteger(value) && value >= 0) {
    return value;
  }

  return fallback;
}

export function getCurrentPage(element: HTMLElement, pageCount: number) {
  const fallback = getPositiveIntegerAttribute(element, "default-current", DEFAULT_CURRENT);
  const current = getPositiveIntegerAttribute(element, "current", fallback);

  return clampPage(current, pageCount);
}

export function getPageSize(element: HTMLElement) {
  const fallback = getPositiveIntegerAttribute(element, "default-page-size", DEFAULT_PAGE_SIZE);

  return getPositiveIntegerAttribute(element, "page-size", fallback);
}

export function getPageSizeOptions(element: HTMLElement, pageSize: number) {
  const parsedOptions = (element.getAttribute("page-size-options") ?? "")
    .split(",")
    .map((option) => Number(option.trim()))
    .filter((option) => Number.isInteger(option) && option > 0);
  const options = parsedOptions.length > 0 ? parsedOptions : DEFAULT_PAGE_SIZE_OPTIONS;

  return Array.from(new Set([...options, pageSize])).sort((a, b) => a - b);
}

export function getPageCount(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function clampPage(page: number, pageCount: number) {
  return Math.min(Math.max(page, 1), pageCount);
}
