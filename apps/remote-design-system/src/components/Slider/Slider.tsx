import {
  SLIDER_CHANGE_COMPLETE_EVENT,
  SLIDER_CHANGE_EVENT,
  SLIDER_OBSERVED_ATTRIBUTES
} from "./constants/Slider.constants";
import {
  getSliderMax,
  getSliderMin,
  getSliderStep,
  getSliderTooltip,
  normalizeBooleanAttribute,
  normalizeSliderPair,
  parseSliderMarks,
  parseSliderValue,
  snapSliderValue
} from "./dom/Slider.dom";
import { createSliderElements, syncSliderElements } from "./render/Slider.render";
import { applySliderStyles } from "./Slider.styles";
import type { SliderChangeDetail, SliderElements, SliderValue } from "./types/Slider.types";

type ActiveThumb = "lower" | "upper";

export class DsSlider extends HTMLElement {
  static observedAttributes = SLIDER_OBSERVED_ATTRIBUTES;

  private activeThumb: ActiveThumb = "lower";
  private elements?: SliderElements;
  private internalValue?: [number, number];

  connectedCallback() {
    this.internalValue ??= this.getInitialValue();
    this.render();
  }

  disconnectedCallback() {
    this.detachPointerListeners();
  }

  attributeChangedCallback(name: string) {
    if (name === "value") {
      this.internalValue = this.getInitialValue();
    }

    this.render();
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get dots() {
    return normalizeBooleanAttribute(this, "dots", false);
  }

  set dots(value: boolean) {
    this.toggleAttribute("dots", value);
  }

  get included() {
    return normalizeBooleanAttribute(this, "included", true);
  }

  set included(value: boolean) {
    this.setAttribute("included", String(value));
  }

  get marks() {
    return this.getAttribute("marks") ?? "";
  }

  set marks(value: string) {
    this.setAttribute("marks", value);
  }

  get max() {
    return getSliderMax(this);
  }

  set max(value: number) {
    this.setAttribute("max", String(value));
  }

  get min() {
    return getSliderMin(this);
  }

  set min(value: number) {
    this.setAttribute("min", String(value));
  }

  get range() {
    return normalizeBooleanAttribute(this, "range", false);
  }

  set range(value: boolean) {
    this.toggleAttribute("range", value);
  }

  get reverse() {
    return normalizeBooleanAttribute(this, "reverse", false);
  }

  set reverse(value: boolean) {
    this.toggleAttribute("reverse", value);
  }

  get step() {
    return getSliderStep(this);
  }

  set step(value: number | null) {
    this.setAttribute("step", value === null ? "null" : String(value));
  }

  get tooltip() {
    return getSliderTooltip(this);
  }

  set tooltip(value: "auto" | "open" | "closed") {
    this.setAttribute("tooltip", value);
  }

  get value(): SliderValue {
    const value = this.getCurrentValue();

    return this.range ? value : value[0];
  }

  set value(value: SliderValue) {
    const nextValue: [number, number] = Array.isArray(value) ? [value[0], value[1]] : [value, value];

    this.setInternalValue(nextValue, { commit: true });
  }

  get vertical() {
    return normalizeBooleanAttribute(this, "vertical", false);
  }

  set vertical(value: boolean) {
    this.toggleAttribute("vertical", value);
  }

  focus(options?: FocusOptions) {
    this.elements?.lowerThumb.focus(options);
  }

  blur() {
    this.elements?.lowerThumb.blur();
    this.elements?.upperThumb.blur();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    const thumb = (event.currentTarget as HTMLElement).dataset.thumb as ActiveThumb;
    const offset = this.getKeyboardOffset(event.key);

    if (offset === 0) {
      return;
    }

    event.preventDefault();
    this.activeThumb = thumb;
    this.moveThumb(thumb, this.getCurrentValue()[thumb === "lower" ? 0 : 1] + offset, { commit: true });
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (this.disabled || !this.elements) {
      return;
    }

    event.preventDefault();
    this.elements.rail.setPointerCapture(event.pointerId);
    this.activeThumb = this.getClosestThumb(this.getValueFromPointer(event));
    this.moveThumb(this.activeThumb, this.getValueFromPointer(event));
    this.elements.rail.addEventListener("pointermove", this.handlePointerMove);
    this.elements.rail.addEventListener("pointerup", this.handlePointerUp);
    this.elements.rail.addEventListener("pointercancel", this.handlePointerUp);
  };

  private handlePointerMove = (event: PointerEvent) => {
    this.moveThumb(this.activeThumb, this.getValueFromPointer(event));
  };

  private handlePointerUp = (event: PointerEvent) => {
    if (this.elements?.rail.hasPointerCapture(event.pointerId)) {
      this.elements.rail.releasePointerCapture(event.pointerId);
    }

    this.detachPointerListeners();
    this.dispatchChangeComplete();
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

    this.elements = createSliderElements({
      onKeyDown: this.handleKeyDown,
      onPointerDown: this.handlePointerDown
    });
    shadowRoot.replaceChildren(this.elements.root);
    applySliderStyles(shadowRoot);
  }

  private syncAttributes() {
    this.toggleAttributeIfChanged("vertical", this.vertical);
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    syncSliderElements(this.elements, {
      disabled: this.disabled,
      dots: this.dots,
      included: this.included,
      marks: this.getParsedMarks(),
      max: this.max,
      min: this.min,
      range: this.range,
      reverse: this.reverse,
      tooltip: this.tooltip,
      value: this.getCurrentValue(),
      vertical: this.vertical
    });
  }

  private moveThumb(thumb: ActiveThumb, rawValue: number, options?: { commit?: boolean }) {
    const currentValue = this.getCurrentValue();
    const nextValue: [number, number] = [...currentValue];
    const index = thumb === "lower" ? 0 : 1;

    nextValue[index] = this.snapValue(rawValue);
    this.setInternalValue(nextValue, options);
  }

  private setInternalValue(value: [number, number], options?: { commit?: boolean }) {
    this.internalValue = normalizeSliderPair(value, this.min, this.max, this.range);
    this.render();
    this.dispatchChange();

    if (options?.commit) {
      this.dispatchChangeComplete();
    }
  }

  private getInitialValue(): [number, number] {
    const parsedValue =
      parseSliderValue(this.getAttribute("value"), this.range) ??
      parseSliderValue(this.getAttribute("default-value"), this.range) ??
      (this.range ? [this.min, this.min] : [this.min, this.min]);

    return normalizeSliderPair(parsedValue, this.min, this.max, this.range);
  }

  private getCurrentValue() {
    return normalizeSliderPair(this.internalValue ?? this.getInitialValue(), this.min, this.max, this.range);
  }

  private snapValue(value: number) {
    return snapSliderValue(value, {
      marks: this.dots ? this.getParsedMarks() : [],
      max: this.max,
      min: this.min,
      step: this.step
    });
  }

  private getValueFromPointer(event: PointerEvent) {
    const rail = this.elements?.rail;

    if (!rail) {
      return this.min;
    }

    const rect = rail.getBoundingClientRect();
    const rawRatio = this.vertical ? (rect.bottom - event.clientY) / rect.height : (event.clientX - rect.left) / rect.width;
    const ratio = this.reverse ? 1 - rawRatio : rawRatio;

    return this.min + Math.min(1, Math.max(0, ratio)) * (this.max - this.min);
  }

  private getClosestThumb(value: number): ActiveThumb {
    if (!this.range) {
      return "lower";
    }

    const [lowerValue, upperValue] = this.getCurrentValue();

    return Math.abs(value - lowerValue) <= Math.abs(value - upperValue) ? "lower" : "upper";
  }

  private getKeyboardOffset(key: string) {
    const step = this.step ?? 1;
    const direction = this.reverse ? -1 : 1;

    if (key === "ArrowRight" || key === "ArrowUp") {
      return step * direction;
    }

    if (key === "ArrowLeft" || key === "ArrowDown") {
      return step * -direction;
    }

    if (key === "PageUp") {
      return step * 10 * direction;
    }

    if (key === "PageDown") {
      return step * -10 * direction;
    }

    return 0;
  }

  private getParsedMarks() {
    return parseSliderMarks(this.marks);
  }

  private dispatchChange() {
    this.dispatchEvent(
      new CustomEvent<SliderChangeDetail>(SLIDER_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          value: this.value
        }
      })
    );
  }

  private dispatchChangeComplete() {
    this.dispatchEvent(
      new CustomEvent<SliderChangeDetail>(SLIDER_CHANGE_COMPLETE_EVENT, {
        bubbles: true,
        detail: {
          value: this.value
        }
      })
    );
  }

  private detachPointerListeners() {
    this.elements?.rail.removeEventListener("pointermove", this.handlePointerMove);
    this.elements?.rail.removeEventListener("pointerup", this.handlePointerUp);
    this.elements?.rail.removeEventListener("pointercancel", this.handlePointerUp);
  }

  private toggleAttributeIfChanged(name: string, force: boolean) {
    if (this.hasAttribute(name) !== force) {
      this.toggleAttribute(name, force);
    }
  }
}
