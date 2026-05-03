import {
  TIME_PICKER_CHANGE_EVENT,
  TIME_PICKER_OBSERVED_ATTRIBUTES,
  TIME_PICKER_OPEN_CHANGE_EVENT
} from "./constants/TimePicker.constants";
import {
  formatTimeValue,
  getStepAttribute,
  getTimePickerFormat,
  getTimePickerPlacement,
  getTimePickerSize,
  getTimePickerStatus,
  getTimePickerVariant,
  normalizeBooleanAttribute,
  parseTimeValue,
  setTimePart
} from "./dom/TimePicker.dom";
import {
  createTimePickerElements,
  syncTimePickerElements
} from "./render/TimePicker.render";
import { applyTimePickerStyles } from "./TimePicker.styles";
import type {
  TimeColumn,
  TimePickerChangeDetail,
  TimePickerElements,
  TimePickerOpenChangeDetail,
  TimePickerPlacement,
  TimePickerSize,
  TimePickerStatus,
  TimePickerVariant,
  TimeValue
} from "./types/TimePicker.types";

export class DsTimePicker extends HTMLElement {
  static observedAttributes = TIME_PICKER_OBSERVED_ATTRIBUTES;

  private documentListenerAttached = false;
  private elements?: TimePickerElements;
  private hasAppliedDefaultValue = false;
  private internalValue: TimeValue = { hour: 0, minute: 0, second: 0 };

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

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get format() {
    return getTimePickerFormat(this);
  }

  set format(value: string) {
    this.syncNullableAttribute("format", value);
  }

  get inputReadOnly() {
    return normalizeBooleanAttribute(this, "input-read-only", false);
  }

  set inputReadOnly(value: boolean) {
    this.toggleAttribute("input-read-only", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get placeholder() {
    return this.getAttribute("placeholder") ?? "Select a time";
  }

  set placeholder(value: string) {
    this.syncNullableAttribute("placeholder", value);
  }

  get placement(): TimePickerPlacement {
    return getTimePickerPlacement(this);
  }

  set placement(value: TimePickerPlacement) {
    this.setAttribute("placement", value);
  }

  get showNow() {
    return normalizeBooleanAttribute(this, "show-now", false);
  }

  set showNow(value: boolean) {
    this.toggleAttribute("show-now", value);
  }

  get size(): TimePickerSize {
    return getTimePickerSize(this);
  }

  set size(value: TimePickerSize) {
    this.setAttribute("size", value);
  }

  get status(): TimePickerStatus | undefined {
    return getTimePickerStatus(this);
  }

  set status(value: TimePickerStatus | undefined) {
    this.syncNullableAttribute("status", value ?? "");
  }

  get use12Hours() {
    return normalizeBooleanAttribute(this, "use12-hours", false);
  }

  set use12Hours(value: boolean) {
    this.toggleAttribute("use12-hours", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setValue(value, true);
  }

  get variant(): TimePickerVariant {
    return getTimePickerVariant(this);
  }

  set variant(value: TimePickerVariant) {
    this.setAttribute("variant", value);
  }

  focus() {
    this.elements?.inputElement.focus();
  }

  blur() {
    this.elements?.inputElement.blur();
  }

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
    const parsedValue = parseTimeValue(value);

    if (!value) {
      this.setValue("", true);
      return;
    }

    if (!parsedValue) {
      this.render();
      return;
    }

    this.internalValue = parsedValue;
    this.setValue(formatTimeValue(parsedValue, this.format), true);
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

  private handleNowClick = () => {
    const now = new Date();

    this.internalValue = {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    };
    this.setValue(formatTimeValue(this.internalValue, this.format), true);
    this.setOpen(false);
  };

  private handleOptionClick = (column: TimeColumn, value: number | "am" | "pm") => {
    this.internalValue = setTimePart(this.internalValue, column, value);
    this.setValue(formatTimeValue(this.internalValue, this.format), true);
  };

  private handleTriggerClick = () => {
    if (this.disabled) {
      return;
    }

    this.setOpen(true);
  };

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncElements();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createTimePickerElements({
      onClear: this.handleClear,
      onInputChange: this.handleInputChange,
      onInputKeyDown: this.handleInputKeyDown,
      onNowClick: this.handleNowClick,
      onOptionClick: this.handleOptionClick,
      onTriggerClick: this.handleTriggerClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyTimePickerStyles(shadowRoot);
  }

  private syncAttributes() {
    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.applyDefaultValue();

    if (this.disabled && this.open) {
      this.setOpen(false);
    }
  }

  private syncElements() {
    if (!this.elements) {
      return;
    }

    const parsedValue = parseTimeValue(this.value);

    if (parsedValue) {
      this.internalValue = parsedValue;
    }

    syncTimePickerElements(
      this.elements,
      {
        allowClear: this.allowClear,
        disabled: this.disabled,
        displayValue: this.value,
        hourStep: getStepAttribute(this, "hour-step"),
        inputReadOnly: this.inputReadOnly,
        minuteStep: getStepAttribute(this, "minute-step"),
        open: this.open,
        placeholder: this.placeholder,
        secondStep: getStepAttribute(this, "second-step"),
        showNow: this.showNow,
        use12Hours: this.use12Hours,
        value: this.internalValue
      },
      {
        onClear: this.handleClear,
        onInputChange: this.handleInputChange,
        onInputKeyDown: this.handleInputKeyDown,
        onNowClick: this.handleNowClick,
        onOptionClick: this.handleOptionClick,
        onTriggerClick: this.handleTriggerClick
      }
    );
    this.syncDocumentListener();
  }

  private setOpen(open: boolean) {
    if (this.open === open) {
      return;
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<TimePickerOpenChangeDetail>(TIME_PICKER_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: { open }
      })
    );
  }

  private setValue(value: string, emitChange: boolean) {
    const previousValue = this.value;

    if (value) {
      this.setAttributeIfChanged("value", value);
    } else {
      this.removeAttribute("value");
    }

    if (emitChange && previousValue !== this.value) {
      this.dispatchEvent(
        new CustomEvent<TimePickerChangeDetail>(TIME_PICKER_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            timeString: this.value,
            value: this.value
          }
        })
      );
    }

    this.render();
  }

  private applyDefaultValue() {
    const defaultValue = this.getAttribute("default-value") ?? "";

    if (this.hasAppliedDefaultValue || this.hasAttribute("value") || !defaultValue) {
      return;
    }

    this.hasAppliedDefaultValue = true;
    this.setValue(defaultValue, false);
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
}
