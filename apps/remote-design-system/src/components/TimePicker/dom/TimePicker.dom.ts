import type {
  TimeColumn,
  TimePickerPlacement,
  TimePickerSize,
  TimePickerStatus,
  TimePickerVariant,
  TimeValue
} from "../types/TimePicker.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getTimePickerSize(element: HTMLElement): TimePickerSize {
  const value = element.getAttribute("size");

  return value === "small" || value === "large" ? value : "medium";
}

export function getTimePickerPlacement(element: HTMLElement): TimePickerPlacement {
  const value = element.getAttribute("placement");

  if (value === "bottomRight" || value === "topLeft" || value === "topRight") {
    return value;
  }

  return "bottomLeft";
}

export function getTimePickerStatus(element: HTMLElement): TimePickerStatus | undefined {
  const value = element.getAttribute("status");

  return value === "error" || value === "warning" ? value : undefined;
}

export function getTimePickerVariant(element: HTMLElement): TimePickerVariant {
  const value = element.getAttribute("variant");

  if (value === "filled" || value === "borderless" || value === "underlined") {
    return value;
  }

  return "outlined";
}

export function getStepAttribute(element: HTMLElement, name: string) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) && value > 0 ? Math.min(60, Math.floor(value)) : 1;
}

export function getTimePickerFormat(element: HTMLElement) {
  const format = element.getAttribute("format");

  if (format) {
    return format;
  }

  return normalizeBooleanAttribute(element, "use12-hours", false) ? "h:mm:ss a" : "HH:mm:ss";
}

export function parseTimeValue(value: string): TimeValue | undefined {
  const trimmedValue = value.trim();
  const match = trimmedValue.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*(am|pm)?$/i);

  if (!match) {
    return undefined;
  }

  const meridiem = match[4]?.toLowerCase();
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const second = Number(match[3] ?? 0);

  if (meridiem === "pm" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "am" && hour === 12) {
    hour = 0;
  }

  if (hour > 23 || minute > 59 || second > 59) {
    return undefined;
  }

  return { hour, minute, second };
}

export function formatTimeValue(value: TimeValue, format: string) {
  const use12Hours = format.includes("h") || format.includes("a");
  const hour12 = value.hour % 12 || 12;
  const meridiem = value.hour >= 12 ? "pm" : "am";

  return format
    .replace("HH", padTimePart(value.hour))
    .replace("H", String(value.hour))
    .replace("hh", padTimePart(hour12))
    .replace("h", String(hour12))
    .replace("mm", padTimePart(value.minute))
    .replace("m", String(value.minute))
    .replace("ss", padTimePart(value.second))
    .replace("s", String(value.second))
    .replace("a", use12Hours ? meridiem : "");
}

export function createTimeOptions(step: number, max: number) {
  const options: number[] = [];

  for (let value = 0; value <= max; value += step) {
    options.push(value);
  }

  return options;
}

export function setTimePart(value: TimeValue, column: TimeColumn, nextValue: number | "am" | "pm") {
  if (column === "hour" && typeof nextValue === "number") {
    return { ...value, hour: nextValue };
  }

  if (column === "minute" && typeof nextValue === "number") {
    return { ...value, minute: nextValue };
  }

  if (column === "second" && typeof nextValue === "number") {
    return { ...value, second: nextValue };
  }

  if (column === "meridiem" && nextValue === "am") {
    return { ...value, hour: value.hour >= 12 ? value.hour - 12 : value.hour };
  }

  if (column === "meridiem" && nextValue === "pm") {
    return { ...value, hour: value.hour < 12 ? value.hour + 12 : value.hour };
  }

  return value;
}

export function getCurrentMeridiem(value: TimeValue) {
  return value.hour >= 12 ? "pm" : "am";
}

export function padTimePart(value: number) {
  return String(value).padStart(2, "0");
}
