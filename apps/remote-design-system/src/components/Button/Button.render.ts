import { LoaderCircle, createElement as createLucideElement } from "lucide";

import { BUTTON_STYLES } from "./Button.styles";

export type ButtonElements = {
  controlElement: HTMLAnchorElement | HTMLButtonElement;
  iconSlotElement: HTMLSlotElement;
  labelSlotElement: HTMLSlotElement;
  loadingElement: HTMLSpanElement;
  rootElement: HTMLAnchorElement | HTMLButtonElement;
};

export type SyncButtonElementsOptions = {
  ariaLabel: string;
  disabled: boolean;
  elements: ButtonElements;
  href: string;
  htmlType: "button" | "submit" | "reset";
  iconPlacement: "start" | "end";
  loading: boolean;
  onClick: (event: Event) => void;
  rel: string;
  target: string;
};

let buttonStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getButtonStyleSheet() {
  if (!buttonStyleSheet) {
    buttonStyleSheet = new CSSStyleSheet();
    buttonStyleSheet.replaceSync(BUTTON_STYLES);
  }

  return buttonStyleSheet;
}

export function applyButtonStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getButtonStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-button]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsButton = "";
  styleElement.textContent = BUTTON_STYLES;
  shadowRoot.prepend(styleElement);
}

function createLoadingIcon() {
  return createLucideElement(LoaderCircle, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
}

function syncIconSlotVisibility(iconSlotElement: HTMLSlotElement) {
  iconSlotElement.hidden = iconSlotElement.assignedNodes({ flatten: true }).length === 0;
}

function createButtonControl(href: string) {
  const controlElement = href ? document.createElement("a") : document.createElement("button");

  controlElement.className = "ds-button";

  return controlElement;
}

export function createButtonElements({
  href,
  onClick
}: {
  href: string;
  onClick: (event: Event) => void;
}): ButtonElements {
  const controlElement = createButtonControl(href);
  const loadingElement = document.createElement("span");
  const iconSlotElement = document.createElement("slot");
  const labelSlotElement = document.createElement("slot");

  loadingElement.className = "ds-button__loading";
  loadingElement.hidden = true;
  loadingElement.setAttribute("aria-hidden", "true");
  loadingElement.append(createLoadingIcon());

  iconSlotElement.className = "ds-button__icon";
  iconSlotElement.name = "icon";
  iconSlotElement.hidden = true;
  iconSlotElement.addEventListener("slotchange", () => {
    syncIconSlotVisibility(iconSlotElement);
  });

  labelSlotElement.className = "ds-button__label";

  controlElement.addEventListener("click", onClick);
  controlElement.append(loadingElement, iconSlotElement, labelSlotElement);
  queueMicrotask(() => {
    syncIconSlotVisibility(iconSlotElement);
  });

  return {
    controlElement,
    iconSlotElement,
    labelSlotElement,
    loadingElement,
    rootElement: controlElement
  };
}

export function syncButtonElements({
  ariaLabel,
  disabled,
  elements,
  href,
  htmlType,
  iconPlacement,
  loading,
  onClick,
  rel,
  target
}: SyncButtonElementsOptions): ButtonElements {
  const needsAnchor = Boolean(href);
  const hasAnchor = elements.controlElement instanceof HTMLAnchorElement;
  let nextElements = elements;

  if (needsAnchor !== hasAnchor) {
    const replacement = createButtonElements({ href, onClick });
    elements.controlElement.replaceWith(replacement.controlElement);
    elements.controlElement.removeEventListener("click", onClick);
    nextElements = replacement;
  }

  const { controlElement, iconSlotElement, labelSlotElement, loadingElement } = nextElements;

  syncIconSlotVisibility(iconSlotElement);
  controlElement.setAttribute("aria-busy", String(loading));
  controlElement.setAttribute("aria-disabled", String(disabled || loading));
  controlElement.toggleAttribute("data-loading", loading);
  loadingElement.hidden = !loading;

  if (ariaLabel) {
    controlElement.setAttribute("aria-label", ariaLabel);
  } else {
    controlElement.removeAttribute("aria-label");
  }

  if (controlElement instanceof HTMLButtonElement) {
    controlElement.type = htmlType;
    controlElement.disabled = disabled || loading;
  } else {
    if (disabled || loading) {
      controlElement.removeAttribute("href");
    } else {
      controlElement.href = href;
    }

    controlElement.tabIndex = disabled || loading ? -1 : 0;
    syncOptionalAttribute(controlElement, "target", target);
    syncOptionalAttribute(controlElement, "rel", rel || (target === "_blank" ? "noreferrer" : ""));
  }

  const children =
    iconPlacement === "end"
      ? [loadingElement, labelSlotElement, iconSlotElement]
      : [loadingElement, iconSlotElement, labelSlotElement];

  controlElement.replaceChildren(...children);

  return nextElements;
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
