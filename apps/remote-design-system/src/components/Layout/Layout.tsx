import { LAYOUT_OBSERVED_ATTRIBUTES, LAYOUT_SIDER_ELEMENT_NAME } from "./constants/Layout.constants";
import { syncOptionalBooleanAttribute } from "./dom/Layout.dom";
import { applyLayoutStyles, createLayoutElements } from "./render/Layout.render";

export class DsLayout extends HTMLElement {
  static observedAttributes = LAYOUT_OBSERVED_ATTRIBUTES;

  private elements?: ReturnType<typeof createLayoutElements>;
  private childObserver?: MutationObserver;

  connectedCallback() {
    this.render();
    this.observeChildChanges();
  }

  disconnectedCallback() {
    this.childObserver?.disconnect();
  }

  attributeChangedCallback() {
    this.syncAttributes();
  }

  get hasSider() {
    return this.hasAttribute("has-sider");
  }

  set hasSider(value: boolean) {
    this.toggleAttribute("has-sider", value);
  }

  private render() {
    if (!this.elements) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.elements = createLayoutElements();
      shadowRoot.replaceChildren(this.elements.rootElement);
      applyLayoutStyles(shadowRoot, "layout");
    }

    this.syncAttributes();
  }

  private observeChildChanges() {
    if (this.childObserver) {
      return;
    }

    this.childObserver = new MutationObserver(() => {
      this.syncAttributes();
    });
    this.childObserver.observe(this, { childList: true });
  }

  private syncAttributes() {
    syncOptionalBooleanAttribute(this, "data-has-sider", this.containsDirectSider());
  }

  private containsDirectSider() {
    return Array.from(this.children).some((child) => child.localName === LAYOUT_SIDER_ELEMENT_NAME);
  }
}
