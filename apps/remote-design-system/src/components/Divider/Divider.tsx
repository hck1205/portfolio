import { DIVIDER_OBSERVED_ATTRIBUTES } from "./constants/Divider.constants";
import {
  colorTokenToCssVariable,
  getDividerOrientation,
  getDividerSize,
  getDividerTitlePlacement,
  getDividerVariant,
  normalizeBooleanAttribute,
  normalizeOrientationMargin
} from "./dom/Divider.dom";
import {
  applyDividerStyles,
  createDividerElements,
  hasDividerContent,
  type DividerElements
} from "./Divider.render";
import type {
  DividerOrientation,
  DividerSize,
  DividerTitlePlacement,
  DividerVariant
} from "./types/Divider.types";

export class DsDivider extends HTMLElement {
  static observedAttributes = DIVIDER_OBSERVED_ATTRIBUTES;

  private elements?: DividerElements;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get dashed() {
    return normalizeBooleanAttribute(this, "dashed", false);
  }

  get color() {
    return this.getAttribute("color") ?? "";
  }

  set color(value: string) {
    this.syncNullableAttribute("color", value);
  }

  get colorToken() {
    return this.getAttribute("color-token") ?? "";
  }

  set colorToken(value: string) {
    this.syncNullableAttribute("color-token", value);
  }

  set dashed(value: boolean) {
    this.toggleAttribute("dashed", value);
  }

  get orientation(): DividerOrientation {
    return getDividerOrientation(this);
  }

  set orientation(value: DividerOrientation) {
    this.setAttribute("orientation", value);
  }

  get orientationMargin() {
    return this.getAttribute("orientation-margin") ?? "";
  }

  set orientationMargin(value: string) {
    this.syncNullableAttribute("orientation-margin", value);
  }

  get plain() {
    return normalizeBooleanAttribute(this, "plain", false);
  }

  set plain(value: boolean) {
    this.toggleAttribute("plain", value);
  }

  get size(): DividerSize {
    return getDividerSize(this);
  }

  set size(value: DividerSize) {
    this.setAttribute("size", value);
  }

  get titlePlacement(): DividerTitlePlacement {
    return getDividerTitlePlacement(this);
  }

  set titlePlacement(value: DividerTitlePlacement) {
    this.setAttribute("title-placement", value);
  }

  get variant(): DividerVariant {
    return getDividerVariant(this);
  }

  set variant(value: DividerVariant) {
    this.setAttribute("variant", value);
  }

  get vertical() {
    return normalizeBooleanAttribute(this, "vertical", false);
  }

  set vertical(value: boolean) {
    this.toggleAttribute("vertical", value);
  }

  /**
   * Keeps separator semantics and slot-driven title state in sync.
   */
  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncContentState();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createDividerElements({
      onSlotChange: this.syncContentState
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyDividerStyles(shadowRoot);
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    const { rootElement } = this.elements;
    const orientationMargin = normalizeOrientationMargin(this.orientationMargin);
    const color = this.color || colorTokenToCssVariable(this.colorToken);

    rootElement.setAttribute("aria-orientation", this.orientation);
    this.setAttributeIfChanged("data-orientation", this.orientation);
    this.setAttributeIfChanged("data-size", this.size);
    this.setAttributeIfChanged("data-title-placement", this.titlePlacement);
    this.setAttributeIfChanged("data-variant", this.variant);
    this.toggleAttributeIfChanged("vertical", this.orientation === "vertical");

    if (orientationMargin) {
      this.style.setProperty("--ds-divider-title-margin", orientationMargin);
    } else {
      this.style.removeProperty("--ds-divider-title-margin");
    }

    if (color) {
      this.style.setProperty("--ds-divider-border-color", color);
    } else {
      this.style.removeProperty("--ds-divider-border-color");
    }
  }

  private syncContentState = () => {
    if (!this.elements) {
      return;
    }

    const hasContent = hasDividerContent(this.elements.contentSlotElement);

    this.toggleAttributeIfChanged("data-empty", !hasContent || this.orientation === "vertical");
    this.elements.contentSlotElement.hidden = !hasContent || this.orientation === "vertical";
  };

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
