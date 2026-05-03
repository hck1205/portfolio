import {
  Check,
  ChevronDown,
  ChevronRight,
  MapPin,
  X,
  createElement as createLucideElement
} from "lucide";

import { CASCADER_STYLES } from "../Cascader.styles";
import { pathToKey } from "../dom/Cascader.dom";
import type {
  CascaderOption,
  CascaderPath,
  CascaderPlacement,
  CascaderSearchMatch,
  CascaderSelectedItem
} from "../types/Cascader.types";

export type CascaderElements = {
  clearButtonElement: HTMLButtonElement;
  menusElement: HTMLDivElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  searchElement: HTMLDivElement;
  searchInputElement: HTMLInputElement;
  selectorElement: HTMLButtonElement;
  suffixElement: HTMLSpanElement;
  valueElement: HTMLSpanElement;
};

let cascaderStyleSheet: CSSStyleSheet | undefined;

export function applyCascaderStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getCascaderStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-cascader]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.setAttribute("data-ds-cascader", "");
  styleElement.textContent = CASCADER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createCascaderElements({
  onClear,
  onKeyDown,
  onMenuPointerDown,
  onOptionPointerEnter,
  onTagRemove,
  onSearch,
  onToggle
}: {
  onClear: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onMenuPointerDown: (event: PointerEvent) => void;
  onOptionPointerEnter: (event: PointerEvent) => void;
  onTagRemove: (event: Event) => void;
  onSearch: (event: Event) => void;
  onToggle: (event: Event) => void;
}): CascaderElements {
  const rootElement = document.createElement("div");
  const selectorElement = document.createElement("button");
  const prefixElement = document.createElement("span");
  const valueElement = document.createElement("span");
  const clearButtonElement = document.createElement("button");
  const suffixElement = document.createElement("span");
  const popupElement = document.createElement("div");
  const searchElement = document.createElement("div");
  const searchInputElement = document.createElement("input");
  const menusElement = document.createElement("div");

  rootElement.className = "ds-cascader";
  selectorElement.className = "ds-cascader__selector";
  selectorElement.type = "button";
  prefixElement.className = "ds-cascader__prefix";
  valueElement.className = "ds-cascader__value";
  clearButtonElement.className = "ds-cascader__clear";
  clearButtonElement.type = "button";
  clearButtonElement.setAttribute("aria-label", "선택값 지우기");
  clearButtonElement.hidden = true;
  suffixElement.className = "ds-cascader__suffix";
  popupElement.className = "ds-cascader__popup";
  popupElement.hidden = true;
  searchElement.className = "ds-cascader__search";
  searchInputElement.className = "ds-cascader__search-input";
  searchInputElement.type = "search";
  searchInputElement.placeholder = "검색";
  menusElement.className = "ds-cascader__menus";

  prefixElement.append(createIcon(MapPin, 15));
  clearButtonElement.append(createIcon(X, 14));
  suffixElement.append(createIcon(ChevronDown, 16));
  selectorElement.append(prefixElement, valueElement, clearButtonElement, suffixElement);
  searchElement.append(searchInputElement);
  popupElement.append(searchElement, menusElement);
  rootElement.append(selectorElement, popupElement);

  selectorElement.addEventListener("click", onToggle);
  selectorElement.addEventListener("keydown", onKeyDown);
  clearButtonElement.addEventListener("click", onClear);
  valueElement.addEventListener("click", onTagRemove);
  searchInputElement.addEventListener("input", onSearch);
  menusElement.addEventListener("pointerdown", onMenuPointerDown);
  menusElement.addEventListener("pointerenter", onOptionPointerEnter, true);

  return {
    clearButtonElement,
    menusElement,
    popupElement,
    rootElement,
    searchElement,
    searchInputElement,
    selectorElement,
    suffixElement,
    valueElement
  };
}

export function syncSelectorValue({
  elements,
  multiple,
  placeholder,
  selectedItems
}: {
  elements: CascaderElements;
  multiple: boolean;
  placeholder: string;
  selectedItems: CascaderSelectedItem[];
}) {
  elements.valueElement.replaceChildren();

  if (!selectedItems.length) {
    const placeholderElement = document.createElement("span");

    placeholderElement.className = "ds-cascader__placeholder";
    placeholderElement.textContent = placeholder;
    elements.valueElement.append(placeholderElement);
    return;
  }

  if (!multiple) {
    elements.valueElement.textContent = selectedItems[0]?.label ?? "";
    return;
  }

  for (const item of selectedItems) {
    const tagElement = document.createElement("span");
    const tagTextElement = document.createElement("span");
    const tagRemoveElement = document.createElement("span");

    tagElement.className = "ds-cascader__tag";
    tagTextElement.className = "ds-cascader__tag-text";
    tagTextElement.textContent = item.label;
    tagRemoveElement.className = "ds-cascader__tag-remove";
    tagRemoveElement.dataset.path = pathToKey(item.path);
    tagRemoveElement.setAttribute("aria-hidden", "true");
    tagRemoveElement.append(createIcon(X, 11));
    tagElement.append(tagTextElement, tagRemoveElement);
    elements.valueElement.append(tagElement);
  }
}

export function syncMenus({
  activePath,
  columns,
  elements,
  emptyText,
  multiple,
  selectedPathKeys
}: {
  activePath: CascaderPath;
  columns: CascaderOption[][];
  elements: CascaderElements;
  emptyText: string;
  multiple: boolean;
  selectedPathKeys: Set<string>;
}) {
  const fragment = document.createDocumentFragment();

  if (!columns[0]?.length) {
    const emptyElement = document.createElement("div");

    emptyElement.className = "ds-cascader__empty";
    emptyElement.textContent = emptyText;
    fragment.append(emptyElement);
  }

  for (const [columnIndex, columnOptions] of columns.entries()) {
    const columnElement = document.createElement("ul");

    columnElement.className = "ds-cascader__column";
    columnElement.setAttribute("role", "menu");

    for (const option of columnOptions) {
      columnElement.append(createOptionElement({ activePath, columnIndex, multiple, option, selectedPathKeys }));
    }

    fragment.append(columnElement);
  }

  elements.menusElement.replaceChildren(fragment);
}

export function syncSearchResults({
  elements,
  emptyText,
  matches
}: {
  elements: CascaderElements;
  emptyText: string;
  matches: CascaderSearchMatch[];
}) {
  const listElement = document.createElement("ul");

  listElement.className = "ds-cascader__search-results";

  if (!matches.length) {
    const emptyElement = document.createElement("li");

    emptyElement.className = "ds-cascader__empty";
    emptyElement.textContent = emptyText;
    listElement.append(emptyElement);
  }

  for (const [index, match] of matches.entries()) {
    const optionElement = document.createElement("li");

    optionElement.className = "ds-cascader__search-result";
    optionElement.dataset.searchIndex = String(index);
    optionElement.textContent = match.labels.join(" / ");
    listElement.append(optionElement);
  }

  elements.menusElement.replaceChildren(listElement);
}

export function syncPopupPlacement(elements: CascaderElements, placement: CascaderPlacement) {
  elements.popupElement.dataset.placement = placement;
}

function createOptionElement({
  activePath,
  columnIndex,
  multiple,
  option,
  selectedPathKeys
}: {
  activePath: CascaderPath;
  columnIndex: number;
  multiple: boolean;
  option: CascaderOption;
  selectedPathKeys: Set<string>;
}) {
  const optionElement = document.createElement("li");
  const checkElement = document.createElement("span");
  const labelElement = document.createElement("span");
  const expandElement = document.createElement("span");
  const path = [...activePath.slice(0, columnIndex), option.value];
  const isSelected = selectedPathKeys.has(pathToKey(path));
  const isActive = activePath[columnIndex] === option.value;

  optionElement.className = "ds-cascader__option";
  optionElement.dataset.path = pathToKey(path);
  optionElement.dataset.active = String(isActive);
  optionElement.setAttribute("aria-disabled", String(Boolean(option.disabled)));
  optionElement.setAttribute("aria-selected", String(isSelected));
  optionElement.setAttribute("role", "menuitem");
  checkElement.className = "ds-cascader__option-check";
  labelElement.className = "ds-cascader__option-label";
  expandElement.className = "ds-cascader__option-expand";
  labelElement.textContent = option.label ?? option.value;

  if (multiple) {
    const checkboxElement = document.createElement("span");

    checkboxElement.className = "ds-cascader__option-checkbox";
    checkboxElement.dataset.checked = String(isSelected);
    checkboxElement.setAttribute("aria-hidden", "true");

    if (isSelected) {
      checkboxElement.append(createIcon(Check, 12));
    }

    checkElement.append(checkboxElement);
  } else if (isSelected) {
    checkElement.append(createIcon(Check, 14));
  }

  if (option.children?.length || option.isLeaf === false) {
    expandElement.append(createIcon(ChevronRight, 14));
  }

  optionElement.append(checkElement, labelElement, expandElement);

  return optionElement;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0], size: number) {
  const element = createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: size,
    width: size,
    "stroke-width": 2
  });

  return element;
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getCascaderStyleSheet() {
  if (!cascaderStyleSheet) {
    cascaderStyleSheet = new CSSStyleSheet();
    cascaderStyleSheet.replaceSync(CASCADER_STYLES);
  }

  return cascaderStyleSheet;
}
