import dayjs, { type Dayjs } from "dayjs";

import {
  DATE_PICKER_CHANGE_EVENT,
  DATE_PICKER_ELEMENT_NAME,
  DATE_PICKER_OBSERVED_ATTRIBUTES,
  DATE_PICKER_OPEN_CHANGE_EVENT,
  DATE_PICKER_PANEL_CHANGE_EVENT
} from "./constants/DatePicker.constants";
import {
  createPickerCells,
  formatPickerDate,
  getAdjacentPanelDate,
  getDatePickerFormat,
  getDatePickerPicker,
  getDatePickerPlacement,
  getDatePickerSize,
  getDatePickerStatus,
  getDatePickerVariant,
  getPanelTitle,
  isPickerDateDisabled,
  normalizeBooleanAttribute,
  parsePickerDate
} from "./dom/DatePicker.dom";
import {
  applyDatePickerStyles,
  createDatePickerElements,
  syncDatePickerElements,
  type DatePickerElements
} from "./render/DatePicker.render";
import type {
  DatePickerChangeDetail,
  DatePickerOpenChangeDetail,
  DatePickerPanelChangeDetail,
  DatePickerPicker,
  DatePickerPlacement,
  DatePickerSize,
  DatePickerStatus,
  DatePickerVariant
} from "./types/DatePicker.types";

export class DsDatePicker extends HTMLElement {
  static observedAttributes = DATE_PICKER_OBSERVED_ATTRIBUTES;

  private documentListenerAttached = false;
  private elements?: DatePickerElements;
  private hasAppliedDefaultValue = false;
  private internalPanelDate: Dayjs = dayjs();

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.detachDocumentListener();
  }

  attributeChangedCallback() {
    this.render();
  }

  get allowClear() {
    return normalizeBooleanAttribute(this, "allow-clear", true);
  }

  set allowClear(value: boolean) {
    this.setAttribute("allow-clear", String(value));
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? "";
  }

  set defaultValue(value: string) {
    this.syncNullableAttribute("default-value", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get format() {
    return getDatePickerFormat(this, this.picker);
  }

  set format(value: string) {
    this.syncNullableAttribute("format", value);
  }

  get maxDate() {
    return this.getAttribute("max-date") ?? "";
  }

  set maxDate(value: string) {
    this.syncNullableAttribute("max-date", value);
  }

  get minDate() {
    return this.getAttribute("min-date") ?? "";
  }

  set minDate(value: string) {
    this.syncNullableAttribute("min-date", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get picker(): DatePickerPicker {
    return getDatePickerPicker(this);
  }

  set picker(value: DatePickerPicker) {
    this.setAttribute("picker", value);
  }

  get placeholder() {
    return this.getAttribute("placeholder") ?? "Select date";
  }

  set placeholder(value: string) {
    this.syncNullableAttribute("placeholder", value);
  }

  get placement(): DatePickerPlacement {
    return getDatePickerPlacement(this);
  }

  set placement(value: DatePickerPlacement) {
    this.setAttribute("placement", value);
  }

  get readOnly() {
    return normalizeBooleanAttribute(this, "read-only", false);
  }

  set readOnly(value: boolean) {
    this.toggleAttribute("read-only", value);
  }

  get size(): DatePickerSize {
    return getDatePickerSize(this);
  }

  set size(value: DatePickerSize) {
    this.setAttribute("size", value);
  }

  get status(): DatePickerStatus | undefined {
    return getDatePickerStatus(this);
  }

  set status(value: DatePickerStatus | undefined) {
    this.syncNullableAttribute("status", value ?? "");
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setValue(value, true);
  }

  get variant(): DatePickerVariant {
    return getDatePickerVariant(this);
  }

  set variant(value: DatePickerVariant) {
    this.setAttribute("variant", value);
  }

  focus() {
    this.elements?.inputElement.focus();
  }

  blur() {
    this.elements?.inputElement.blur();
  }

  private get selectedDate() {
    return this.parseValue(this.value);
  }

  private handleCellClick = (value: string) => {
    this.setValue(value, true);
    this.setOpen(false);
    this.focus();
  };

  private handleClear = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setValue("", true);
    this.setOpen(false);
    this.focus();
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }

    this.setOpen(false);
  };

  private handleInputChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    const parsed = this.parseValue(value);

    if (!value) {
      this.setValue("", true);
      return;
    }

    if (!parsed || this.isOutsideRange(parsed)) {
      this.render();
      return;
    }

    this.setValue(formatPickerDate(parsed, this.format), true);
  };

  private handleInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.setOpen(false);
      return;
    }

    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      this.setOpen(true);
    }
  };

  private handleNext = () => {
    this.movePanel(1);
  };

  private handlePrev = () => {
    this.movePanel(-1);
  };

  private handleSuperNext = () => {
    this.movePanel(this.picker === "date" ? 12 : 10);
  };

  private handleSuperPrev = () => {
    this.movePanel(this.picker === "date" ? -12 : -10);
  };

  private handleTriggerClick = () => {
    if (this.disabled || this.readOnly) {
      return;
    }

    this.setOpen(true);
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncElements();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createDatePickerElements({
      onCellClick: this.handleCellClick,
      onClear: this.handleClear,
      onInputChange: this.handleInputChange,
      onInputKeyDown: this.handleInputKeyDown,
      onNext: this.handleNext,
      onPrev: this.handlePrev,
      onSuperNext: this.handleSuperNext,
      onSuperPrev: this.handleSuperPrev,
      onTriggerClick: this.handleTriggerClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyDatePickerStyles(shadowRoot);
  }

  private syncAttributes() {
    this.setAttributeIfChanged("picker", this.picker);
    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.toggleAttributeIfChanged("read-only", this.readOnly);
    this.applyDefaultValue();

    if (this.disabled && this.open) {
      this.setOpen(false);
    }
  }

  private syncElements() {
    if (!this.elements) {
      return;
    }

    const selectedDate = this.selectedDate;
    const panelDate = selectedDate ?? this.internalPanelDate;
    const maxDate = this.parseValue(this.maxDate);
    const minDate = this.parseValue(this.minDate);

    this.internalPanelDate = panelDate;
    syncDatePickerElements({
      allowClear: this.allowClear,
      cells: createPickerCells({
        maxDate,
        minDate,
        panelDate,
        picker: this.picker,
        selectedDate
      }),
      disabled: this.disabled,
      displayValue: selectedDate ? formatPickerDate(selectedDate, this.format) : "",
      elements: this.elements,
      open: this.open,
      picker: this.picker,
      placeholder: this.placeholder,
      placement: this.placement,
      readOnly: this.readOnly,
      title: getPanelTitle(panelDate, this.picker)
    });
    this.syncDocumentListener();
  }

  private movePanel(direction: -12 | -10 | -1 | 1 | 10 | 12) {
    const step = direction < 0 ? -1 : 1;
    const count = Math.abs(direction);

    for (let index = 0; index < count; index += 1) {
      this.internalPanelDate = getAdjacentPanelDate(this.internalPanelDate, this.picker, step);
    }

    this.dispatchEvent(
      new CustomEvent<DatePickerPanelChangeDetail>(DATE_PICKER_PANEL_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          panelValue: formatPickerDate(this.internalPanelDate, this.format),
          picker: this.picker
        }
      })
    );
    this.render();
  }

  private setOpen(open: boolean) {
    if (this.open === open) {
      return;
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<DatePickerOpenChangeDetail>(DATE_PICKER_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: { open }
      })
    );
  }

  private setValue(value: string, emitChange: boolean) {
    const previousValue = this.value;

    if (value) {
      this.setAttributeIfChanged("value", value);
      this.internalPanelDate = this.parseValue(value) ?? this.internalPanelDate;
    } else {
      this.removeAttribute("value");
    }

    if (emitChange && previousValue !== this.value) {
      this.dispatchEvent(
        new CustomEvent<DatePickerChangeDetail>(DATE_PICKER_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            dateString: this.value,
            value: this.value
          }
        })
      );
    }

    this.render();
  }

  private parseValue(value: string) {
    return parsePickerDate(value, this.format, this.picker);
  }

  private isOutsideRange(date: Dayjs) {
    return isPickerDateDisabled(date, this.parseValue(this.minDate), this.parseValue(this.maxDate), this.picker);
  }

  private applyDefaultValue() {
    if (this.hasAppliedDefaultValue || this.hasAttribute("value") || !this.defaultValue) {
      return;
    }

    this.hasAppliedDefaultValue = true;
    this.setAttributeIfChanged("value", this.defaultValue);
    this.internalPanelDate = this.parseValue(this.defaultValue) ?? this.internalPanelDate;
  }

  private syncDocumentListener() {
    if (this.open && !this.documentListenerAttached) {
      document.addEventListener("pointerdown", this.handleDocumentPointerDown);
      this.documentListenerAttached = true;
      return;
    }

    if (!this.open) {
      this.detachDocumentListener();
    }
  }

  private detachDocumentListener() {
    if (!this.documentListenerAttached) {
      return;
    }

    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.documentListenerAttached = false;
  }

  private syncNullableAttribute(name: string, value: string) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }

  private toggleAttributeIfChanged(name: string, force: boolean) {
    if (this.hasAttribute(name) !== force) {
      this.toggleAttribute(name, force);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [DATE_PICKER_ELEMENT_NAME]: DsDatePicker;
  }
}
