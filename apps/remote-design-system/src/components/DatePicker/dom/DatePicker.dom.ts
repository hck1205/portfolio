import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import type {
  DatePickerCell,
  DatePickerPicker,
  DatePickerPlacement,
  DatePickerSize,
  DatePickerStatus,
  DatePickerVariant
} from "../types/DatePicker.types";

dayjs.extend(customParseFormat);

const DEFAULT_FORMATS: Record<DatePickerPicker, string> = {
  date: "YYYY-MM-DD",
  month: "YYYY-MM",
  year: "YYYY"
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue = false) {
  if (!element.hasAttribute(name)) {
    return defaultValue;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true" || value === name;
}

export function getDatePickerSize(element: HTMLElement): DatePickerSize {
  const value = element.getAttribute("size");

  return value === "large" || value === "small" ? value : "middle";
}

export function getDatePickerStatus(element: HTMLElement): DatePickerStatus | undefined {
  const value = element.getAttribute("status");

  return value === "error" || value === "warning" ? value : undefined;
}

export function getDatePickerVariant(element: HTMLElement): DatePickerVariant {
  const value = element.getAttribute("variant");

  if (value === "borderless" || value === "filled" || value === "underlined") {
    return value;
  }

  return "outlined";
}

export function getDatePickerPlacement(element: HTMLElement): DatePickerPlacement {
  const value = element.getAttribute("placement");

  if (value === "bottomRight" || value === "topLeft" || value === "topRight") {
    return value;
  }

  return "bottomLeft";
}

export function getDatePickerPicker(element: HTMLElement): DatePickerPicker {
  const value = element.getAttribute("picker");

  if (value === "month" || value === "year") {
    return value;
  }

  return "date";
}

export function getDatePickerFormat(element: HTMLElement, picker: DatePickerPicker) {
  return element.getAttribute("format") || DEFAULT_FORMATS[picker];
}

export function parsePickerDate(value: string, format: string, picker: DatePickerPicker) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  const parsed = dayjs(normalizedValue, format, true);

  if (parsed.isValid()) {
    return parsed.startOf(picker === "date" ? "day" : picker);
  }

  const fallback = dayjs(normalizedValue);

  return fallback.isValid() ? fallback.startOf(picker === "date" ? "day" : picker) : null;
}

export function formatPickerDate(date: Dayjs | null, format: string) {
  return date?.isValid() ? date.format(format) : "";
}

export function getPanelTitle(panelDate: Dayjs, picker: DatePickerPicker) {
  if (picker === "year") {
    const decadeStart = Math.floor(panelDate.year() / 10) * 10;

    return `${decadeStart}-${decadeStart + 9}`;
  }

  if (picker === "month") {
    return String(panelDate.year());
  }

  return panelDate.format("MMMM YYYY");
}

export function getAdjacentPanelDate(panelDate: Dayjs, picker: DatePickerPicker, direction: -1 | 1) {
  if (picker === "year") {
    return panelDate.add(direction * 10, "year");
  }

  if (picker === "month") {
    return panelDate.add(direction, "year");
  }

  return panelDate.add(direction, "month");
}

export function createPickerCells({
  maxDate,
  minDate,
  panelDate,
  picker,
  selectedDate
}: {
  maxDate: Dayjs | null;
  minDate: Dayjs | null;
  panelDate: Dayjs;
  picker: DatePickerPicker;
  selectedDate: Dayjs | null;
}) {
  if (picker === "year") {
    return createYearCells({ maxDate, minDate, panelDate, selectedDate });
  }

  if (picker === "month") {
    return createMonthCells({ maxDate, minDate, panelDate, selectedDate });
  }

  return createDateCells({ maxDate, minDate, panelDate, selectedDate });
}

export function isPickerDateDisabled(
  date: Dayjs,
  minDate: Dayjs | null,
  maxDate: Dayjs | null,
  picker: DatePickerPicker
) {
  if (minDate && date.endOf(picker).isBefore(minDate.startOf(picker))) {
    return true;
  }

  if (maxDate && date.startOf(picker).isAfter(maxDate.endOf(picker))) {
    return true;
  }

  return false;
}

function createDateCells({
  maxDate,
  minDate,
  panelDate,
  selectedDate
}: {
  maxDate: Dayjs | null;
  minDate: Dayjs | null;
  panelDate: Dayjs;
  selectedDate: Dayjs | null;
}) {
  const today = dayjs().startOf("day");
  const monthStart = panelDate.startOf("month");
  const cursorStart = monthStart.startOf("week");
  const cells: DatePickerCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = cursorStart.add(index, "day");
    const value = date.format(DEFAULT_FORMATS.date);

    cells.push({
      disabled: isPickerDateDisabled(date, minDate, maxDate, "date"),
      key: value,
      label: String(date.date()),
      outside: date.month() !== panelDate.month(),
      selected: Boolean(selectedDate?.isSame(date, "day")),
      today: today.isSame(date, "day"),
      value
    });
  }

  return cells;
}

function createMonthCells({
  maxDate,
  minDate,
  panelDate,
  selectedDate
}: {
  maxDate: Dayjs | null;
  minDate: Dayjs | null;
  panelDate: Dayjs;
  selectedDate: Dayjs | null;
}) {
  return MONTH_LABELS.map((label, month) => {
    const date = panelDate.month(month).startOf("month");
    const value = date.format(DEFAULT_FORMATS.month);

    return {
      disabled: isPickerDateDisabled(date, minDate, maxDate, "month"),
      key: value,
      label,
      outside: false,
      selected: Boolean(selectedDate?.isSame(date, "month")),
      today: dayjs().isSame(date, "month"),
      value
    };
  });
}

function createYearCells({
  maxDate,
  minDate,
  panelDate,
  selectedDate
}: {
  maxDate: Dayjs | null;
  minDate: Dayjs | null;
  panelDate: Dayjs;
  selectedDate: Dayjs | null;
}) {
  const decadeStart = Math.floor(panelDate.year() / 10) * 10;

  return Array.from({ length: 12 }, (_, index) => {
    const year = decadeStart - 1 + index;
    const date = panelDate.year(year).startOf("year");
    const value = date.format(DEFAULT_FORMATS.year);

    return {
      disabled: isPickerDateDisabled(date, minDate, maxDate, "year"),
      key: value,
      label: String(year),
      outside: year < decadeStart || year > decadeStart + 9,
      selected: Boolean(selectedDate?.isSame(date, "year")),
      today: dayjs().isSame(date, "year"),
      value
    };
  });
}
