import { BUTTON_CLICK_EVENT, BUTTON_OBSERVED_ATTRIBUTES } from "./constants/Button.constants";
import {
  getButtonColor,
  getButtonHtmlType,
  getButtonIconPlacement,
  getButtonShape,
  getButtonSize,
  getButtonType,
  getButtonVariant,
  normalizeBooleanAttribute,
  resolveButtonAppearance
} from "./dom/Button.dom";
import {
  applyButtonStyles,
  createButtonElements,
  syncButtonElements,
  type ButtonElements
} from "./Button.render";
import type {
  ButtonClickDetail,
  ButtonColor,
  ButtonHtmlType,
  ButtonIconPlacement,
  ButtonShape,
  ButtonSize,
  ButtonType,
  ButtonVariant
} from "./types/Button.types";

export class DsButton extends HTMLElement {
  static observedAttributes = BUTTON_OBSERVED_ATTRIBUTES;

  private elements?: ButtonElements;

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

  get color(): ButtonColor | undefined {
    return getButtonColor(this);
  }

  set color(value: ButtonColor | undefined) {
    this.syncNullableAttribute("color", value);
  }

  get danger() {
    return normalizeBooleanAttribute(this, "danger", false);
  }

  set danger(value: boolean) {
    this.toggleAttribute("danger", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get ghost() {
    return normalizeBooleanAttribute(this, "ghost", false);
  }

  set ghost(value: boolean) {
    this.toggleAttribute("ghost", value);
  }

  get href() {
    return this.getAttribute("href") ?? "";
  }

  set href(value: string) {
    this.syncNullableAttribute("href", value);
  }

  get htmlType(): ButtonHtmlType {
    return getButtonHtmlType(this);
  }

  set htmlType(value: ButtonHtmlType) {
    this.setAttribute("html-type", value);
  }

  get iconPlacement(): ButtonIconPlacement {
    return getButtonIconPlacement(this);
  }

  set iconPlacement(value: ButtonIconPlacement) {
    this.setAttribute("icon-placement", value);
  }

  get loading() {
    return normalizeBooleanAttribute(this, "loading", false);
  }

  set loading(value: boolean) {
    this.toggleAttribute("loading", value);
  }

  get shape(): ButtonShape {
    return getButtonShape(this);
  }

  set shape(value: ButtonShape) {
    this.setAttribute("shape", value);
  }

  get size(): ButtonSize {
    return getButtonSize(this);
  }

  set size(value: ButtonSize) {
    this.setAttribute("size", value);
  }

  get target() {
    return this.getAttribute("target") ?? "";
  }

  set target(value: string) {
    this.syncNullableAttribute("target", value);
  }

  get type(): ButtonType {
    return getButtonType(this);
  }

  set type(value: ButtonType) {
    this.setAttribute("type", value);
  }

  get variant(): ButtonVariant | undefined {
    return getButtonVariant(this);
  }

  set variant(value: ButtonVariant | undefined) {
    this.syncNullableAttribute("variant", value);
  }

  /**
   * Prevents unavailable actions and emits a typed design-system click event for host apps.
   */
  private handleClick = (event: Event) => {
    const nativeEvent = event as MouseEvent;

    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent<ButtonClickDetail>(BUTTON_CLICK_EVENT, {
        bubbles: true,
        detail: {
          href: this.href,
          loading: this.loading,
          nativeEvent
        }
      })
    );
  };

  /**
   * Initializes the shadow DOM once, then updates only attributes and slotted child order.
   */
  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncStructure();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createButtonElements({
      href: this.href,
      onClick: this.handleClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyButtonStyles(shadowRoot);
  }

  private syncAttributes() {
    const appearance = resolveButtonAppearance({
      color: this.color,
      danger: this.danger,
      type: this.type,
      variant: this.variant
    });

    this.setAttribute("size", this.size);
    this.setAttribute("shape", this.shape);
    this.setAttribute("icon-placement", this.iconPlacement);
    this.toggleAttribute("block", this.block);
    this.toggleAttribute("data-loading", this.loading);
    this.setAttribute("data-color", appearance.color);
    this.setAttribute("data-variant", appearance.variant);
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    this.elements = syncButtonElements({
      ariaLabel: this.getAttribute("aria-label") ?? "",
      disabled: this.disabled,
      elements: this.elements,
      href: this.href,
      htmlType: this.htmlType,
      iconPlacement: this.iconPlacement,
      loading: this.loading,
      onClick: this.handleClick,
      rel: this.getAttribute("rel") ?? "",
      target: this.target
    });
  }

  private syncNullableAttribute(name: string, value: string | undefined) {
    if (value) {
      this.setAttribute(name, value);
      return;
    }

    this.removeAttribute(name);
  }
}
