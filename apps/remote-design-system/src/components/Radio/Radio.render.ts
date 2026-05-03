import { RADIO_GROUP_STYLES, RADIO_STYLES } from "./Radio.styles";

export type RadioElements = {
  inputElement: HTMLInputElement;
  labelElement: HTMLLabelElement;
};

export type RadioGroupElements = {
  rootElement: HTMLDivElement;
};

type SyncRadioElementsOptions = {
  ariaLabel: string;
  checked: boolean;
  disabled: boolean;
  elements: RadioElements;
  name: string;
  value: string;
};

type SyncRadioGroupElementsOptions = {
  ariaLabel: string;
  elements: RadioGroupElements;
};

let radioStyleSheet: CSSStyleSheet | undefined;
let radioGroupStyleSheet: CSSStyleSheet | undefined;

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

export function applyRadioStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    radioStyleSheet = getStyleSheet(RADIO_STYLES, radioStyleSheet);

    if (!shadowRoot.adoptedStyleSheets.includes(radioStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, radioStyleSheet];
    }

    return;
  }

  appendFallbackStyle(shadowRoot, "data-ds-radio", RADIO_STYLES);
}

export function applyRadioGroupStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    radioGroupStyleSheet = getStyleSheet(RADIO_GROUP_STYLES, radioGroupStyleSheet);

    if (!shadowRoot.adoptedStyleSheets.includes(radioGroupStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, radioGroupStyleSheet];
    }

    return;
  }

  appendFallbackStyle(shadowRoot, "data-ds-radio-group", RADIO_GROUP_STYLES);
}

export function createRadioElements(onChange: (event: Event) => void): RadioElements {
  const labelElement = document.createElement("label");
  const inputElement = document.createElement("input");
  const controlElement = document.createElement("span");
  const dotElement = document.createElement("span");
  const labelSlotElement = document.createElement("slot");

  labelElement.className = "ds-radio";
  inputElement.className = "ds-radio__input";
  inputElement.type = "radio";
  controlElement.className = "ds-radio__control";
  dotElement.className = "ds-radio__dot";
  labelSlotElement.className = "ds-radio__label";

  inputElement.addEventListener("change", onChange);
  controlElement.append(dotElement);
  labelElement.append(inputElement, controlElement, labelSlotElement);

  return {
    inputElement,
    labelElement
  };
}

export function createRadioGroupElements(): RadioGroupElements {
  const rootElement = document.createElement("div");
  const slotElement = document.createElement("slot");

  rootElement.className = "ds-radio-group";
  rootElement.setAttribute("role", "radiogroup");
  rootElement.append(slotElement);

  return {
    rootElement
  };
}

export function syncRadioElements({
  ariaLabel,
  checked,
  disabled,
  elements,
  name,
  value
}: SyncRadioElementsOptions) {
  elements.inputElement.checked = checked;
  elements.inputElement.disabled = disabled;
  elements.inputElement.value = value;

  if (name) {
    elements.inputElement.name = name;
  } else {
    elements.inputElement.removeAttribute("name");
  }

  if (ariaLabel) {
    elements.inputElement.setAttribute("aria-label", ariaLabel);
  } else {
    elements.inputElement.removeAttribute("aria-label");
  }

}

export function syncRadioGroupElements({ ariaLabel, elements }: SyncRadioGroupElementsOptions) {
  if (ariaLabel) {
    elements.rootElement.setAttribute("aria-label", ariaLabel);
  } else {
    elements.rootElement.removeAttribute("aria-label");
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
