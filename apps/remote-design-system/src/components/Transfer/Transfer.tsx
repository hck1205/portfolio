import { ChevronLeft, ChevronRight, createElement as createLucideElement } from "lucide";

import {
  TRANSFER_CHANGE_EVENT,
  TRANSFER_OBSERVED_ATTRIBUTES,
  TRANSFER_SEARCH_EVENT,
  TRANSFER_SELECT_CHANGE_EVENT
} from "./constants/Transfer.constants";
import {
  filterTransferItems,
  formatKeyList,
  getTransferStatus,
  normalizeBooleanAttribute,
  parseKeyList,
  parseTransferItems,
  parseTransferTitles
} from "./dom/Transfer.dom";
import { applyTransferStyles } from "./Transfer.styles";
import type {
  TransferChangeDetail,
  TransferDirection,
  TransferItem,
  TransferSearchDetail,
  TransferSelectChangeDetail,
  TransferStatus
} from "./types/Transfer.types";

export class DsTransfer extends HTMLElement {
  static observedAttributes = TRANSFER_OBSERVED_ATTRIBUTES;

  private leftSearchValue = "";
  private rightSearchValue = "";
  private rootElement?: HTMLDivElement;
  private sourceSelectedKeys = new Set<string>();
  private targetSelectedKeys = new Set<string>();

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get dataSource() {
    return parseTransferItems(this.getAttribute("data-source"));
  }

  set dataSource(value: TransferItem[]) {
    this.setAttribute("data-source", JSON.stringify(value));
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get oneWay() {
    return normalizeBooleanAttribute(this, "one-way", false);
  }

  set oneWay(value: boolean) {
    this.toggleAttribute("one-way", value);
  }

  get showSearch() {
    return normalizeBooleanAttribute(this, "show-search", false);
  }

  set showSearch(value: boolean) {
    this.toggleAttribute("show-search", value);
  }

  get showSelectAll() {
    return normalizeBooleanAttribute(this, "show-select-all", true);
  }

  set showSelectAll(value: boolean) {
    this.setAttribute("show-select-all", String(value));
  }

  get status(): TransferStatus | undefined {
    return getTransferStatus(this);
  }

  set status(value: TransferStatus | undefined) {
    this.syncNullableAttribute("status", value ?? "");
  }

  get targetKeys() {
    return Array.from(this.targetKeySet);
  }

  set targetKeys(value: Set<string> | string[]) {
    this.setAttribute("target-keys", formatKeyList(value));
  }

  private get sourceItems() {
    const targetKeys = this.targetKeySet;

    return this.dataSource.filter((item) => !targetKeys.has(item.key));
  }

  private get targetItems() {
    const targetKeys = this.targetKeySet;

    return this.dataSource.filter((item) => targetKeys.has(item.key));
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.rootElement = document.createElement("div");
      this.rootElement.className = "ds-transfer";
      shadowRoot.replaceChildren(this.rootElement);
      applyTransferStyles(shadowRoot);
    }

    this.syncAttributes();
    this.rootElement.replaceChildren(
      this.createList("left", this.sourceItems, this.sourceSelectedKeys, this.leftSearchValue),
      this.createActions(),
      this.createList("right", this.targetItems, this.targetSelectedKeys, this.rightSearchValue)
    );
  }

  private syncAttributes() {
    const status = this.status;

    if (status) {
      this.setAttributeIfChanged("status", status);
    } else {
      this.removeAttribute("status");
    }
  }

  private createList(direction: TransferDirection, items: TransferItem[], selectedKeys: Set<string>, searchValue: string) {
    const [leftTitle, rightTitle] = parseTransferTitles(this.getAttribute("titles"));
    const section = document.createElement("section");
    const header = document.createElement("header");
    const title = document.createElement("span");
    const count = document.createElement("span");
    const list = document.createElement("ul");
    const filteredItems = filterTransferItems(items, searchValue);

    section.className = "ds-transfer__list";
    header.className = "ds-transfer__header";
    title.className = "ds-transfer__title";
    title.textContent = direction === "left" ? leftTitle : rightTitle;
    count.className = "ds-transfer__count";
    count.textContent = `${selectedKeys.size}/${items.length}`;
    header.append(this.createSelectAll(direction, filteredItems, selectedKeys), title, count);
    list.className = "ds-transfer__items";
    list.append(
      ...(filteredItems.length
        ? filteredItems.map((item) => this.createItem(direction, item, selectedKeys.has(item.key)))
        : [this.createEmptyItem()])
    );
    section.append(header, this.createSearch(direction, searchValue), list);

    return section;
  }

  private createSelectAll(direction: TransferDirection, items: TransferItem[], selectedKeys: Set<string>) {
    const checkbox = document.createElement("input");
    const enabledKeys = items.filter((item) => !item.disabled).map((item) => item.key);

    checkbox.type = "checkbox";
    checkbox.disabled = this.disabled || !this.showSelectAll || enabledKeys.length === 0;
    checkbox.checked = enabledKeys.length > 0 && enabledKeys.every((key) => selectedKeys.has(key));
    checkbox.addEventListener("change", () => {
      const nextChecked = checkbox.checked;

      enabledKeys.forEach((key) => {
        if (nextChecked) {
          selectedKeys.add(key);
        } else {
          selectedKeys.delete(key);
        }
      });
      this.dispatchSelectChange();
      this.render();
    });

    return checkbox;
  }

  private createSearch(direction: TransferDirection, value: string) {
    const wrapper = document.createElement("div");
    const input = document.createElement("input");

    wrapper.className = "ds-transfer__search";
    wrapper.hidden = !this.showSearch;
    input.className = "ds-transfer__search-input";
    input.placeholder = "Search here";
    input.value = value;
    input.addEventListener("input", () => {
      if (direction === "left") {
        this.leftSearchValue = input.value;
      } else {
        this.rightSearchValue = input.value;
      }

      this.dispatchEvent(
        new CustomEvent<TransferSearchDetail>(TRANSFER_SEARCH_EVENT, {
          bubbles: true,
          detail: { direction, value: input.value }
        })
      );
      this.render();
    });
    wrapper.append(input);

    return wrapper;
  }

  private createItem(direction: TransferDirection, item: TransferItem, checked: boolean) {
    const row = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const title = document.createElement("span");
    const description = document.createElement("span");
    const selectedKeys = direction === "left" ? this.sourceSelectedKeys : this.targetSelectedKeys;

    row.className = "ds-transfer__item";
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.disabled = this.disabled || Boolean(item.disabled);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedKeys.add(item.key);
      } else {
        selectedKeys.delete(item.key);
      }

      this.dispatchSelectChange();
      this.render();
    });
    title.className = "ds-transfer__item-title";
    title.textContent = item.title;
    description.className = "ds-transfer__item-description";
    description.textContent = item.description ?? "";
    description.hidden = !item.description;
    label.append(title, description);
    row.append(checkbox, label);

    return row;
  }

  private createEmptyItem() {
    const item = document.createElement("li");

    item.className = "ds-transfer__empty";
    item.textContent = "No data";

    return item;
  }

  private createActions() {
    const actions = document.createElement("div");
    const toRight = this.createAction("right");
    const toLeft = this.createAction("left");

    actions.className = "ds-transfer__actions";
    actions.append(toRight);

    if (!this.oneWay) {
      actions.append(toLeft);
    }

    return actions;
  }

  private createAction(direction: TransferDirection) {
    const button = document.createElement("button");
    const selectedKeys = direction === "right" ? this.sourceSelectedKeys : this.targetSelectedKeys;

    button.className = "ds-transfer__action";
    button.type = "button";
    button.disabled = this.disabled || selectedKeys.size === 0;
    button.setAttribute("aria-label", direction === "right" ? "Move selected items to target" : "Move selected items to source");
    button.append(
      createLucideElement(direction === "right" ? ChevronRight : ChevronLeft, {
        "aria-hidden": "true",
        focusable: "false",
        height: 16,
        width: 16,
        "stroke-width": 2
      })
    );
    button.addEventListener("click", () => this.moveSelected(direction));

    return button;
  }

  private moveSelected(direction: TransferDirection) {
    const targetKeys = this.targetKeySet;
    const moveKeys = Array.from(direction === "right" ? this.sourceSelectedKeys : this.targetSelectedKeys);

    if (direction === "right") {
      moveKeys.forEach((key) => targetKeys.add(key));
      this.sourceSelectedKeys.clear();
    } else {
      moveKeys.forEach((key) => targetKeys.delete(key));
      this.targetSelectedKeys.clear();
    }

    this.targetKeys = targetKeys;
    this.dispatchEvent(
      new CustomEvent<TransferChangeDetail>(TRANSFER_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          direction,
          moveKeys,
          targetKeys: Array.from(targetKeys)
        }
      })
    );
    this.dispatchSelectChange();
    this.render();
  }

  private dispatchSelectChange() {
    this.dispatchEvent(
      new CustomEvent<TransferSelectChangeDetail>(TRANSFER_SELECT_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          sourceSelectedKeys: Array.from(this.sourceSelectedKeys),
          targetSelectedKeys: Array.from(this.targetSelectedKeys)
        }
      })
    );
  }

  private syncNullableAttribute(name: string, value: string) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }

  private get targetKeySet() {
    return parseKeyList(this.getAttribute("target-keys"));
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
