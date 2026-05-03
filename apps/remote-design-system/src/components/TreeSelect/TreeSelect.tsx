import { ChevronDown, ChevronRight, Eraser, X, createElement as createLucideElement } from "lucide";

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
  private expandedValues = new Set<string>();
  private hasAppliedDefaultExpandedValues = false;
  private hasAppliedDefaultValue = false;
  private rootElement?: HTMLDivElement;
  private searchValue = "";

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.detachDocumentListener();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    if (name === "tree-data") {
      this.expandedValues.clear();
      this.hasAppliedDefaultExpandedValues = false;
    }

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
    const selectedValues = this.selectedValues;
    const labels = getSelectedLabels(this.treeData, selectedValues);
    const selectedNodesByValue = new Map(flattenTree(this.treeData).map((node) => [node.value, node]));

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

    if (labels.length && this.multiple) {
      value.append(
        ...selectedValues
          .flatMap((selectedValue) => {
            const node = selectedNodesByValue.get(selectedValue);

            return node ? [node] : [];
          })
          .map((node) => this.createTag(node.label, node.value))
      );
    } else if (labels.length) {
      const selectedLabel = document.createElement("span");

      selectedLabel.className = "ds-tree-select__selected-text";
      selectedLabel.textContent = labels[0];
      value.append(selectedLabel);
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

    popup.className = "ds-tree-select__popup";
    popup.hidden = !this.open;
    tree.className = "ds-tree-select__tree";

    if (!this.hasAppliedDefaultExpandedValues) {
      this.applyDefaultExpandedValues(filteredNodes);
      this.hasAppliedDefaultExpandedValues = true;
    }

    if (this.showSearch) {
      popup.append(this.createSearch());
    }

    tree.append(
      ...(filteredNodes.length
        ? this.createTreeNodes(filteredNodes)
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

  private createTreeNodes(nodes: TreeSelectNode[], depth = 0): HTMLLIElement[] {
    return nodes.flatMap((node) => {
      const item = this.createNode(node, depth);
      const children = node.children ?? [];
      const shouldRenderChildren = this.searchValue || this.expandedValues.has(node.value);

      if (!children.length || !shouldRenderChildren) {
        return [item];
      }

      return [item, ...this.createTreeNodes(children, depth + 1)];
    });
  }

  private createNode(node: TreeSelectNode, depth: number) {
    const item = document.createElement("li");
    const switcher = document.createElement("button");
    const control = this.multiple ? document.createElement("input") : undefined;
    const label = document.createElement("span");
    const selectedValues = new Set(this.selectedValues);
    const disabled = this.disabled || Boolean(node.disabled);
    const hasChildren = Boolean(node.children?.length);
    const expanded = this.searchValue ? true : this.expandedValues.has(node.value);

    item.className = "ds-tree-select__node";
    item.dataset.disabled = String(disabled);
    item.dataset.selected = String(selectedValues.has(node.value));
    item.style.paddingInlineStart = `calc(var(--spacing-ds-2) + ${depth} * var(--spacing-ds-4))`;
    item.dataset.hasControl = String(this.multiple);
    switcher.className = "ds-tree-select__switcher";
    switcher.type = "button";
    switcher.disabled = !hasChildren;
    switcher.setAttribute("aria-label", expanded ? `Collapse ${node.label}` : `Expand ${node.label}`);
    switcher.append(hasChildren ? this.createIcon(expanded ? ChevronDown : ChevronRight) : document.createTextNode(""));
    switcher.addEventListener("click", (event) => {
      event.stopPropagation();

      if (hasChildren) {
        this.toggleExpanded(node.value);
      }
    });

    if (control) {
      control.type = "checkbox";
      control.checked = selectedValues.has(node.value);
      control.disabled = disabled;
      control.addEventListener("click", (event) => event.stopPropagation());
      control.addEventListener("change", () => this.selectNode(node, control.checked));
    }

    item.addEventListener("click", () => {
      if (disabled) {
        return;
      }

      this.selectNode(node, this.multiple ? !selectedValues.has(node.value) : true);
    });
    label.className = "ds-tree-select__node-label";
    label.textContent = node.label;
    item.append(switcher);

    if (control) {
      item.append(control);
    }

    item.append(label);

    return item;
  }

  private toggleExpanded(value: string) {
    if (this.expandedValues.has(value)) {
      this.expandedValues.delete(value);
    } else {
      this.expandedValues.add(value);
    }

    this.render();
  }

  private applyDefaultExpandedValues(nodes: TreeSelectNode[]) {
    for (const node of nodes) {
      if (node.children?.length && !this.expandedValues.has(node.value)) {
        this.expandedValues.add(node.value);
      }

      this.applyDefaultExpandedValues(node.children ?? []);
    }
  }

  private selectNode(node: TreeSelectNode, checked: boolean) {
    if (this.multiple) {
      const selectedValues = new Set(this.selectedValues);

      if (checked) {
        selectedValues.add(node.value);
      } else {
        selectedValues.delete(node.value);
      }

      this.setValue(Array.from(selectedValues), true);
      return;
    }

    this.setValue([node.value], true);
    this.setOpen(false);
  }

  private createEmptyNode() {
    const item = document.createElement("li");

    item.className = "ds-tree-select__empty";
    item.textContent = "Not Found";

    return item;
  }

  private createTag(label: string, value: string) {
    const tag = document.createElement("span");
    const labelElement = document.createElement("span");
    const removeButton = document.createElement("button");

    tag.className = "ds-tree-select__tag";
    labelElement.className = "ds-tree-select__tag-label";
    labelElement.textContent = label;
    removeButton.className = "ds-tree-select__tag-remove";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remove ${label}`);
    removeButton.append(this.createIcon(X));
    removeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.setValue(this.selectedValues.filter((selectedValue) => selectedValue !== value), true);
    });
    tag.append(labelElement, removeButton);

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
