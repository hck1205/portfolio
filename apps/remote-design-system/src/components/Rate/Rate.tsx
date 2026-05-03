import { RATE_CHANGE_EVENT, RATE_HOVER_CHANGE_EVENT, RATE_OBSERVED_ATTRIBUTES } from "./constants/Rate.constants";
import {
  clampRateValue,
  getRateCount,
  getRateNumberAttribute,
  getRateSize,
  normalizeBooleanAttribute,
  parseRateTooltips,
  syncNullableAttribute
} from "./dom/Rate.dom";
import { applyRateStyles, createRateElements, syncRateElements, type RateElements } from "./Rate.render";
import type { RateChangeDetail, RateHoverChangeDetail, RateSize } from "./types/Rate.types";

export class DsRate extends HTMLElement {
  static observedAttributes = RATE_OBSERVED_ATTRIBUTES;

  private elements?: RateElements;
  private hasAppliedDefaultValue = false;
  private hoverValue = 0;
  private internalValue = 0;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.requestRender();
  }

  get allowClear() {
    return normalizeBooleanAttribute(this, "allow-clear", true);
  }

  set allowClear(value: boolean) {
    this.setAttribute("allow-clear", String(value));
  }

  get allowHalf() {
    return normalizeBooleanAttribute(this, "allow-half", false);
  }

  set allowHalf(value: boolean) {
    this.toggleAttribute("allow-half", value);
  }

  get character() {
    return this.getAttribute("character") || "★";
  }

  set character(value: string) {
    syncNullableAttribute(this, "character", value);
  }

  get count() {
    return getRateCount(this);
  }

  set count(value: number) {
    this.setAttribute("count", String(Math.max(1, Math.floor(value))));
  }

  get defaultValue() {
    return getRateNumberAttribute(this, "default-value", 0);
  }

  set defaultValue(value: number) {
    if (!this.hasAttribute("value") && !this.hasAppliedDefaultValue) {
      this.internalValue = value;
    }

    this.setAttribute("default-value", String(value));
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get keyboard() {
    return normalizeBooleanAttribute(this, "keyboard", true);
  }

  set keyboard(value: boolean) {
    this.setAttribute("keyboard", String(value));
  }

  get size(): RateSize {
    return getRateSize(this);
  }

  set size(value: RateSize) {
    this.setAttribute("size", value);
  }

  get tooltips() {
    return parseRateTooltips(this.getAttribute("tooltips"));
  }

  set tooltips(value: string[]) {
    this.setAttribute("tooltips", JSON.stringify(value));
  }

  get value() {
    if (this.hasAttribute("value")) {
      return clampRateValue(getRateNumberAttribute(this, "value", 0), this.count, this.allowHalf);
    }

    return clampRateValue(this.internalValue, this.count, this.allowHalf);
  }

  set value(value: number) {
    this.setValue(value, true);
  }

  blur() {
    this.elements?.rootElement.blur();
  }

  focus() {
    this.elements?.rootElement.focus();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || !this.keyboard) {
      return;
    }

    const step = this.allowHalf ? 0.5 : 1;

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      this.setValue(this.value + step, true);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      this.setValue(this.value - step, true);
    }
  };

  private handlePointerLeave = () => {
    if (this.hoverValue === 0) {
      return;
    }

    this.hoverValue = 0;
    this.dispatchHoverChange(0);
    this.render();
  };

  private handleRateClick = (event: MouseEvent) => {
    if (this.disabled) {
      return;
    }

    const nextValue = this.getEventValue(event);

    if (this.allowClear && nextValue === this.value) {
      this.setValue(0, true);
      return;
    }

    this.setValue(nextValue, true);
  };

  private handleRateHover = (event: PointerEvent) => {
    if (this.disabled) {
      return;
    }

    const nextValue = this.getEventValue(event);

    if (nextValue === this.hoverValue) {
      return;
    }

    this.hoverValue = nextValue;
    this.dispatchHoverChange(nextValue);
    this.render();
  };

  private render() {
    this.applyDefaultValue();

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    this.setAttribute("size", this.size);
    syncRateElements({
      character: this.character,
      count: this.count,
      disabled: this.disabled,
      elements: this.elements,
      keyboard: this.keyboard,
      tooltips: this.tooltips,
      value: this.hoverValue || this.value
    });
  }

  private requestRender() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    this.render();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createRateElements({
      onKeyDown: this.handleKeyDown,
      onPointerLeave: this.handlePointerLeave,
      onRateClick: this.handleRateClick,
      onRateHover: this.handleRateHover
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyRateStyles(shadowRoot);
  }

  private applyDefaultValue() {
    if (this.hasAppliedDefaultValue) {
      return;
    }

    if (!this.hasAttribute("value")) {
      this.internalValue = this.defaultValue;
    }

    this.hasAppliedDefaultValue = true;
  }

  private getEventValue(event: MouseEvent | PointerEvent) {
    const item = (event.target as Element | null)?.closest<HTMLButtonElement>(".ds-rate__item");

    if (!item) {
      return this.value;
    }

    const itemValue = Number(item.dataset.value);
    const rect = item.getBoundingClientRect();
    const isHalf = this.allowHalf && event.clientX - rect.left <= rect.width / 2;

    return clampRateValue(itemValue - (isHalf ? 0.5 : 0), this.count, this.allowHalf);
  }

  private setValue(value: number, emitChange: boolean) {
    const nextValue = clampRateValue(value, this.count, this.allowHalf);
    const previousValue = this.value;

    this.internalValue = nextValue;
    this.setAttribute("value", String(nextValue));
    this.hoverValue = 0;

    if (emitChange && previousValue !== nextValue) {
      this.dispatchEvent(
        new CustomEvent<RateChangeDetail>(RATE_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            value: nextValue
          }
        })
      );
    }

    this.render();
  }

  private dispatchHoverChange(value: number) {
    this.dispatchEvent(
      new CustomEvent<RateHoverChangeDetail>(RATE_HOVER_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          value
        }
      })
    );
  }
}
