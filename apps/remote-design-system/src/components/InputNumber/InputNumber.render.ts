import { ChevronDown, ChevronUp, createElement as createLucideElement } from "lucide";

import { INPUT_NUMBER_STYLES } from "./InputNumber.styles";

export type InputNumberElements = {
  controlElement: HTMLInputElement;
  decrementButtonElement: HTMLButtonElement;
  incrementButtonElement: HTMLButtonElement;
  prefixSlotElement: HTMLSlotElement;
  rootElement: HTMLDivElement;
  suffixSlotElement: HTMLSlotElement;
};

export type SyncInputNumberElementsOptions = {
  autocomplete: string;
  decrementDisabled: boolean;
  disabled: boolean;
  displayValue: string;
  id: string;
  incrementDisabled: boolean;
  max?: number;
  min?: number;
  name: string;
  onBlur: (event: FocusEvent) => void;
  onChange: (event: Event) => void;
  onInput: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onStepDown: () => void;
  onStepUp: () => void;
  onWheel: (event: WheelEvent) => void;
  placeholder: string;
  readonly: boolean;
  required: boolean;
  value: number | null;
};

let inputNumberStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getInputNumberStyleSheet() {
  if (!inputNumberStyleSheet) {
    inputNumberStyleSheet = new CSSStyleSheet();
    inputNumberStyleSheet.replaceSync(INPUT_NUMBER_STYLES);
  }

  return inputNumberStyleSheet;
}

export function applyInputNumberStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getInputNumberStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-input-number]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsInputNumber = "";
  styleElement.textContent = INPUT_NUMBER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createInputNumberElements({
  onBlur,
  onChange,
  onInput,
  onKeyDown,
  onStepDown,
  onStepUp,
  onWheel
}: Pick<
  SyncInputNumberElementsOptions,
  "onBlur" | "onChange" | "onInput" | "onKeyDown" | "onStepDown" | "onStepUp" | "onWheel"
>): InputNumberElements {
  const rootElement = document.createElement("div");
  const bodyElement = document.createElement("div");
  const actionsElement = document.createElement("div");
  const prefixSlotElement = document.createElement("slot");
  const suffixSlotElement = document.createElement("slot");
  const controlElement = document.createElement("input");
  const incrementButtonElement = createStepButton("Increase value", ChevronUp);
  const decrementButtonElement = createStepButton("Decrease value", ChevronDown);

  rootElement.className = "ds-input-number";
  bodyElement.className = "ds-input-number__body";
  actionsElement.className = "ds-input-number__actions";
  prefixSlotElement.className = "ds-input-number__affix";
  prefixSlotElement.name = "prefix";
  suffixSlotElement.className = "ds-input-number__affix";
  suffixSlotElement.name = "suffix";
  controlElement.className = "ds-input-number__control";
  controlElement.type = "text";
  controlElement.inputMode = "decimal";

  controlElement.addEventListener("blur", onBlur as EventListener);
  controlElement.addEventListener("change", onChange);
  controlElement.addEventListener("input", onInput);
  controlElement.addEventListener("keydown", onKeyDown as EventListener);
  controlElement.addEventListener("wheel", onWheel as EventListener);
  incrementButtonElement.addEventListener("click", onStepUp);
  decrementButtonElement.addEventListener("click", onStepDown);
  prefixSlotElement.addEventListener("slotchange", () => syncSlotVisibility(prefixSlotElement));
  suffixSlotElement.addEventListener("slotchange", () => syncSlotVisibility(suffixSlotElement));

  bodyElement.append(prefixSlotElement, controlElement, suffixSlotElement);
  actionsElement.append(incrementButtonElement, decrementButtonElement);
  rootElement.append(bodyElement, actionsElement);

  queueMicrotask(() => {
    syncSlotVisibility(prefixSlotElement);
    syncSlotVisibility(suffixSlotElement);
  });

  return {
    controlElement,
    decrementButtonElement,
    incrementButtonElement,
    prefixSlotElement,
    rootElement,
    suffixSlotElement
  };
}

export function syncInputNumberElements({
  autocomplete,
  controlElement,
  decrementButtonElement,
  decrementDisabled,
  disabled,
  displayValue,
  id,
  incrementButtonElement,
  incrementDisabled,
  max,
  min,
  name,
  placeholder,
  readonly,
  required,
  value
}: SyncInputNumberElementsOptions & InputNumberElements) {
  syncOptionalAttribute(controlElement, "autocomplete", autocomplete);
  syncOptionalAttribute(controlElement, "id", id);
  syncOptionalAttribute(controlElement, "name", name);
  syncOptionalAttribute(controlElement, "placeholder", placeholder);
  syncNumberAttribute(controlElement, "aria-valuemax", max);
  syncNumberAttribute(controlElement, "aria-valuemin", min);
  syncNumberAttribute(controlElement, "aria-valuenow", value ?? undefined);
  controlElement.disabled = disabled;
  controlElement.readOnly = readonly;
  controlElement.required = required;
  controlElement.value = displayValue;
  controlElement.setAttribute("role", "spinbutton");

  incrementButtonElement.disabled = disabled || readonly || incrementDisabled;
  decrementButtonElement.disabled = disabled || readonly || decrementDisabled;
}

function createStepButton(label: string, icon: Parameters<typeof createLucideElement>[0]) {
  const button = document.createElement("button");

  button.className = "ds-input-number__step";
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.append(
    createLucideElement(icon, {
      "aria-hidden": "true",
      focusable: "false",
      height: 14,
      width: 14,
      "stroke-width": 2.25
    })
  );

  return button;
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

function syncNumberAttribute(element: HTMLElement, name: string, value?: number) {
  if (value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
}
