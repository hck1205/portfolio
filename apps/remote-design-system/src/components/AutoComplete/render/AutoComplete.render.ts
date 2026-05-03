import { X, createElement as createLucideElement } from "lucide";

import { AUTO_COMPLETE_STYLES } from "../AutoComplete.styles";
import type { AutoCompleteInputMode, AutoCompleteOption } from "../types/AutoComplete.types";

export type AutoCompleteElements = {
  clearButtonElement: HTMLButtonElement;
  controlElement: HTMLDivElement;
  inputElement: HTMLInputElement;
  listElement: HTMLUListElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  textareaElement: HTMLTextAreaElement;
};

let autoCompleteStyleSheet: CSSStyleSheet | undefined;

export function applyAutoCompleteStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getAutoCompleteStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-auto-complete]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.setAttribute("data-ds-auto-complete", "");
  styleElement.textContent = AUTO_COMPLETE_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createAutoCompleteElements({
  onClear,
  onInput,
  onKeyDown,
  onOptionPointerDown
}: {
  onClear: (event: Event) => void;
  onInput: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onOptionPointerDown: (event: PointerEvent) => void;
}): AutoCompleteElements {
  const rootElement = document.createElement("div");
  const controlElement = document.createElement("div");
  const inputElement = document.createElement("input");
  const textareaElement = document.createElement("textarea");
  const clearButtonElement = document.createElement("button");
  const popupElement = document.createElement("div");
  const listElement = document.createElement("ul");

  rootElement.className = "ds-auto-complete";
  controlElement.className = "ds-auto-complete__control";
  inputElement.className = "ds-auto-complete__input";
  textareaElement.className = "ds-auto-complete__textarea";
  clearButtonElement.className = "ds-auto-complete__clear";
  clearButtonElement.type = "button";
  clearButtonElement.setAttribute("aria-label", "입력값 지우기");
  clearButtonElement.hidden = true;
  popupElement.className = "ds-auto-complete__popup";
  popupElement.hidden = true;
  listElement.className = "ds-auto-complete__list";
  listElement.setAttribute("role", "listbox");
  inputElement.type = "text";

  const clearIcon = createLucideElement(X);

  clearIcon.setAttribute("aria-hidden", "true");
  clearIcon.setAttribute("focusable", "false");
  clearIcon.setAttribute("width", "14");
  clearIcon.setAttribute("height", "14");
  clearButtonElement.append(clearIcon);

  inputElement.addEventListener("input", onInput);
  textareaElement.addEventListener("input", onInput);
  inputElement.addEventListener("keydown", onKeyDown);
  textareaElement.addEventListener("keydown", onKeyDown);
  clearButtonElement.addEventListener("click", onClear);
  listElement.addEventListener("pointerdown", onOptionPointerDown);
  popupElement.append(listElement);
  controlElement.append(inputElement, textareaElement, clearButtonElement);
  rootElement.append(controlElement, popupElement);

  return {
    clearButtonElement,
    controlElement,
    inputElement,
    listElement,
    popupElement,
    rootElement,
    textareaElement
  };
}

export function syncInputMode(elements: AutoCompleteElements, inputMode: AutoCompleteInputMode) {
  const isTextarea = inputMode === "textarea";

  elements.inputElement.hidden = isTextarea;
  elements.textareaElement.hidden = !isTextarea;
}

export function syncOptionList({
  activeIndex,
  elements,
  emptyText,
  getOptionId,
  options,
  selectedValue
}: {
  activeIndex: number;
  elements: AutoCompleteElements;
  emptyText: string;
  getOptionId: (index: number) => string;
  options: AutoCompleteOption[];
  selectedValue: string;
}) {
  const fragment = document.createDocumentFragment();

  if (!options.length) {
    const emptyElement = document.createElement("li");

    emptyElement.className = "ds-auto-complete__empty";
    emptyElement.textContent = emptyText;
    fragment.append(emptyElement);
  }

  for (const [index, option] of options.entries()) {
    const optionElement = document.createElement("li");

    optionElement.className = "ds-auto-complete__option";
    optionElement.dataset.index = String(index);
    optionElement.dataset.active = String(index === activeIndex);
    optionElement.id = getOptionId(index);
    optionElement.setAttribute("aria-disabled", String(Boolean(option.disabled)));
    optionElement.setAttribute("aria-selected", String(option.value === selectedValue));
    optionElement.setAttribute("role", "option");
    optionElement.textContent = option.label ?? option.value;
    fragment.append(optionElement);
  }

  elements.listElement.replaceChildren(fragment);
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getAutoCompleteStyleSheet() {
  if (!autoCompleteStyleSheet) {
    autoCompleteStyleSheet = new CSSStyleSheet();
    autoCompleteStyleSheet.replaceSync(AUTO_COMPLETE_STYLES);
  }

  return autoCompleteStyleSheet;
}
