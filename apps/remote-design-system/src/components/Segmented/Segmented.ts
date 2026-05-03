import { SEGMENTED_CHANGE_EVENT, SEGMENTED_OBSERVED_ATTRIBUTES } from "./constants/Segmented.constants";
import {
  getSegmentedOrientation,
  getSegmentedShape,
  getSegmentedSize,
  normalizeBooleanAttribute,
  parseSegmentedOptions
} from "./dom/Segmented.dom";
import {
  applySegmentedStyles,
  createSegmentedElements,
  syncSegmentedOptions,
  type SegmentedElements
} from "./Segmented.render";
import type {
  SegmentedChangeDetail,
  SegmentedOrientation,
  SegmentedOption,
  SegmentedShape,
  SegmentedSize
} from "./types/Segmented.types";

export class DsSegmented extends HTMLElement {
  static observedAttributes = SEGMENTED_OBSERVED_ATTRIBUTES;

  private elements?: SegmentedElements;
  private hasAppliedDefaultValue = false;
  private internalValue = "";

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get block() {
    return normalizeBooleanAttribute(this, "block", false);
  }

  set block(value: boolean) {
    this.toggleAttribute("block", value);
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? "";
  }

  set defaultValue(value: string) {
    this.setAttribute("default-value", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get name() {
    return this.getAttribute("name") || `ds-segmented-${Math.random().toString(36).slice(2)}`;
  }

  set name(value: string) {
    this.setAttribute("name", value);
  }

  get options(): SegmentedOption[] {
    return parseSegmentedOptions(this.getAttribute("options"));
  }

  set options(value: SegmentedOption[]) {
    this.setAttribute("options", JSON.stringify(value));
  }

  get orientation(): SegmentedOrientation {
    return getSegmentedOrientation(this);
  }

  set orientation(value: SegmentedOrientation) {
    this.setAttribute("orientation", value);
  }

  get shape(): SegmentedShape {
    return getSegmentedShape(this);
  }

  set shape(value: SegmentedShape) {
    this.setAttribute("shape", value);
  }

  get size(): SegmentedSize {
    return getSegmentedSize(this);
  }

  set size(value: SegmentedSize) {
    this.setAttribute("size", value);
  }

  get value() {
    if (this.hasAttribute("value")) {
      return this.getAttribute("value") ?? "";
    }

    return this.internalValue;
  }

  set value(value: string) {
    this.setValue(value, true);
  }

  private handleClick = (event: MouseEvent) => {
    const item = (event.target as Element | null)?.closest<HTMLButtonElement>(".ds-segmented__item");

    if (!item || item.disabled || this.disabled || !item.dataset.value) {
      return;
    }

    this.setValue(item.dataset.value, true);
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    const enabledItems = Array.from(
      this.elements?.rootElement.querySelectorAll<HTMLButtonElement>(".ds-segmented__item:not(:disabled)") ?? []
    );
    const currentIndex = enabledItems.findIndex((item) => item.dataset.value === this.value);

    if (enabledItems.length === 0) {
      return;
    }

    event.preventDefault();

    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? enabledItems.length - 1
          : (currentIndex + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) + enabledItems.length) %
            enabledItems.length;
    const nextItem = enabledItems[nextIndex];

    if (nextItem?.dataset.value) {
      this.setValue(nextItem.dataset.value, true);
      nextItem.focus();
    }
  };

  private render() {
    this.applyDefaultValue();

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    this.setAttribute("orientation", this.orientation);
    this.setAttribute("shape", this.shape);
    this.setAttribute("size", this.size);
    syncSegmentedOptions({
      disabled: this.disabled,
      name: this.name,
      options: this.options,
      rootElement: this.elements.rootElement,
      value: this.value
    });
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createSegmentedElements(this.handleClick, this.handleKeyDown);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applySegmentedStyles(shadowRoot);
  }

  private applyDefaultValue() {
    if (this.hasAppliedDefaultValue) {
      return;
    }

    const [firstOption] = this.options;

    this.internalValue = this.defaultValue || firstOption?.value || "";
    this.hasAppliedDefaultValue = true;
  }

  private setValue(value: string, emitChange: boolean) {
    const previousValue = this.value;

    this.internalValue = value;

    if (this.hasAttribute("value")) {
      this.setAttribute("value", value);
    }

    this.render();

    if (emitChange && previousValue !== value) {
      this.dispatchEvent(
        new CustomEvent<SegmentedChangeDetail>(SEGMENTED_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            value
          }
        })
      );
    }
  }
}
