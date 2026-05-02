import { X, createElement as createLucideElement } from "lucide";

import { MENTIONS_STYLES } from "../Mentions.styles";
import type { MentionOptionData } from "../types/Mentions.types";

export type MentionsElements = {
  clearButtonElement: HTMLButtonElement;
  controlElement: HTMLTextAreaElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLDivElement;
};

export type SyncMentionsElementsOptions = {
  activeIndex: number;
  allowClear: boolean;
  disabled: boolean;
  elements: MentionsElements;
  maxRows?: number;
  name: string;
  notFoundContent: string;
  onClear: () => void;
  onInput: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onOptionPointerDown: (index: number, event: PointerEvent) => void;
  open: boolean;
  options: MentionOptionData[];
  placeholder: string;
  readonly: boolean;
  required: boolean;
  rows: number;
  value: string;
};

let mentionsStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getMentionsStyleSheet() {
  if (!mentionsStyleSheet) {
    mentionsStyleSheet = new CSSStyleSheet();
    mentionsStyleSheet.replaceSync(MENTIONS_STYLES);
  }

  return mentionsStyleSheet;
}

export function applyMentionsStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getMentionsStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-mentions]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsMentions = "";
  styleElement.textContent = MENTIONS_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createMentionsElements({
  onClear,
  onInput,
  onKeyDown
}: Pick<SyncMentionsElementsOptions, "onClear" | "onInput" | "onKeyDown">): MentionsElements {
  const rootElement = document.createElement("div");
  const controlElement = document.createElement("textarea");
  const clearButtonElement = document.createElement("button");
  const popupElement = document.createElement("div");

  rootElement.className = "ds-mentions";
  controlElement.className = "ds-mentions__control";
  clearButtonElement.className = "ds-mentions__clear";
  clearButtonElement.type = "button";
  clearButtonElement.setAttribute("aria-label", "Clear mentions input");
  clearButtonElement.append(createIcon(X));
  clearButtonElement.addEventListener("click", onClear);
  popupElement.className = "ds-mentions__popup";
  popupElement.setAttribute("role", "listbox");
  popupElement.hidden = true;
  controlElement.addEventListener("input", onInput);
  controlElement.addEventListener("keydown", onKeyDown as EventListener);
  rootElement.append(controlElement, clearButtonElement, popupElement);

  return {
    clearButtonElement,
    controlElement,
    popupElement,
    rootElement
  };
}

export function syncMentionsElements({
  activeIndex,
  allowClear,
  disabled,
  elements,
  maxRows,
  name,
  notFoundContent,
  onOptionPointerDown,
  open,
  options,
  placeholder,
  readonly,
  required,
  rows,
  value
}: SyncMentionsElementsOptions) {
  const { clearButtonElement, controlElement, popupElement, rootElement } = elements;

  syncOptionalAttribute(controlElement, "name", name);
  syncOptionalAttribute(controlElement, "placeholder", placeholder);
  controlElement.disabled = disabled;
  controlElement.readOnly = readonly;
  controlElement.required = required;
  controlElement.rows = rows;
  controlElement.value = controlElement.value === value ? controlElement.value : value;
  controlElement.style.maxHeight = maxRows ? `${maxRows * 24}px` : "";
  clearButtonElement.hidden = !allowClear || !value || disabled || readonly;
  clearButtonElement.disabled = disabled || readonly;
  rootElement.dataset.open = String(open);
  popupElement.hidden = !open;

  if (!open) {
    return;
  }

  popupElement.replaceChildren(
    ...(options.length > 0
      ? options.map((option, index) =>
          createOptionElement({
            active: index === activeIndex,
            index,
            onOptionPointerDown,
            option
          })
        )
      : [createEmptyElement(notFoundContent)])
  );
}

function createOptionElement({
  active,
  index,
  onOptionPointerDown,
  option
}: {
  active: boolean;
  index: number;
  onOptionPointerDown: (index: number, event: PointerEvent) => void;
  option: MentionOptionData;
}) {
  const buttonElement = document.createElement("button");

  buttonElement.className = "ds-mentions__option";
  buttonElement.dataset.active = String(active);
  buttonElement.disabled = option.disabled;
  buttonElement.setAttribute("aria-selected", String(active));
  buttonElement.setAttribute("role", "option");
  buttonElement.type = "button";
  buttonElement.textContent = option.label;
  buttonElement.addEventListener("pointerdown", (event) => {
    onOptionPointerDown(index, event);
  });

  return buttonElement;
}

function createEmptyElement(text: string) {
  const element = document.createElement("div");

  element.className = "ds-mentions__empty";
  element.textContent = text;

  return element;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 15,
    width: 15,
    "stroke-width": 2.25
  });
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
