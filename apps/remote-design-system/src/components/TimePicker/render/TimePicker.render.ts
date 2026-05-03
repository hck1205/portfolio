import {
  Clock3,
  Eraser,
  createElement as createLucideElement
} from "lucide";

import {
  createTimeOptions,
  getCurrentMeridiem,
  padTimePart
} from "../dom/TimePicker.dom";
import type { TimeColumn, TimePickerElements, TimeValue } from "../types/TimePicker.types";

type TimePickerRenderHandlers = {
  onClear: (event: Event) => void;
  onInputChange: (event: Event) => void;
  onInputKeyDown: (event: KeyboardEvent) => void;
  onOptionClick: (column: TimeColumn, value: number | "am" | "pm") => void;
  onNowClick: () => void;
  onTriggerClick: () => void;
};

type TimePickerSyncOptions = {
  allowClear: boolean;
  disabled: boolean;
  displayValue: string;
  hourStep: number;
  inputReadOnly: boolean;
  minuteStep: number;
  open: boolean;
  placeholder: string;
  secondStep: number;
  showNow: boolean;
  use12Hours: boolean;
  value: TimeValue;
};

export function createTimePickerElements(handlers: TimePickerRenderHandlers): TimePickerElements {
  const rootElement = document.createElement("div");
  const fieldElement = document.createElement("div");
  const inputElement = document.createElement("input");
  const clearButton = document.createElement("button");
  const suffixElement = document.createElement("span");
  const popupElement = document.createElement("div");
  const timeColumnsElement = document.createElement("div");
  const meridiemColumn = document.createElement("div");

  rootElement.className = "ds-time-picker";
  fieldElement.className = "ds-time-picker__field";
  inputElement.className = "ds-time-picker__input";
  inputElement.type = "text";
  clearButton.className = "ds-time-picker__clear";
  clearButton.type = "button";
  clearButton.setAttribute("aria-label", "Clear time");
  clearButton.append(createIcon(Eraser));
  suffixElement.className = "ds-time-picker__suffix";
  suffixElement.setAttribute("aria-hidden", "true");
  suffixElement.append(createIcon(Clock3));
  popupElement.className = "ds-time-picker__popup";
  popupElement.setAttribute("role", "dialog");
  timeColumnsElement.className = "ds-time-picker__columns";
  meridiemColumn.className = "ds-time-picker__column";
  meridiemColumn.dataset.column = "meridiem";

  fieldElement.addEventListener("click", handlers.onTriggerClick);
  inputElement.addEventListener("change", handlers.onInputChange);
  inputElement.addEventListener("keydown", handlers.onInputKeyDown);
  clearButton.addEventListener("click", handlers.onClear);
  popupElement.append(timeColumnsElement);
  rootElement.append(fieldElement, popupElement);
  fieldElement.append(inputElement, clearButton, suffixElement);

  return {
    clearButton,
    fieldElement,
    inputElement,
    meridiemColumn,
    popupElement,
    rootElement,
    suffixElement,
    timeColumnsElement
  };
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 14,
    width: 14,
    "stroke-width": 2
  });
}

export function syncTimePickerElements(elements: TimePickerElements, options: TimePickerSyncOptions, handlers: TimePickerRenderHandlers) {
  elements.popupElement.querySelector(".ds-time-picker__footer")?.remove();
  elements.inputElement.disabled = options.disabled;
  elements.inputElement.readOnly = options.inputReadOnly;
  elements.inputElement.placeholder = options.placeholder;
  elements.inputElement.value = options.displayValue;
  elements.clearButton.hidden = !options.allowClear || !options.displayValue || options.disabled;
  elements.popupElement.hidden = !options.open;
  elements.popupElement.setAttribute("aria-hidden", String(!options.open));
  elements.timeColumnsElement.replaceChildren(
    createColumn("hour", createTimeOptions(options.use12Hours ? 1 : options.hourStep, options.use12Hours ? 12 : 23), options.value, options, handlers),
    createColumn("minute", createTimeOptions(options.minuteStep, 59), options.value, options, handlers),
    createColumn("second", createTimeOptions(options.secondStep, 59), options.value, options, handlers)
  );

  if (options.use12Hours) {
    elements.timeColumnsElement.append(createMeridiemColumn(options.value, handlers));
  }

  if (options.showNow) {
    const footer = document.createElement("div");
    const nowButton = document.createElement("button");

    footer.className = "ds-time-picker__footer";
    nowButton.className = "ds-time-picker__now";
    nowButton.type = "button";
    nowButton.textContent = "Now";
    nowButton.addEventListener("click", handlers.onNowClick);
    footer.append(nowButton);
    elements.popupElement.append(footer);
  }
}

function createColumn(
  column: Exclude<TimeColumn, "meridiem">,
  options: number[],
  selectedValue: TimeValue,
  syncOptions: TimePickerSyncOptions,
  handlers: TimePickerRenderHandlers
) {
  const columnElement = document.createElement("div");
  const selected = column === "hour" ? selectedValue.hour : selectedValue[column];

  columnElement.className = "ds-time-picker__column";
  columnElement.dataset.column = column;
  columnElement.append(
    ...options.map((value) => {
      const option = document.createElement("button");
      const displayValue = column === "hour" && syncOptions.use12Hours ? value : padTimePart(value);
      const normalizedValue = column === "hour" && syncOptions.use12Hours ? normalizeHour12(value, selectedValue) : value;

      option.className = "ds-time-picker__option";
      option.type = "button";
      option.textContent = String(displayValue);
      option.setAttribute("aria-selected", String(normalizedValue === selected));
      option.addEventListener("click", () => handlers.onOptionClick(column, normalizedValue));
      return option;
    })
  );

  return columnElement;
}

function createMeridiemColumn(value: TimeValue, handlers: TimePickerRenderHandlers) {
  const columnElement = document.createElement("div");
  const selected = getCurrentMeridiem(value);

  columnElement.className = "ds-time-picker__column";
  columnElement.dataset.column = "meridiem";
  columnElement.append(
    ...(["am", "pm"] as const).map((meridiem) => {
      const option = document.createElement("button");

      option.className = "ds-time-picker__option";
      option.type = "button";
      option.textContent = meridiem.toUpperCase();
      option.setAttribute("aria-selected", String(meridiem === selected));
      option.addEventListener("click", () => handlers.onOptionClick("meridiem", meridiem));
      return option;
    })
  );

  return columnElement;
}

function normalizeHour12(hour: number, value: TimeValue) {
  const meridiem = getCurrentMeridiem(value);

  if (meridiem === "am") {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
}
