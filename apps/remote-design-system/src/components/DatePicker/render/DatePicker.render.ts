import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  createElement as createLucideElement
} from "lucide";

import { DATE_PICKER_STYLES } from "../DatePicker.styles";
import type { DatePickerCell, DatePickerPicker, DatePickerPlacement } from "../types/DatePicker.types";

export type DatePickerElements = {
  clearButtonElement: HTMLButtonElement;
  gridElement: HTMLDivElement;
  inputElement: HTMLInputElement;
  nextButtonElement: HTMLButtonElement;
  popupElement: HTMLDivElement;
  prevButtonElement: HTMLButtonElement;
  rootElement: HTMLDivElement;
  superNextButtonElement: HTMLButtonElement;
  superPrevButtonElement: HTMLButtonElement;
  suffixElement: HTMLSpanElement;
  titleElement: HTMLSpanElement;
  weekdaysElement: HTMLDivElement;
};

type CreateDatePickerElementsOptions = {
  onCellClick: (value: string) => void;
  onClear: (event: Event) => void;
  onInputChange: (event: Event) => void;
  onInputKeyDown: (event: KeyboardEvent) => void;
  onNext: () => void;
  onPrev: () => void;
  onSuperNext: () => void;
  onSuperPrev: () => void;
  onTriggerClick: () => void;
};

type SyncDatePickerElementsOptions = {
  allowClear: boolean;
  cells: DatePickerCell[];
  disabled: boolean;
  displayValue: string;
  elements: DatePickerElements;
  open: boolean;
  picker: DatePickerPicker;
  placeholder: string;
  placement: DatePickerPlacement;
  readOnly: boolean;
  title: string;
};

let datePickerStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getDatePickerStyleSheet() {
  if (!datePickerStyleSheet) {
    datePickerStyleSheet = new CSSStyleSheet();
    datePickerStyleSheet.replaceSync(DATE_PICKER_STYLES);
  }

  return datePickerStyleSheet;
}

export function applyDatePickerStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getDatePickerStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-date-picker]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsDatePicker = "";
  styleElement.textContent = DATE_PICKER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createDatePickerElements({
  onCellClick,
  onClear,
  onInputChange,
  onInputKeyDown,
  onNext,
  onPrev,
  onSuperNext,
  onSuperPrev,
  onTriggerClick
}: CreateDatePickerElementsOptions): DatePickerElements {
  const rootElement = document.createElement("div");
  const fieldElement = document.createElement("div");
  const inputElement = document.createElement("input");
  const clearButtonElement = document.createElement("button");
  const suffixElement = document.createElement("span");
  const popupElement = document.createElement("div");
  const headerElement = document.createElement("div");
  const superPrevButtonElement = createNavButton("Previous years", ChevronsLeft);
  const prevButtonElement = createNavButton("Previous month", ChevronLeft);
  const titleElement = document.createElement("span");
  const nextButtonElement = createNavButton("Next month", ChevronRight);
  const superNextButtonElement = createNavButton("Next years", ChevronsRight);
  const weekdaysElement = document.createElement("div");
  const gridElement = document.createElement("div");

  rootElement.className = "ds-date-picker";
  fieldElement.className = "ds-date-picker__field";
  inputElement.className = "ds-date-picker__input";
  inputElement.type = "text";
  inputElement.autocomplete = "off";
  inputElement.spellcheck = false;
  clearButtonElement.className = "ds-date-picker__clear";
  clearButtonElement.type = "button";
  clearButtonElement.setAttribute("aria-label", "Clear date");
  clearButtonElement.append(createIcon(CircleX));
  suffixElement.className = "ds-date-picker__suffix";
  suffixElement.append(createIcon(CalendarDays));
  popupElement.className = "ds-date-picker__popup";
  popupElement.hidden = true;
  popupElement.setAttribute("role", "dialog");
  popupElement.setAttribute("aria-label", "Date picker panel");
  headerElement.className = "ds-date-picker__header";
  titleElement.className = "ds-date-picker__title";
  weekdaysElement.className = "ds-date-picker__weekdays";
  weekdaysElement.append(...["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(createWeekdayElement));
  gridElement.className = "ds-date-picker__grid";
  gridElement.setAttribute("role", "grid");

  fieldElement.addEventListener("click", () => {
    onTriggerClick();
  });
  inputElement.addEventListener("change", onInputChange);
  inputElement.addEventListener("keydown", onInputKeyDown);
  clearButtonElement.addEventListener("click", onClear);
  superPrevButtonElement.addEventListener("click", onSuperPrev);
  prevButtonElement.addEventListener("click", onPrev);
  nextButtonElement.addEventListener("click", onNext);
  superNextButtonElement.addEventListener("click", onSuperNext);
  gridElement.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-value]");

    if (!button || button.disabled) {
      return;
    }

    onCellClick(button.dataset.value ?? "");
  });

  headerElement.append(superPrevButtonElement, prevButtonElement, titleElement, nextButtonElement, superNextButtonElement);
  popupElement.append(headerElement, weekdaysElement, gridElement);
  fieldElement.append(inputElement, clearButtonElement, suffixElement);
  rootElement.append(fieldElement, popupElement);

  return {
    clearButtonElement,
    gridElement,
    inputElement,
    nextButtonElement,
    popupElement,
    prevButtonElement,
    rootElement,
    superNextButtonElement,
    superPrevButtonElement,
    suffixElement,
    titleElement,
    weekdaysElement
  };
}

export function syncDatePickerElements({
  allowClear,
  cells,
  disabled,
  displayValue,
  elements,
  open,
  picker,
  placeholder,
  placement,
  readOnly,
  title
}: SyncDatePickerElementsOptions) {
  elements.inputElement.disabled = disabled;
  elements.inputElement.readOnly = readOnly;
  elements.inputElement.placeholder = placeholder;
  elements.inputElement.value = displayValue;
  elements.inputElement.setAttribute("aria-expanded", String(open));
  elements.inputElement.setAttribute("aria-haspopup", "dialog");
  elements.clearButtonElement.hidden = !allowClear || !displayValue;
  elements.clearButtonElement.disabled = disabled || readOnly;
  elements.popupElement.hidden = !open;
  elements.popupElement.dataset.placement = placement;
  elements.titleElement.textContent = title;
  syncNavigationLabels(elements, picker);
  elements.weekdaysElement.hidden = picker !== "date";
  elements.gridElement.className = `ds-date-picker__grid ds-date-picker__grid--${picker}`;
  elements.gridElement.setAttribute("aria-label", title);
  syncCells(elements.gridElement, cells);
}

function syncNavigationLabels(elements: DatePickerElements, picker: DatePickerPicker) {
  if (picker === "year") {
    elements.superPrevButtonElement.setAttribute("aria-label", "Previous century");
    elements.prevButtonElement.setAttribute("aria-label", "Previous decade");
    elements.nextButtonElement.setAttribute("aria-label", "Next decade");
    elements.superNextButtonElement.setAttribute("aria-label", "Next century");
    return;
  }

  if (picker === "month") {
    elements.superPrevButtonElement.setAttribute("aria-label", "Previous decade");
    elements.prevButtonElement.setAttribute("aria-label", "Previous year");
    elements.nextButtonElement.setAttribute("aria-label", "Next year");
    elements.superNextButtonElement.setAttribute("aria-label", "Next decade");
    return;
  }

  elements.superPrevButtonElement.setAttribute("aria-label", "Previous year");
  elements.prevButtonElement.setAttribute("aria-label", "Previous month");
  elements.nextButtonElement.setAttribute("aria-label", "Next month");
  elements.superNextButtonElement.setAttribute("aria-label", "Next year");
}

function syncCells(gridElement: HTMLDivElement, cells: DatePickerCell[]) {
  gridElement.replaceChildren(
    ...cells.map((cell) => {
      const buttonElement = document.createElement("button");

      buttonElement.className = "ds-date-picker__cell";
      buttonElement.type = "button";
      buttonElement.disabled = cell.disabled;
      buttonElement.dataset.outside = String(cell.outside);
      buttonElement.dataset.value = cell.value;
      buttonElement.setAttribute("aria-selected", String(cell.selected));

      if (cell.today) {
        buttonElement.setAttribute("aria-current", "date");
      }

      buttonElement.textContent = cell.label;

      return buttonElement;
    })
  );
}

function createWeekdayElement(label: string) {
  const element = document.createElement("span");

  element.className = "ds-date-picker__weekday";
  element.textContent = label;

  return element;
}

function createNavButton(label: string, icon: Parameters<typeof createLucideElement>[0]) {
  const buttonElement = document.createElement("button");

  buttonElement.className = "ds-date-picker__nav-button";
  buttonElement.type = "button";
  buttonElement.setAttribute("aria-label", label);
  buttonElement.append(createIcon(icon));

  return buttonElement;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
}
