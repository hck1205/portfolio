import dayjs, { type Dayjs } from "dayjs";

import type { CalendarMode } from "../types/Calendar.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getCalendarMode(element: HTMLElement): CalendarMode {
  return element.getAttribute("mode") === "year" ? "year" : "month";
}

export function parseCalendarDate(value: string | null | undefined, fallback = dayjs()) {
  const date = value ? dayjs(value) : fallback;

  return date.isValid() ? date : fallback;
}

export function formatCalendarValue(value: Dayjs) {
  return value.format("YYYY-MM-DD");
}

export function getMonthCells(viewDate: Dayjs) {
  const start = viewDate.startOf("month").startOf("week");

  return Array.from({ length: 42 }, (_, index) => start.add(index, "day"));
}

export function getYearCells(viewDate: Dayjs) {
  const start = viewDate.startOf("year");

  return Array.from({ length: 12 }, (_, index) => start.add(index, "month"));
}

export function getWeekNumber(value: Dayjs) {
  return Math.ceil(value.dayOfYear() / 7);
}
