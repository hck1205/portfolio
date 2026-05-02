import { SPLITTER_PANEL_OBSERVED_ATTRIBUTES } from "./constants/Splitter.constants";
import { normalizeBooleanAttribute, normalizeSizeValue } from "./dom/Splitter.dom";
import { applySplitterPanelStyles, createSplitterPanelElements } from "./render/Splitter.render";

export class DsSplitterPanel extends HTMLElement {
  static observedAttributes = SPLITTER_PANEL_OBSERVED_ATTRIBUTES;

  private elements?: ReturnType<typeof createSplitterPanelElements>;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.syncAttributes();
  }

  get defaultSize(): string {
    return normalizeSizeValue(this.getAttribute("default-size"), "");
  }

  set defaultSize(value: number | string) {
    this.setAttribute("default-size", String(value));
  }

  get max(): string {
    return normalizeSizeValue(this.getAttribute("max"), "");
  }

  set max(value: number | string) {
    this.setAttribute("max", String(value));
  }

  get min(): string {
    return normalizeSizeValue(this.getAttribute("min"), "");
  }

  set min(value: number | string) {
    this.setAttribute("min", String(value));
  }

  get resizable() {
    return normalizeBooleanAttribute(this, "resizable", true);
  }

  set resizable(value: boolean) {
    this.setAttribute("resizable", String(value));
  }

  get size(): string {
    return normalizeSizeValue(this.getAttribute("size"), "");
  }

  set size(value: number | string) {
    this.setAttribute("size", String(value));
  }

  syncFromParent(size: string) {
    if (!size) {
      this.style.removeProperty("flex");
      return;
    }

    this.style.flex = `0 0 ${size}`;
  }

  private render() {
    if (!this.elements) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.elements = createSplitterPanelElements();
      shadowRoot.replaceChildren(this.elements.rootElement);
      applySplitterPanelStyles(shadowRoot);
    }

    this.syncAttributes();
  }

  private syncAttributes() {
    this.toggleAttribute("data-not-resizable", !this.resizable);
  }
}
