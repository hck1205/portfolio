import { ChevronDown, Eraser, createElement as createLucideElement } from "lucide";

import {
  TREE_SELECT_CHANGE_EVENT,
  TREE_SELECT_OBSERVED_ATTRIBUTES,
  TREE_SELECT_OPEN_CHANGE_EVENT,
  TREE_SELECT_SEARCH_EVENT
} from "./constants/TreeSelect.constants";
import {
  filterTree,
  flattenTree,
  formatValueList,
  getSelectedLabels,
  getTreeSelectPlacement,
  getTreeSelectSize,
  getTreeSelectStatus,
  getTreeSelectVariant,
  normalizeBooleanAttribute,
  parseTreeData,
  parseValueList
} from "./dom/TreeSelect.dom";
import { applyTreeSelectStyles } from "./TreeSelect.styles";
import type {
  TreeSelectChangeDetail,
  TreeSelectNode,
  TreeSelectOpenChangeDetail,
  TreeSelectPlacement,
  TreeSelectSearchDetail,
  TreeSelectSize,
  TreeSelectStatus,
  TreeSelectVariant
} from "./types/TreeSelect.types";

export class DsTreeSelect extends HTMLElement {
  static observedAttributes = TREE_SELECT_OBSERVED_ATTRIBUTES;

  private documentListenerAttached = false;
  private hasAppliedDefaultValue = false;
  private rootElement?: HTMLDivElement;
  private searchValue = "";

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.detachDocumentListener();
  }

  attributeChangedCallback() {
    this.render();
  }

  get allowClear() {
    return normalizeBooleanAttribute(this, "allow-clear", false);
  }

  set allowClear(value: boolean) {
    this.setAttribute("allow-clear", String(value));
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get multiple() {
    return normalizeBooleanAttribute(this, "multiple", false);
  }

  set multiple(value: boolean) {
    this.toggleAttribute("multiple", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get placeholder() {
    return this.getAttribute("placeholder") ?? "Please select";
  }

  set placeholder(value: string) {
    this.syncNullableAttribute("placeholder", value);
  }

  get placement(): TreeSelectPlacement {
    return getTreeSelectPlacement(this);
  }

  set placement(value: TreeSelectPlacement) {
    this.setAttribute("placement", value);
  }

  get showSearch() {
    return normalizeBooleanAttribute(this, "show-search", this.multiple);
  }

  set showSearch(value: boolean) {
    this.setAttribute("show-search", String(value));
  }

  get size(): TreeSelectSize {
    return getTreeSelectSize(this);
  }

  set size(value: TreeSelectSize) {
    this.setAttribute("size", value);
  }

  get status(): TreeSelectStatus | undefined {
    return getTreeSelectStatus(this);
  }

  set status(value: TreeSelectStatus | undefined) {
    this.syncNullableAttribute("status", value ?? "");
  }

  get treeData() {
    return parseTreeData(this.getAttribute("tree-data"));
  }

  set treeData(value: TreeSelectNode[]) {
    this.setAttribute("tree-data", JSON.stringify(value));
  }

  get value() {
    const values = parseValueList(this.getAttribute("value"));

    return this.multiple ? values : values[0] ?? "";
  }

  set value(value: string | string[]) {
    this.setValue(Array.isArray(value) ? value : [value], true);
  }

  get variant(): TreeSelectVariant {
    return getTreeSelectVariant(this);
  }

  set variant(value: TreeSelectVariant) {
    this.setAttribute("variant", value);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.rootElement = document.createElement("div");
      this.rootElement.className = "ds-tree-select";
      shadowRoot.replaceChildren(this.rootElement);
      applyTreeSelectStyles(shadowRoot);
    }

    this.syncAttributes();
    this.rootElement.replaceChildren(this.createField(), this.createPopup());
    this.syncDocumentListener();
  }

  private syncAttributes() {
    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.applyDefaultValue();

    if (this.disabled && this.open) {
      this.setOpen(false);
    }
  }

  private createField() {
    const field = document.createElement("div");
    const value = document.createElement("div");
    const clearButton = document.createElement("button");
    const arrow = document.createElement("span");
    const labels = getSelectedLabels(this.treeData, this.selectedValues);

    field.className = "ds-tree-select__field";
    field.tabIndex = this.disabled ? -1 : 0;
    field.addEventListener("click", () => this.setOpen(true));
    field.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === "ArrowDown") {
        event.preventDefault();
        this.setOpen(true);
      }

      if (event.key === "Escape") {
        this.setOpen(false);
      }
    });
    value.className = "ds-tree-select__value";

    if (labels.length) {
      value.append(...labels.map((label) => this.createTag(label)));
    } else {
      const placeholder = document.createElement("span");

      placeholder.className = "ds-tree-select__placeholder";
      placeholder.textContent = this.placeholder;
      value.append(placeholder);
    }

    clearButton.className = "ds-tree-select__clear";
    clearButton.type = "button";
    clearButton.hidden = !this.allowClear || labels.length === 0 || this.disabled;
    clearButton.setAttribute("aria-label", "Clear selected tree values");
    clearButton.append(this.createIcon(Eraser));
    clearButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.setValue([], true);
      this.setOpen(false);
    });
    arrow.className = "ds-tree-select__arrow";
    arrow.append(this.createIcon(ChevronDown));
    field.append(value, clearButton, arrow);

    return field;
  }

  private createPopup() {
    const popup = document.createElement("div");
    const tree = document.createElement("ul");
    const filteredNodes = filterTree(this.treeData, this.searchValue);
    const visibleNodes = flattenTree(filteredNodes);

    popup.className = "ds-tree-select__popup";
    popup.hidden = !this.open;
    tree.className = "ds-tree-select__tree";

    if (this.showSearch) {
      popup.append(this.createSearch());
    }

    tree.append(
      ...(visibleNodes.length
        ? visibleNodes.map((node) => this.createNode(node))
        : [this.createEmptyNode()])
    );
    popup.append(tree);

    return popup;
  }

  private createSearch() {
    const input = document.createElement("input");

    input.className = "ds-tree-select__search";
    input.placeholder = "Search";
    input.value = this.searchValue;
    input.addEventListener("input", () => {
      this.searchValue = input.value;
      this.dispatchEvent(
        new CustomEvent<TreeSelectSearchDetail>(TREE_SELECT_SEARCH_EVENT, {
          bubbles: true,
          detail: { value: this.searchValue }
        })
      );
      this.render();
    });

    return input;
  }

  private createNode(node: TreeSelectNode & { depth: number }) {
    const item = document.createElement("li");
    const control = document.createElement("input");
    const label = document.createElement("span");
    const selectedValues = new Set(this.selectedValues);

    item.className = "ds-tree-select__node";
    item.style.paddingInlineStart = `calc(var(--spacing-ds-2) + ${node.depth} * var(--spacing-ds-4))`;
    control.type = this.multiple ? "checkbox" : "radio";
    control.name = "tree-select-value";
    control.checked = selectedValues.has(node.value);
    control.disabled = this.disabled || Boolean(node.disabled);
    control.addEventListener("change", () => {
      if (this.multiple) {
        if (control.checked) {
          selectedValues.add(node.value);
        } else {
          selectedValues.delete(node.value);
        }

        this.setValue(Array.from(selectedValues), true);
        return;
      }

      this.setValue([node.value], true);
      this.setOpen(false);
    });
    label.className = "ds-tree-select__node-label";
    label.textContent = node.label;
    item.append(control, label);

    return item;
  }

  private createEmptyNode() {
    const item = document.createElement("li");

    item.className = "ds-tree-select__empty";
    item.textContent = "Not Found";

    return item;
  }

  private createTag(label: string) {
    const tag = document.createElement("span");

    tag.className = "ds-tree-select__tag";
    tag.textContent = label;

    return tag;
  }

  private createIcon(icon: Parameters<typeof createLucideElement>[0]) {
    return createLucideElement(icon, {
      "aria-hidden": "true",
      focusable: "false",
      height: 14,
      width: 14,
      "stroke-width": 2
    });
  }

  private setOpen(open: boolean) {
    if (this.open === open || this.disabled) {
      return;
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<TreeSelectOpenChangeDetail>(TREE_SELECT_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: { open }
      })
    );
  }

  private setValue(values: string[], emitChange: boolean) {
    const normalizedValues = this.multiple ? values : values.slice(0, 1);
    const previousValue = this.getAttribute("value") ?? "";

    if (normalizedValues.length) {
      this.setAttributeIfChanged("value", formatValueList(normalizedValues));
    } else {
      this.removeAttribute("value");
    }

    if (emitChange && previousValue !== (this.getAttribute("value") ?? "")) {
      this.dispatchEvent(
        new CustomEvent<TreeSelectChangeDetail>(TREE_SELECT_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            labels: getSelectedLabels(this.treeData, normalizedValues),
            value: this.multiple ? normalizedValues : normalizedValues[0] ?? ""
          }
        })
      );
    }

    this.render();
  }

  private get selectedValues() {
    return parseValueList(this.getAttribute("value"));
  }

  private applyDefaultValue() {
    const defaultValue = this.getAttribute("default-value") ?? "";

    if (this.hasAppliedDefaultValue || this.hasAttribute("value") || !defaultValue) {
      return;
    }

    this.hasAppliedDefaultValue = true;
    this.setAttributeIfChanged("value", defaultValue);
  }

  private syncDocumentListener() {
    if (this.open && !this.documentListenerAttached) {
      document.addEventListener("pointerdown", this.handleDocumentPointerDown);
      this.documentListenerAttached = true;
      return;
    }

    if (!this.open) {
      this.detachDocumentListener();
    }
  }

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }

    this.setOpen(false);
  };

  private detachDocumentListener() {
    if (!this.documentListenerAttached) {
      return;
    }

    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.documentListenerAttached = false;
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
