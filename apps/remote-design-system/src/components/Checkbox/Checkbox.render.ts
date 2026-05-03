import { CHECKBOX_GROUP_STYLES, CHECKBOX_STYLES } from "./Checkbox.styles";

export type CheckboxElements = {
  inputElement: HTMLInputElement;
  labelElement: HTMLLabelElement;
};

export type CheckboxGroupElements = {
  rootElement: HTMLDivElement;
};

export type SyncCheckboxElementsOptions = {
  ariaLabel: string;
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  name: string;
  value: string;
};

export type SyncCheckboxGroupElementsOptions = {
  ariaLabel: string;
  elements: CheckboxGroupElements;
};

let checkboxStyleSheet: CSSStyleSheet | undefined;
let checkboxGroupStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getStyleSheet(styles: string, currentStyleSheet: CSSStyleSheet | undefined) {
  if (currentStyleSheet) {
    return currentStyleSheet;
  }

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styles);

  return styleSheet;
}

export function applyCheckboxStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    checkboxStyleSheet = getStyleSheet(CHECKBOX_STYLES, checkboxStyleSheet);

    if (!shadowRoot.adoptedStyleSheets.includes(checkboxStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, checkboxStyleSheet];
    }

    return;
  }

  appendFallbackStyle(shadowRoot, "data-ds-checkbox", CHECKBOX_STYLES);
}

export function applyCheckboxGroupStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    checkboxGroupStyleSheet = getStyleSheet(CHECKBOX_GROUP_STYLES, checkboxGroupStyleSheet);

    if (!shadowRoot.adoptedStyleSheets.includes(checkboxGroupStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [
        ...shadowRoot.adoptedStyleSheets,
        checkboxGroupStyleSheet
      ];
    }

    return;
  }

  appendFallbackStyle(shadowRoot, "data-ds-checkbox-group", CHECKBOX_GROUP_STYLES);
}

export function createCheckboxElements(onChange: (event: Event) => void): CheckboxElements {
  const labelElement = document.createElement("label");
  const inputElement = document.createElement("input");
  const controlElement = document.createElement("span");
  const markElement = document.createElement("span");
  const labelSlotElement = document.createElement("slot");

  labelElement.className = "ds-checkbox";
  inputElement.className = "ds-checkbox__input";
  inputElement.type = "checkbox";
  controlElement.className = "ds-checkbox__control";
  markElement.className = "ds-checkbox__mark";
  labelSlotElement.className = "ds-checkbox__label";

  inputElement.addEventListener("change", onChange);
  controlElement.append(markElement);
  labelElement.append(inputElement, controlElement, labelSlotElement);

  return {
    inputElement,
    labelElement
  };
}

export function createCheckboxGroupElements(): CheckboxGroupElements {
  const rootElement = document.createElement("div");
  const slotElement = document.createElement("slot");

  rootElement.className = "ds-checkbox-group";
  rootElement.setAttribute("role", "group");
  rootElement.append(slotElement);

  return {
    rootElement
  };
}

export function syncCheckboxGroupElements({
  ariaLabel,
  elements
}: SyncCheckboxGroupElementsOptions) {
  if (ariaLabel) {
    elements.rootElement.setAttribute("aria-label", ariaLabel);
  } else {
    elements.rootElement.removeAttribute("aria-label");
  }
}

export function syncCheckboxElements({
  ariaLabel,
  checked,
  disabled,
  elements,
  indeterminate,
  name,
  value
}: SyncCheckboxElementsOptions & {
  elements: CheckboxElements;
}) {
  const { inputElement } = elements;

  inputElement.checked = checked;
  inputElement.disabled = disabled;
  inputElement.indeterminate = indeterminate;
  inputElement.value = value;

  if (name) {
    inputElement.name = name;
  } else {
    inputElement.removeAttribute("name");
  }

  if (ariaLabel) {
    inputElement.setAttribute("aria-label", ariaLabel);
  } else {
    inputElement.removeAttribute("aria-label");
  }
}

function appendFallbackStyle(shadowRoot: ShadowRoot, dataAttribute: string, styles: string) {
  if (shadowRoot.querySelector(`style[${dataAttribute}]`)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.setAttribute(dataAttribute, "");
  styleElement.textContent = styles;
  shadowRoot.prepend(styleElement);
}
