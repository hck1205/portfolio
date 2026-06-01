import type { AnnotationSaveEntry } from "./AnnotationPanel.types";

const savedAtLocalFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  year: "numeric"
});

export function formatAnnotationSavedAt(save: AnnotationSaveEntry) {
  const date = new Date(save.createdAtIso || save.createdAt);

  if (Number.isNaN(date.getTime())) {
    return save.createdAt;
  }

  return savedAtLocalFormatter.format(date);
}

export function formatAnnotationSaveIndex(index: number) {
  return String(index).padStart(2, "0");
}
