import { Check, ChevronDown, X, createElement as createLucideElement } from "lucide";

import { SELECT_STYLES } from "../Select.styles";
import type { SelectMode, SelectOption } from "../types/Select.types";

export type SelectElements = {
  clearButtonElement: HTMLButtonElement;
  listElement: HTMLDivElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  searchElement: HTMLInputElement;
  selectorElement: HTMLButtonElement;
  valueElement: HTMLSpanElement;
};

type CreateSelectElementsOptions = {
  onClear: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onOptionPointerDown: (event: PointerEvent) => void;
  onSearch: (event: Event) => void;
  onTagRemove: (event: Event) => void;
  onToggle: (event: Event) => void;
};

type SyncSelectElementsOptions = {
  activeIndex: number;
  disabled: boolean;
  elements: SelectElements;
  emptyText: string;
  getOptionId: (index: number) => string;
  mode: SelectMode;
  open: boolean;
  options: SelectOption[];
  placeholder: string;
  searchValue: string;
  selectedOptions: SelectOption[];
  selectedValues: Set<string>;
  showSearch: boolean;
  value: string | string[];
};

let selectStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getSelectStyleSheet() {
  if (!selectStyleSheet) {
    selectStyleSheet = new CSSStyleSheet();
    selectStyleSheet.replaceSync(SELECT_STYLES);
  }

  return selectStyleSheet;
}

export function applySelectStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getSelectStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-select]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsSelect = "";
  styleElement.textContent = SELECT_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createSelectElements({
  onClear,
  onKeyDown,
  onOptionPointerDown,
  onSearch,
  onTagRemove,
  onToggle
}: CreateSelectElementsOptions): SelectElements {
  const rootElement = document.createElement("div");
  const selectorElement = document.createElement("button");
  const valueElement = document.createElement("span");
  const clearButtonElement = document.createElement("button");
  const chevronElement = document.createElement("span");
  const popupElement = document.createElement("div");
  const searchElement = document.createElement("input");
  const listElement = document.createElement("div");

  rootElement.className = "ds-select";
  selectorElement.className = "ds-select__selector";
  selectorElement.type = "button";
  valueElement.className = "ds-select__value";
  clearButtonElement.className = "ds-select__clear";
  clearButtonElement.type = "button";
  clearButtonElement.setAttribute("aria-label", "Clear selection");
  clearButtonElement.append(createIcon(X));
  chevronElement.className = "ds-select__chevron";
  chevronElement.append(createIcon(ChevronDown));
  popupElement.className = "ds-select__popup";
  popupElement.hidden = true;
  searchElement.className = "ds-select__search";
  searchElement.type = "text";
  listElement.className = "ds-select__list";
  listElement.setAttribute("role", "listbox");

  selectorElement.addEventListener("click", onToggle);
  selectorElement.addEventListener("keydown", onKeyDown);
  clearButtonElement.addEventListener("click", onClear);
  searchElement.addEventListener("input", onSearch);
  listElement.addEventListener("pointerdown", onOptionPointerDown);
  valueElement.addEventListener("click", onTagRemove);
  popupElement.append(searchElement, listElement);
  selectorElement.append(valueElement, clearButtonElement, chevronElement);
  rootElement.append(selectorElement, popupElement);

  return {
    clearButtonElement,
    listElement,
    popupElement,
    rootElement,
    searchElement,
    selectorElement,
    valueElement
  };
}

export function syncSelectElements({
  activeIndex,
  disabled,
  elements,
  emptyText,
  getOptionId,
  mode,
  open,
  options,
  placeholder,
  searchValue,
  selectedOptions,
  selectedValues,
  showSearch,
  value
}: SyncSelectElementsOptions) {
  const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);
  const activeOptionId = open && activeIndex >= 0 ? getOptionId(activeIndex) : "";

  elements.selectorElement.disabled = disabled;
  elements.selectorElement.setAttribute("aria-expanded", String(open));
  elements.selectorElement.setAttribute("aria-haspopup", "listbox");
  elements.selectorElement.setAttribute("role", "combobox");
  elements.clearButtonElement.hidden = disabled || !hasValue;
  elements.popupElement.hidden = !open;
  elements.searchElement.hidden = !showSearch;
  elements.searchElement.value = searchValue;
  elements.listElement.setAttribute("aria-multiselectable", String(mode !== "single"));
  syncValueElement({ elements, mode, placeholder, selectedOptions, value });
  syncOptions({ activeIndex, elements, emptyText, getOptionId, options, selectedValues });

  if (activeOptionId) {
    elements.selectorElement.setAttribute("aria-activedescendant", activeOptionId);
  } else {
    elements.selectorElement.removeAttribute("aria-activedescendant");
  }
}

function syncValueElement({
  elements,
  mode,
  placeholder,
  selectedOptions,
  value
}: {
  elements: SelectElements;
  mode: SelectMode;
  placeholder: string;
  selectedOptions: SelectOption[];
  value: string | string[];
}) {
  if (selectedOptions.length === 0) {
    const placeholderElement = document.createElement("span");

    placeholderElement.className = "ds-select__placeholder";
    placeholderElement.textContent = placeholder;
    elements.valueElement.replaceChildren(placeholderElement);
    return;
  }

  if (mode === "single") {
    elements.valueElement.textContent = selectedOptions[0]?.label ?? String(value);
    return;
  }

  elements.valueElement.replaceChildren(
    ...selectedOptions.map((option) => {
      const tagElement = document.createElement("span");
      const removeElement = document.createElement("button");

      tagElement.className = "ds-select__tag";
      tagElement.textContent = option.label;
      removeElement.className = "ds-select__tag-remove";
      removeElement.type = "button";
      removeElement.dataset.value = option.value;
      removeElement.setAttribute("aria-label", `Remove ${option.label}`);
      removeElement.append(createIcon(X, 12));
      tagElement.append(removeElement);

      return tagElement;
    })
  );
}

function syncOptions({
  activeIndex,
  elements,
  emptyText,
  getOptionId,
  options,
  selectedValues
}: {
  activeIndex: number;
  elements: SelectElements;
  emptyText: string;
  getOptionId: (index: number) => string;
  options: SelectOption[];
  selectedValues: Set<string>;
}) {
  if (options.length === 0) {
    const emptyElement = document.createElement("span");

    emptyElement.className = "ds-select__option";
    emptyElement.textContent = emptyText;
    elements.listElement.replaceChildren(emptyElement);
    return;
  }

  elements.listElement.replaceChildren(
    ...options.map((option, index) => {
      const optionElement = document.createElement("button");

      optionElement.className = "ds-select__option";
      optionElement.type = "button";
      optionElement.disabled = Boolean(option.disabled);
      optionElement.id = getOptionId(index);
      optionElement.dataset.index = String(index);
      optionElement.dataset.active = String(index === activeIndex);
      optionElement.setAttribute("aria-selected", String(selectedValues.has(option.value)));
      optionElement.setAttribute("role", "option");
      optionElement.textContent = option.label;

      if (selectedValues.has(option.value)) {
        optionElement.append(createIcon(Check, 14));
      }

      return optionElement;
    })
  );
}

function createIcon(icon: Parameters<typeof createLucideElement>[0], size = 16) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: size,
    width: size,
    "stroke-width": 2.25
  });
}
