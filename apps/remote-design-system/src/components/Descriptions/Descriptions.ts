import { DESCRIPTIONS_OBSERVED_ATTRIBUTES } from "./constants/Descriptions.constants";
import { DsDescriptionsItem } from "./DescriptionsItem";
import {
  getDescriptionsColumn,
  getDescriptionsLayout,
  getDescriptionsSize,
  normalizeBooleanAttribute,
  syncNullableAttribute
} from "./dom/Descriptions.dom";
import { applyDescriptionsStyles } from "./Descriptions.render";
import type { DescriptionsLayout, DescriptionsSize } from "./types/Descriptions.types";

export class DsDescriptions extends HTMLElement {
  static observedAttributes = DESCRIPTIONS_OBSERVED_ATTRIBUTES;

  private extraSlot?: HTMLSlotElement;
  private headerElement?: HTMLElement;
  private itemObserver?: MutationObserver;
  private rootElement?: HTMLDivElement;
  private titleElement?: HTMLSpanElement;
  private titleSlot?: HTMLSlotElement;

  connectedCallback() {
    this.render();
    this.observeItems();
  }

  disconnectedCallback() {
    this.itemObserver?.disconnect();
  }

  attributeChangedCallback() {
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
    this.setAttribute("colon", String(value));
  }

  get column() {
    return getDescriptionsColumn(this);
  }

  set column(value: number) {
    this.setAttribute("column", String(value));
  }

  get layout(): DescriptionsLayout {
    return getDescriptionsLayout(this);
  }

  set layout(value: DescriptionsLayout) {
    this.setAttribute("layout", value);
  }

  get size(): DescriptionsSize {
    return getDescriptionsSize(this);
  }

  set size(value: DescriptionsSize) {
    this.setAttribute("size", value);
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  private get items() {
    return Array.from(this.children).filter(
      (child): child is DsDescriptionsItem => child.localName === "ds-descriptions-item"
    );
  }

  private render() {
    if (!this.isConnected && !this.rootElement) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    this.setAttribute("size", this.size);
    this.setAttribute("layout", this.layout);
    this.style.setProperty("--ds-descriptions-column", String(this.column));

    if (this.titleElement) {
      this.titleElement.textContent = this.title;
    }

    this.syncHeader();
    this.syncItems();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("div");
    const headerElement = document.createElement("header");
    const titleWrapElement = document.createElement("div");
    const titleElement = document.createElement("span");
    const titleSlot = document.createElement("slot");
    const extraElement = document.createElement("div");
    const extraSlot = document.createElement("slot");
    const bodyElement = document.createElement("div");
    const itemSlot = document.createElement("slot");

    rootElement.className = "ds-descriptions";
    headerElement.className = "ds-descriptions__header";
    titleWrapElement.className = "ds-descriptions__title-wrap";
    titleElement.className = "ds-descriptions__title";
    titleSlot.name = "title";
    extraElement.className = "ds-descriptions__extra";
    extraSlot.name = "extra";
    bodyElement.className = "ds-descriptions__body";
    itemSlot.className = "ds-descriptions__items";

    titleWrapElement.append(titleElement, titleSlot);
    extraElement.append(extraSlot);
    headerElement.append(titleWrapElement, extraElement);
    bodyElement.append(itemSlot);
    rootElement.append(headerElement, bodyElement);
    shadowRoot.replaceChildren(rootElement);
    applyDescriptionsStyles(shadowRoot);

    titleSlot.addEventListener("slotchange", () => this.syncHeader());
    extraSlot.addEventListener("slotchange", () => this.syncHeader());

    this.extraSlot = extraSlot;
    this.headerElement = headerElement;
    this.rootElement = rootElement;
    this.titleElement = titleElement;
    this.titleSlot = titleSlot;
  }

  private observeItems() {
    if (this.itemObserver) {
      return;
    }

    this.itemObserver = new MutationObserver(() => this.syncItems());
    this.itemObserver.observe(this, {
      childList: true
    });
  }

  private syncHeader() {
    if (!this.headerElement || !this.titleSlot || !this.extraSlot) {
      return;
    }

    const hasTitle = this.title.length > 0 || this.titleSlot.assignedElements().length > 0;
    const hasExtra = this.extraSlot.assignedElements().length > 0;

    this.headerElement.hidden = !hasTitle && !hasExtra;
  }

  private syncItems() {
    const config = {
      bordered: this.bordered,
      colon: this.colon,
      layout: this.layout,
      size: this.size
    };

    for (const item of this.items) {
      item.syncFromParent(config, this.column);
    }
  }
}
