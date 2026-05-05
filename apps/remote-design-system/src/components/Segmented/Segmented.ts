import {
  SEGMENTED_CHANGE_EVENT,
  SEGMENTED_NAVIGATION_KEYS,
  SEGMENTED_OBSERVED_ATTRIBUTES
} from "./constants/Segmented.constants";
import {
  getSegmentedOrientation,
  getSegmentedShape,
  getSegmentedSize,
  normalizeBooleanAttribute,
  parseSegmentedOptions,
  syncAttribute
} from "./dom/Segmented.dom";
import {
  applySegmentedStyles,
  createSegmentedElements,
  syncSegmentedIndicator,
  syncSegmentedState,
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
  private generatedName = `ds-segmented-${Math.random().toString(36).slice(2)}`;
  private hasAppliedDefaultValue = false;
  private indicatorFrame?: number;
  private internalValue = "";
  private isSyncingHostAttributes = false;
  private resizeObserver?: ResizeObserver;

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.indicatorFrame) {
      window.cancelAnimationFrame(this.indicatorFrame);
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue || this.isSyncingHostAttributes) {
      return;
    }

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
    return this.getAttribute("name") || this.generatedName;
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
    if (!SEGMENTED_NAVIGATION_KEYS.includes(event.key as (typeof SEGMENTED_NAVIGATION_KEYS)[number])) {
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
    const options = this.options;

    this.applyDefaultValue(options);

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    this.syncHostAttributes();
    syncSegmentedState({
      disabled: this.disabled,
      elements: this.elements,
      name: this.name,
      options,
      value: this.value
    });
    this.syncIndicatorPosition();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createSegmentedElements(this.handleClick, this.handleKeyDown);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applySegmentedStyles(shadowRoot);
    this.resizeObserver = new ResizeObserver(() => this.syncIndicatorPosition());
    this.resizeObserver.observe(this.elements.rootElement);
  }

  private applyDefaultValue(options: SegmentedOption[]) {
    if (this.hasAppliedDefaultValue) {
      return;
    }

    const [firstOption] = options;

    this.internalValue = this.defaultValue || firstOption?.value || "";
    this.hasAppliedDefaultValue = true;
  }

  private setValue(value: string, emitChange: boolean) {
    const previousValue = this.value;

    if (previousValue === value) {
      return;
    }

    this.internalValue = value;

    if (this.hasAttribute("value")) {
      this.setAttributeFromInternalState("value", value);
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

  private syncIndicatorPosition() {
    if (!this.elements) {
      return;
    }

    if (this.indicatorFrame) {
      window.cancelAnimationFrame(this.indicatorFrame);
    }

    this.indicatorFrame = window.requestAnimationFrame(() => {
      this.indicatorFrame = undefined;

      if (this.elements) {
        syncSegmentedIndicator(this.elements);
      }
    });
  }

  private syncHostAttributes() {
    this.isSyncingHostAttributes = true;

    try {
      syncAttribute(this, "orientation", this.orientation);
      syncAttribute(this, "shape", this.shape);
      syncAttribute(this, "size", this.size);
    } finally {
      this.isSyncingHostAttributes = false;
    }
  }

  private setAttributeFromInternalState(name: string, value: string) {
    this.isSyncingHostAttributes = true;

    try {
      this.setAttribute(name, value);
    } finally {
      this.isSyncingHostAttributes = false;
    }
  }
}
