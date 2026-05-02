import {
  INPUT_NUMBER_CHANGE_EVENT,
  INPUT_NUMBER_OBSERVED_ATTRIBUTES,
  INPUT_NUMBER_STEP_EVENT
} from "./constants/InputNumber.constants";
import {
  clampInputNumber,
  formatInputNumber,
  getInputNumberFormatter,
  getInputNumberSize,
  getInputNumberStatus,
  getInputNumberVariant,
  getNumberAttribute,
  getPrecision,
  getStep,
  normalizeBooleanAttribute,
  parseInputNumber,
  roundToPrecision
} from "./dom/InputNumber.dom";
import {
  applyInputNumberStyles,
  createInputNumberElements,
  syncInputNumberElements,
  type InputNumberElements
} from "./InputNumber.render";
import type {
  InputNumberChangeDetail,
  InputNumberFormatter,
  InputNumberSize,
  InputNumberStatus,
  InputNumberStepDetail,
  InputNumberVariant
} from "./types/InputNumber.types";

export class DsInputNumber extends HTMLElement {
  static observedAttributes = INPUT_NUMBER_OBSERVED_ATTRIBUTES;

  private displayValue = "";
  private elements?: InputNumberElements;
  private internalValue: number | null = null;

  connectedCallback() {
    if (!this.displayValue) {
      this.internalValue = this.getInitialValue();
      this.displayValue = this.formatValue(this.internalValue);
    }

    this.render();
  }

  attributeChangedCallback(name: string) {
    if (name === "value") {
      this.internalValue = this.parseAttributeValue("value");
      this.displayValue = this.formatValue(this.internalValue);
    }

    this.render();
  }

  get controls() {
    return normalizeBooleanAttribute(this, "controls", true);
  }

  set controls(value: boolean) {
    this.setAttribute("controls", String(value));
  }

  get decimalSeparator() {
    return this.getAttribute("decimal-separator") || ".";
  }

  set decimalSeparator(value: string) {
    this.setAttribute("decimal-separator", value || ".");
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get formatter(): InputNumberFormatter {
    return getInputNumberFormatter(this);
  }

  set formatter(value: InputNumberFormatter) {
    this.setAttribute("formatter", value);
  }

  get keyboard() {
    return normalizeBooleanAttribute(this, "keyboard", true);
  }

  set keyboard(value: boolean) {
    this.setAttribute("keyboard", String(value));
  }

  get max() {
    return getNumberAttribute(this, "max");
  }

  set max(value: number | undefined) {
    this.syncNullableAttribute("max", value);
  }

  get min() {
    return getNumberAttribute(this, "min");
  }

  set min(value: number | undefined) {
    this.syncNullableAttribute("min", value);
  }

  get precision() {
    return getPrecision(this);
  }

  set precision(value: number | undefined) {
    this.syncNullableAttribute("precision", value);
  }

  get readonly() {
    return normalizeBooleanAttribute(this, "readonly", false);
  }

  set readonly(value: boolean) {
    this.toggleAttribute("readonly", value);
  }

  get size(): InputNumberSize {
    return getInputNumberSize(this);
  }

  set size(value: InputNumberSize) {
    this.setAttribute("size", value);
  }

  get status(): InputNumberStatus | undefined {
    return getInputNumberStatus(this);
  }

  set status(value: InputNumberStatus | undefined) {
    this.syncNullableAttribute("status", value);
  }

  get step() {
    return getStep(this);
  }

  set step(value: number) {
    this.setAttribute("step", String(value));
  }

  get value() {
    return this.internalValue;
  }

  set value(value: number | null) {
    this.setValue(value, undefined);
  }

  get variant(): InputNumberVariant {
    return getInputNumberVariant(this);
  }

  set variant(value: InputNumberVariant) {
    this.setAttribute("variant", value);
  }

  get wheel() {
    return normalizeBooleanAttribute(this, "wheel", false);
  }

  set wheel(value: boolean) {
    this.setAttribute("wheel", String(value));
  }

  focus(options?: FocusOptions) {
    this.elements?.controlElement.focus(options);
  }

  blur() {
    this.elements?.controlElement.blur();
  }

  private handleBlur = (event: FocusEvent) => {
    this.commitDisplayValue(event);
  };

  private handleChange = (event: Event) => {
    this.commitDisplayValue(event);
  };

  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    this.displayValue = target.value;
    this.dispatchChange(event);
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.keyboard || this.disabled || this.readonly) {
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.stepBy(1);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.stepBy(-1);
    }
  };

  private handleStepDown = () => {
    this.stepBy(-1);
  };

  private handleStepUp = () => {
    this.stepBy(1);
  };

  private handleWheel = (event: WheelEvent) => {
    if (!this.wheel || this.disabled || this.readonly || document.activeElement !== this) {
      return;
    }

    event.preventDefault();
    this.stepBy(event.deltaY < 0 ? 1 : -1);
  };

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncStructure();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createInputNumberElements({
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown,
      onStepDown: this.handleStepDown,
      onStepUp: this.handleStepUp,
      onWheel: this.handleWheel
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyInputNumberStyles(shadowRoot);
  }

  private syncAttributes() {
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.setAttributeIfChanged("data-controls", String(this.controls));
    this.toggleAttributeIfChanged("block", normalizeBooleanAttribute(this, "block", false));

    const status = this.status;

    if (status) {
      this.setAttributeIfChanged("status", status);
    } else {
      this.removeAttribute("status");
    }
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    syncInputNumberElements({
      ...this.elements,
      autocomplete: this.getAttribute("autocomplete") ?? "",
      decrementDisabled: this.isAtMin(),
      disabled: this.disabled,
      displayValue: this.displayValue,
      id: this.getAttribute("id") ?? "",
      incrementDisabled: this.isAtMax(),
      max: this.max,
      min: this.min,
      name: this.getAttribute("name") ?? "",
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown,
      onStepDown: this.handleStepDown,
      onStepUp: this.handleStepUp,
      onWheel: this.handleWheel,
      placeholder: this.getAttribute("placeholder") ?? "",
      readonly: this.readonly,
      required: normalizeBooleanAttribute(this, "required", false),
      value: this.internalValue
    });
  }

  private stepBy(direction: 1 | -1) {
    if (this.disabled || this.readonly) {
      return;
    }

    const currentValue = parseInputNumber(this.displayValue, this.decimalSeparator) ?? this.internalValue ?? this.min ?? 0;
    const nextValue = this.normalizeValue(currentValue + this.step * direction);

    this.setInternalValue(nextValue);
    this.dispatchChange();
    this.dispatchEvent(
      new CustomEvent<InputNumberStepDetail>(INPUT_NUMBER_STEP_EVENT, {
        bubbles: true,
        detail: {
          offset: this.step * direction,
          value: this.internalValue
        }
      })
    );
  }

  private commitDisplayValue(nativeEvent?: Event) {
    this.setInternalValue(parseInputNumber(this.displayValue, this.decimalSeparator));
    this.dispatchChange(nativeEvent);
  }

  private setValue(value: number | null, nativeEvent?: Event) {
    this.setInternalValue(value);
    this.dispatchChange(nativeEvent);
  }

  private setInternalValue(value: number | null) {
    this.internalValue = this.normalizeValue(value);
    this.displayValue = this.formatValue(this.internalValue);
    this.render();
  }

  private normalizeValue(value: number | null) {
    const roundedValue = value === null ? null : roundToPrecision(value, this.getEffectivePrecision());

    return clampInputNumber(roundedValue, this.min, this.max);
  }

  private dispatchChange(nativeEvent?: Event) {
    this.dispatchEvent(
      new CustomEvent<InputNumberChangeDetail>(INPUT_NUMBER_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          displayValue: this.displayValue,
          nativeEvent,
          value: parseInputNumber(this.displayValue, this.decimalSeparator)
        }
      })
    );
  }

  private getInitialValue() {
    return this.parseAttributeValue("value") ?? this.parseAttributeValue("default-value");
  }

  private parseAttributeValue(name: string) {
    const value = this.getAttribute(name);

    return value === null || value === "" ? null : parseInputNumber(value, this.decimalSeparator);
  }

  private formatValue(value: number | null) {
    return formatInputNumber({
      decimalSeparator: this.decimalSeparator,
      formatter: this.formatter,
      precision: this.precision,
      value
    });
  }

  private getEffectivePrecision() {
    if (this.precision !== undefined) {
      return this.precision;
    }

    const [, decimal = ""] = String(this.step).split(".");

    return decimal.length || undefined;
  }

  private isAtMax() {
    return this.max !== undefined && this.internalValue !== null && this.internalValue >= this.max;
  }

  private isAtMin() {
    return this.min !== undefined && this.internalValue !== null && this.internalValue <= this.min;
  }

  private syncNullableAttribute(name: string, value: number | string | undefined) {
    if (value !== undefined && value !== "") {
      this.setAttributeIfChanged(name, String(value));
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
