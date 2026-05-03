import type { UploadFileItem, UploadListType } from "../types/Upload.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getNumberAttribute(element: HTMLElement, name: string) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
}

export function getUploadListType(element: HTMLElement): UploadListType {
  const value = element.getAttribute("list-type");

  if (value === "picture" || value === "picture-card" || value === "picture-circle") {
    return value;
  }

  return "text";
}

export function fileToUploadItem(file: File): UploadFileItem {
  return {
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    status: "done",
    type: file.type,
    uid: `${file.name}-${file.lastModified}-${file.size}`
  };
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
