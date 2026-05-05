import dayjs, { type Dayjs } from "dayjs";

import type {
  CalendarDateNotice,
  CalendarMode,
  CalendarMonthNotice,
  CalendarNotice,
  CalendarNoticeType
} from "../types/Calendar.types";

const CALENDAR_NOTICE_TYPES = new Set<CalendarNoticeType>(["success", "warning", "error", "info"]);

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

export function parseCalendarNotices(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    return normalizeCalendarNotices(JSON.parse(value));
  } catch {
    return [];
  }
}

export function normalizeCalendarNotices(value: unknown): CalendarNotice[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const notice = normalizeCalendarNotice(item);

    return notice ? [notice] : [];
  });
}

export function indexCalendarNotices(notices: CalendarNotice[]) {
  const dateNotices = new Map<string, CalendarDateNotice[]>();
  const monthNotices = new Map<string, CalendarMonthNotice>();

  for (const notice of notices) {
    if ("date" in notice) {
      const noticesForDate = dateNotices.get(notice.date) ?? [];

      noticesForDate.push(notice);
      dateNotices.set(notice.date, noticesForDate);
      continue;
    }

    monthNotices.set(notice.month, notice);
  }

  return { dateNotices, monthNotices };
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

function normalizeCalendarNotice(value: unknown): CalendarNotice | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const item = value as Record<string, unknown>;

  if (typeof item.date === "string" && typeof item.content === "string") {
    return {
      content: item.content,
      date: item.date,
      type: isCalendarNoticeType(item.type) ? item.type : "info"
    };
  }

  if (typeof item.month === "string" && typeof item.count === "number" && Number.isFinite(item.count)) {
    return {
      count: item.count,
      label: typeof item.label === "string" ? item.label : undefined,
      month: item.month
    };
  }

  return undefined;
}

function isCalendarNoticeType(value: unknown): value is CalendarNoticeType {
  return typeof value === "string" && CALENDAR_NOTICE_TYPES.has(value as CalendarNoticeType);
}
