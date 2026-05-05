import { SPIN_OBSERVED_ATTRIBUTES } from "./constants/Spin.constants";
import { getDelay, getSpinSize, normalizeBooleanAttribute, syncNullableAttribute } from "./dom/Spin.dom";
import { SPIN_STYLES } from "./Spin.styles";
import type { SpinSize } from "./types/Spin.types";

let spinStyleSheet: CSSStyleSheet | undefined;

export class DsSpin extends HTMLElement {
  static observedAttributes = SPIN_OBSERVED_ATTRIBUTES;

  private delayTimer?: number;
  private indicatorElement?: HTMLDivElement;
  private rootElement?: HTMLDivElement;
  private shouldShow = true;
  private tipElement?: HTMLParagraphElement;

  connectedCallback() {
    this.render();
    this.syncDelay();
  }

  disconnectedCallback() {
    window.clearTimeout(this.delayTimer);
  }

  attributeChangedCallback() {
    this.render();
    this.syncDelay();
  }

  get delay() {
    return getDelay(this);
  }

  set delay(value: number) {
    this.setAttribute("delay", String(value));
  }

  get fullscreen() {
    return normalizeBooleanAttribute(this, "fullscreen", false);
  }

  set fullscreen(value: boolean) {
    this.toggleAttribute("fullscreen", value);
  }

  get size(): SpinSize {
    return getSpinSize(this);
  }

  set size(value: SpinSize) {
    this.setAttribute("size", value);
  }

  get spinning() {
    return normalizeBooleanAttribute(this, "spinning", true);
  }

  set spinning(value: boolean) {
    this.setAttribute("spinning", String(value));
  }

  get tip() {
    return this.getAttribute("tip") ?? "";
  }

  set tip(value: string) {
    syncNullableAttribute(this, "tip", value);
  }

  private render() {
    if (!this.isConnected && !this.rootElement) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    if (this.rootElement) {
      this.rootElement.dataset.size = this.size;
      this.rootElement.hidden = !this.spinning || !this.shouldShow;
      this.rootElement.setAttribute("role", "status");
      this.rootElement.setAttribute("aria-live", "polite");
    }
    if (this.tipElement) {
      this.tipElement.hidden = this.tip.length === 0;
      this.tipElement.textContent = this.tip;
    }
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("div");
    const indicatorElement = document.createElement("div");
    const tipElement = document.createElement("p");

    rootElement.className = "ds-spin";
    indicatorElement.className = "ds-spin__indicator";
    tipElement.className = "ds-spin__tip";
    rootElement.setAttribute("part", "root");
    indicatorElement.setAttribute("part", "indicator");
    tipElement.setAttribute("part", "tip");
    indicatorElement.setAttribute("aria-hidden", "true");
    rootElement.append(indicatorElement, tipElement);
    shadowRoot.replaceChildren(rootElement);
    applySpinStyles(shadowRoot);
    this.rootElement = rootElement;
    this.indicatorElement = indicatorElement;
    this.tipElement = tipElement;
  }

  private syncDelay() {
    window.clearTimeout(this.delayTimer);

    if (!this.spinning || this.delay === 0) {
      this.shouldShow = true;
      this.render();
      return;
    }

    this.shouldShow = false;
    this.render();
    this.delayTimer = window.setTimeout(() => {
      this.shouldShow = true;
      this.render();
    }, this.delay);
  }
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function applySpinStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    if (!spinStyleSheet) {
      spinStyleSheet = new CSSStyleSheet();
      spinStyleSheet.replaceSync(SPIN_STYLES);
    }

    if (!shadowRoot.adoptedStyleSheets.includes(spinStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, spinStyleSheet];
    }

    return;
  }

  const styleElement = document.createElement("style");

  styleElement.textContent = SPIN_STYLES;
  shadowRoot.prepend(styleElement);
}
