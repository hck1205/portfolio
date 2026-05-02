import { Eye, EyeOff, LoaderCircle, Search, X, createElement as createLucideElement } from "lucide";

import { INPUT_STYLES } from "./Input.styles";
import type { InputMode, InputStatus, InputVariant } from "./types/Input.types";

export type InputElements = {
  clearButtonElement: HTMLButtonElement;
  controlElement: HTMLInputElement | HTMLTextAreaElement;
  countElement: HTMLSpanElement;
  passwordButtonElement: HTMLButtonElement;
  prefixSlotElement: HTMLSlotElement;
  rootElement: HTMLDivElement;
  searchButtonElement: HTMLButtonElement;
  searchInlineButtonElement: HTMLButtonElement;
  searchRootElement: HTMLDivElement;
  suffixSlotElement: HTMLSlotElement;
};

export type SyncInputElementsOptions = {
  allowClear: boolean;
  autocomplete: string;
  disabled: boolean;
  elements: InputElements;
  enterButton: boolean;
  id: string;
  inputMode: string;
  loading: boolean;
  maxLength?: number;
  mode: InputMode;
  name: string;
  onChange: (event: Event) => void;
  onClear: () => void;
  onInput: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onPasswordToggle: () => void;
  onSearch: (source: "button") => void;
  passwordVisible: boolean;
  placeholder: string;
  readonly: boolean;
  required: boolean;
  rows: number;
  searchButtonIcon: boolean;
  showCount: boolean;
  spellcheck: string | null;
  status?: InputStatus;
  type: string;
  value: string;
  variant: InputVariant;
  visibilityToggle: boolean;
};

let inputStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getInputStyleSheet() {
  if (!inputStyleSheet) {
    inputStyleSheet = new CSSStyleSheet();
    inputStyleSheet.replaceSync(INPUT_STYLES);
  }

  return inputStyleSheet;
}

export function applyInputStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getInputStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-input]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsInput = "";
  styleElement.textContent = INPUT_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createInputElements({
  mode,
  onChange,
  onClear,
  onInput,
  onKeyDown,
  onPasswordToggle,
  onSearch
}: {
  mode: InputMode;
  onChange: (event: Event) => void;
  onClear: () => void;
  onInput: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onPasswordToggle: () => void;
  onSearch: (source: "button") => void;
}): InputElements {
  const searchRootElement = document.createElement("div");
  const rootElement = document.createElement("div");
  const prefixSlotElement = document.createElement("slot");
  const suffixSlotElement = document.createElement("slot");
  const clearButtonElement = createIconButton("Clear input", X, "clear");
  const passwordButtonElement = createIconButton("Toggle password visibility", Eye, "password-visible");
  const searchInlineButtonElement = createIconButton("Search", Search, "search");
  const searchButtonElement = document.createElement("button");
  const countElement = document.createElement("span");
  const controlElement = createControlElement(mode, onInput, onChange, onKeyDown);

  searchRootElement.className = "ds-input-search";
  rootElement.className = "ds-input";
  prefixSlotElement.className = "ds-input__prefix";
  prefixSlotElement.name = "prefix";
  suffixSlotElement.className = "ds-input__suffix";
  suffixSlotElement.name = "suffix";
  countElement.className = "ds-input__count";

  searchButtonElement.className = "ds-input-search__button";
  searchButtonElement.type = "button";
  searchButtonElement.addEventListener("click", () => onSearch("button"));
  syncSearchButtonContent(searchButtonElement, Search, "search");

  clearButtonElement.addEventListener("click", onClear);
  passwordButtonElement.addEventListener("click", onPasswordToggle);
  searchInlineButtonElement.addEventListener("click", () => onSearch("button"));

  prefixSlotElement.addEventListener("slotchange", () => syncSlotVisibility(prefixSlotElement));
  suffixSlotElement.addEventListener("slotchange", () => syncSlotVisibility(suffixSlotElement));

  rootElement.append(
    prefixSlotElement,
    controlElement,
    clearButtonElement,
    passwordButtonElement,
    searchInlineButtonElement,
    suffixSlotElement,
    countElement
  );
  searchRootElement.append(rootElement, searchButtonElement);

  queueMicrotask(() => {
    syncSlotVisibility(prefixSlotElement);
    syncSlotVisibility(suffixSlotElement);
  });

  return {
    clearButtonElement,
    controlElement,
    countElement,
    passwordButtonElement,
    prefixSlotElement,
    rootElement,
    searchButtonElement,
    searchInlineButtonElement,
    searchRootElement,
    suffixSlotElement
  };
}

export function syncInputElements(options: SyncInputElementsOptions): InputElements {
  const nextElements = ensureControlElement(options);
  const {
    clearButtonElement,
    controlElement,
    countElement,
    passwordButtonElement,
    rootElement,
    searchButtonElement,
    searchInlineButtonElement,
    searchRootElement
  } = nextElements;
  const inputType = options.mode === "password" && options.passwordVisible ? "text" : options.type;
  const isTextarea = controlElement instanceof HTMLTextAreaElement;
  const canClear = options.value.length > 0 && !options.disabled && !options.readonly;
  const showPasswordToggle = options.mode === "password" && options.visibilityToggle;
  const showInlineSearch = options.mode === "search" && !options.enterButton;
  const showSearchButton = options.mode === "search" && options.enterButton;
  const countText = options.maxLength ? `${options.value.length} / ${options.maxLength}` : String(options.value.length);

  rootElement.dataset.mode = options.mode;
  rootElement.dataset.variant = options.variant;
  rootElement.dataset.status = options.status ?? "";
  rootElement.toggleAttribute("data-has-enter-button", showSearchButton);

  syncOptionalAttribute(controlElement, "id", options.id);
  syncOptionalAttribute(controlElement, "name", options.name);
  syncOptionalAttribute(controlElement, "placeholder", options.placeholder);
  syncOptionalAttribute(controlElement, "autocomplete", options.autocomplete);
  syncOptionalAttribute(controlElement, "inputmode", options.inputMode);
  controlElement.toggleAttribute("required", options.required);
  controlElement.toggleAttribute("readonly", options.readonly);
  controlElement.disabled = options.disabled;
  syncControlValue(controlElement, options.value);
  controlElement.setAttribute("aria-invalid", String(options.status === "error"));

  if (options.maxLength) {
    controlElement.maxLength = options.maxLength;
  } else {
    controlElement.removeAttribute("maxlength");
  }

  if (options.spellcheck !== null) {
    controlElement.spellcheck = options.spellcheck === "true";
  } else {
    controlElement.removeAttribute("spellcheck");
  }

  if (isTextarea) {
    controlElement.rows = options.rows;
  } else {
    controlElement.type = inputType;
  }

  clearButtonElement.hidden = !options.allowClear || !canClear;
  clearButtonElement.disabled = !canClear;
  passwordButtonElement.hidden = !showPasswordToggle;
  passwordButtonElement.disabled = options.disabled;
  passwordButtonElement.setAttribute("aria-pressed", String(options.passwordVisible));
  syncIconButtonContent(
    passwordButtonElement,
    options.passwordVisible ? EyeOff : Eye,
    options.passwordVisible ? "password-hidden" : "password-visible"
  );
  searchInlineButtonElement.hidden = !showInlineSearch;
  searchInlineButtonElement.disabled = options.disabled || options.loading;
  searchButtonElement.hidden = !showSearchButton;
  searchButtonElement.disabled = options.disabled || options.loading;
  syncSearchButtonContent(
    searchButtonElement,
    options.loading ? LoaderCircle : Search,
    options.loading ? "loading" : "search",
    {
      loading: options.loading,
      showIcon: options.searchButtonIcon || options.loading
    }
  );

  countElement.hidden = !options.showCount;
  countElement.textContent = countText;
  countElement.toggleAttribute("data-over-limit", Boolean(options.maxLength && options.value.length > options.maxLength));

  searchRootElement.toggleAttribute("data-search", showSearchButton);
  const root = showSearchButton ? searchRootElement : rootElement;

  if (!root.isConnected && searchRootElement.parentElement) {
    searchRootElement.replaceWith(root);
  }

  return nextElements;
}

function ensureControlElement(options: SyncInputElementsOptions) {
  const needsTextarea = options.mode === "textarea";
  const hasTextarea = options.elements.controlElement instanceof HTMLTextAreaElement;

  if (needsTextarea === hasTextarea) {
    return options.elements;
  }

  const replacement = createControlElement(options.mode, options.onInput, options.onChange, options.onKeyDown);
  options.elements.controlElement.replaceWith(replacement);

  return {
    ...options.elements,
    controlElement: replacement
  };
}

function createControlElement(
  mode: InputMode,
  onInput: (event: Event) => void,
  onChange: (event: Event) => void,
  onKeyDown: (event: KeyboardEvent) => void
) {
  const controlElement = mode === "textarea" ? document.createElement("textarea") : document.createElement("input");

  controlElement.className = "ds-input__control";
  controlElement.addEventListener("input", onInput);
  controlElement.addEventListener("change", onChange);
  controlElement.addEventListener("keydown", onKeyDown as EventListener);

  return controlElement;
}

function syncControlValue(controlElement: HTMLInputElement | HTMLTextAreaElement, value: string) {
  if (controlElement.value !== value) {
    controlElement.value = value;
  }
}

function createIconButton(label: string, icon: Parameters<typeof createIcon>[0], iconName: string) {
  const button = document.createElement("button");

  button.className = "ds-input__action";
  button.type = "button";
  button.dataset.initialIconName = iconName;
  button.setAttribute("aria-label", label);
  button.append(createIcon(icon, 15));

  return button;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0], size = 15) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: size,
    width: size,
    "stroke-width": 2.25
  });
}

function syncIconButtonContent(button: HTMLButtonElement, icon: Parameters<typeof createIcon>[0], iconName: string) {
  if (button.dataset.iconName === iconName) {
    return;
  }

  button.dataset.iconName = iconName;
  button.replaceChildren(createIcon(icon, 16));
}

function syncSearchButtonContent(
  button: HTMLButtonElement,
  icon: Parameters<typeof createIcon>[0],
  iconName: string,
  { loading = false, showIcon = true }: { loading?: boolean; showIcon?: boolean } = {}
) {
  const nextShowIcon = String(showIcon);
  const nextLoading = String(loading);

  if (
    button.dataset.iconName === iconName &&
    button.dataset.showIcon === nextShowIcon &&
    button.dataset.loading === nextLoading
  ) {
    return;
  }

  const textElement = document.createElement("span");
  const iconElement = createIcon(icon, 16);

  button.dataset.iconName = iconName;
  button.dataset.showIcon = nextShowIcon;
  button.dataset.loading = nextLoading;
  textElement.textContent = "Search";
  button.replaceChildren(...(showIcon ? [iconElement] : []), textElement);
  button.firstElementChild?.classList.toggle("ds-input__spinner", loading);
}

function syncSlotVisibility(slotElement: HTMLSlotElement) {
  slotElement.hidden = slotElement.assignedNodes({ flatten: true }).length === 0;
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
