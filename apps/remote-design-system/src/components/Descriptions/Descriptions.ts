import { DESCRIPTIONS_OBSERVED_ATTRIBUTES } from "./constants/Descriptions.constants";
import { DsDescriptionsItem } from "./DescriptionsItem";
import {
  getDescriptionsColumn,
  getDescriptionsLayout,
  getDescriptionsSize,
  normalizeBooleanAttribute
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
    this.itemObserver = undefined;
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

  get column() {
    return getDescriptionsColumn(this);
  }

  set column(value: number) {
    this.setAttributeIfChanged("column", String(value));
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

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    this.syncNullableAttribute("title", value);
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

    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("layout", this.layout);
    this.style.setProperty("--ds-descriptions-column", String(this.column));
    this.style.setProperty("--ds-descriptions-grid-column", String(this.bordered ? this.column * 2 : this.column));

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
    rootElement.setAttribute("part", "root");
    headerElement.setAttribute("part", "header");
    titleElement.setAttribute("part", "title");
    extraElement.setAttribute("part", "extra");
    bodyElement.setAttribute("part", "body");
    itemSlot.setAttribute("part", "items");

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
      attributeFilter: ["span"],
      attributes: true,
      childList: true,
      subtree: true
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
    const column = this.column;
    const config = {
      bordered: this.bordered,
      colon: this.colon,
      layout: this.layout,
      size: this.size
    };
    const itemSpans = this.getEffectiveItemSpans(this.items, column);

    for (const item of this.items) {
      item.syncFromParent(config, itemSpans.get(item) ?? 1);
    }
  }

  private getEffectiveItemSpans(items: DsDescriptionsItem[], column: number) {
    const spans = new Map<DsDescriptionsItem, number>();
    let rowItems: Array<{ item: DsDescriptionsItem; span: number }> = [];
    let rowSpan = 0;

    const commitRow = () => {
      if (rowItems.length === 0) {
        return;
      }

      if (rowSpan < column) {
        rowItems[rowItems.length - 1].span += column - rowSpan;
      }

      for (const rowItem of rowItems) {
        spans.set(rowItem.item, rowItem.span);
      }

      rowItems = [];
      rowSpan = 0;
    };

    for (const item of items) {
      const rawSpan = item.span;
      const remainingSpan = column - rowSpan;
      const nextSpan =
        rawSpan === "filled" ? Math.max(1, remainingSpan) : Math.min(rawSpan, Math.max(1, remainingSpan), column);

      rowItems.push({ item, span: nextSpan });
      rowSpan += nextSpan;

      if (rowSpan >= column || rawSpan === "filled") {
        commitRow();
      }
    }

    commitRow();

    return spans;
  }

  private syncNullableAttribute(name: string, value: string | null | undefined) {
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
