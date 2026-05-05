import { DESCRIPTIONS_ITEM_OBSERVED_ATTRIBUTES } from "./constants/Descriptions.constants";
import { getDescriptionsLayout, getDescriptionsSize, getDescriptionsSpan, normalizeBooleanAttribute } from "./dom/Descriptions.dom";
import { applyDescriptionsItemStyles } from "./Descriptions.render";
import type { DescriptionsItemConfig, DescriptionsLayout, DescriptionsSize } from "./types/Descriptions.types";

export class DsDescriptionsItem extends HTMLElement {
  static observedAttributes = DESCRIPTIONS_ITEM_OBSERVED_ATTRIBUTES;

  private labelElement?: HTMLSpanElement;
  private rootElement?: HTMLDivElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    this.render();
  }

  get bordered() {
    return normalizeBooleanAttribute(this, "bordered", false);
  }

  set bordered(value: boolean) {
    this.toggleAttribute("bordered", value);
  }

  get colon() {
    return normalizeBooleanAttribute(this, "colon", true);
  }

  set colon(value: boolean) {
    this.setAttributeIfChanged("colon", String(value));
  }

  get label() {
    return this.getAttribute("label") ?? "";
  }

  set label(value: string) {
    this.setAttributeIfChanged("label", value);
  }

  get layout(): DescriptionsLayout {
    return getDescriptionsLayout(this);
  }

  set layout(value: DescriptionsLayout) {
    this.setAttributeIfChanged("layout", value);
  }

  get size(): DescriptionsSize {
    return getDescriptionsSize(this);
  }

  set size(value: DescriptionsSize) {
    this.setAttributeIfChanged("size", value);
  }

  get span() {
    return getDescriptionsSpan(this);
  }

  set span(value: number | "filled") {
    this.setAttributeIfChanged("span", String(value));
  }

  syncFromParent(config: DescriptionsItemConfig, effectiveSpan: number) {
    this.toggleAttribute("bordered", config.bordered);
    this.setAttributeIfChanged("colon", String(config.colon));
    this.setAttributeIfChanged("layout", config.layout);
    this.setAttributeIfChanged("size", config.size);
    this.style.setProperty("--ds-descriptions-item-span", String(config.bordered ? effectiveSpan * 2 : effectiveSpan));
    this.style.setProperty("--ds-descriptions-item-content-span", String(Math.max(1, effectiveSpan * 2 - 1)));
    this.render();
  }

  private render() {
    if (!this.isConnected && !this.rootElement) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    if (!this.labelElement) {
      return;
    }

    this.labelElement.textContent = this.colon && !this.bordered && this.label ? `${this.label}:` : this.label;
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("div");
    const labelElement = document.createElement("span");
    const contentElement = document.createElement("span");
    const slotElement = document.createElement("slot");

    rootElement.className = "ds-descriptions-item";
    labelElement.className = "ds-descriptions-item__label";
    contentElement.className = "ds-descriptions-item__content";
    rootElement.setAttribute("part", "item");
    labelElement.setAttribute("part", "label");
    contentElement.setAttribute("part", "content");
    contentElement.append(slotElement);
    rootElement.append(labelElement, contentElement);
    shadowRoot.replaceChildren(rootElement);
    applyDescriptionsItemStyles(shadowRoot);

    this.rootElement = rootElement;
    this.labelElement = labelElement;
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
