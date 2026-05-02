import {
  FLOAT_BUTTON_CLICK_EVENT,
  FLOAT_BUTTON_OBSERVED_ATTRIBUTES
} from "./constants/FloatButton.constants";
import {
  getFloatButtonHtmlType,
  getFloatButtonShape,
  getFloatButtonType,
  getFloatButtonVisibilityHeight,
  normalizeBooleanAttribute
} from "./dom/FloatButton.dom";
import {
  applyFloatButtonStyles,
  createFloatButtonElements,
  syncFloatButtonElements,
  type FloatButtonElements
} from "./FloatButton.render";
import type {
  FloatButtonClickDetail,
  FloatButtonHtmlType,
  FloatButtonShape,
  FloatButtonType
} from "./types/FloatButton.types";

export class DsFloatButton extends HTMLElement {
  static observedAttributes = FLOAT_BUTTON_OBSERVED_ATTRIBUTES;

  private elements?: FloatButtonElements;
  private prefersHiddenForBackTop = false;

  connectedCallback() {
    this.render();
    this.syncBackTopVisibility();
    window.addEventListener("scroll", this.handleWindowScroll, { passive: true });
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleWindowScroll);
  }

  attributeChangedCallback() {
    this.render();
    this.syncBackTopVisibility();
  }

  get backTop() {
    return normalizeBooleanAttribute(this, "back-top", false);
  }

  set backTop(value: boolean) {
    this.toggleAttribute("back-top", value);
  }

  get badge() {
    return this.getAttribute("badge") ?? "";
  }

  set badge(value: string) {
    this.syncNullableAttribute("badge", value);
  }

  get content() {
    return this.getAttribute("content") ?? "";
  }

  set content(value: string) {
    this.syncNullableAttribute("content", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get href() {
    return this.getAttribute("href") ?? "";
  }

  set href(value: string) {
    this.syncNullableAttribute("href", value);
  }

  get htmlType(): FloatButtonHtmlType {
    return getFloatButtonHtmlType(this);
  }

  set htmlType(value: FloatButtonHtmlType) {
    this.setAttribute("html-type", value);
  }

  get shape(): FloatButtonShape {
    return getFloatButtonShape(this);
  }

  set shape(value: FloatButtonShape) {
    this.setAttribute("shape", value);
  }

  get target() {
    return this.getAttribute("target") ?? "";
  }

  set target(value: string) {
    this.syncNullableAttribute("target", value);
  }

  get tooltip() {
    return this.getAttribute("tooltip") ?? "";
  }

  set tooltip(value: string) {
    this.syncNullableAttribute("tooltip", value);
  }

  get type(): FloatButtonType {
    return getFloatButtonType(this);
  }

  set type(value: FloatButtonType) {
    this.setAttribute("type", value);
  }

  get visibilityHeight() {
    return getFloatButtonVisibilityHeight(this);
  }

  set visibilityHeight(value: number) {
    this.setAttribute("visibility-height", String(value));
  }

  /**
   * Blocks unavailable actions, handles BackTop, and emits a typed DS click event.
   */
  private handleClick = (event: Event) => {
    const nativeEvent = event as MouseEvent;

    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (this.backTop) {
      event.preventDefault();
      window.scrollTo({ behavior: "smooth", top: 0 });
    }

    this.dispatchEvent(
      new CustomEvent<FloatButtonClickDetail>(FLOAT_BUTTON_CLICK_EVENT, {
        bubbles: true,
        detail: {
          backTop: this.backTop,
          href: this.href,
          nativeEvent
        }
      })
    );
  };

  private handleWindowScroll = () => {
    this.syncBackTopVisibility();
  };

  /**
   * Creates the shadow DOM once and then syncs only attributes and control state.
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

    this.elements = createFloatButtonElements({
      href: this.href,
      onClick: this.handleClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyFloatButtonStyles(shadowRoot);
  }

  private syncAttributes() {
    this.setAttributeIfChanged("shape", this.shape);
    this.setAttributeIfChanged("type", this.type);
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    this.elements = syncFloatButtonElements({
      ariaLabel: this.getAttribute("aria-label") ?? "",
      backTop: this.backTop,
      badge: this.badge,
      content: this.content,
      disabled: this.disabled,
      elements: this.elements,
      href: this.href,
      htmlType: this.htmlType,
      onClick: this.handleClick,
      rel: this.getAttribute("rel") ?? "",
      target: this.target,
      tooltip: this.tooltip
    });
  }

  private syncBackTopVisibility() {
    const shouldHide = this.backTop && window.scrollY < this.visibilityHeight;

    if (shouldHide !== this.prefersHiddenForBackTop) {
      this.prefersHiddenForBackTop = shouldHide;
      this.toggleAttribute("hidden", shouldHide);
    }
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
