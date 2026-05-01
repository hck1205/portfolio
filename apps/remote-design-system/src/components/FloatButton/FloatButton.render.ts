import { ArrowUp, Plus, createElement as createLucideElement } from "lucide";

import { FLOAT_BUTTON_GROUP_STYLES, FLOAT_BUTTON_STYLES } from "./FloatButton.styles";

export type FloatButtonElements = {
  badgeElement: HTMLSpanElement;
  contentElement: HTMLSpanElement;
  controlElement: HTMLAnchorElement | HTMLButtonElement;
  iconSlotElement: HTMLSlotElement;
  rootElement: HTMLAnchorElement | HTMLButtonElement;
};

export type FloatButtonGroupElements = {
  listSlotElement: HTMLSlotElement;
  rootElement: HTMLDivElement;
  triggerButtonElement: HTMLButtonElement;
  triggerIconElement: HTMLSpanElement;
};

export type SyncFloatButtonElementsOptions = {
  ariaLabel: string;
  backTop: boolean;
  badge: string;
  content: string;
  disabled: boolean;
  elements: FloatButtonElements;
  href: string;
  htmlType: "button" | "submit" | "reset";
  onClick: (event: Event) => void;
  rel: string;
  target: string;
  tooltip: string;
};

export type SyncFloatButtonGroupElementsOptions = {
  elements: FloatButtonGroupElements;
  onMouseEnter: (event: Event) => void;
  onMouseLeave: (event: Event) => void;
  onTriggerClick: (event: Event) => void;
  open: boolean;
  trigger?: "click" | "hover";
};

let floatButtonStyleSheet: CSSStyleSheet | undefined;
let floatButtonGroupStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getFloatButtonStyleSheet() {
  if (!floatButtonStyleSheet) {
    floatButtonStyleSheet = new CSSStyleSheet();
    floatButtonStyleSheet.replaceSync(FLOAT_BUTTON_STYLES);
  }

  return floatButtonStyleSheet;
}

function getFloatButtonGroupStyleSheet() {
  if (!floatButtonGroupStyleSheet) {
    floatButtonGroupStyleSheet = new CSSStyleSheet();
    floatButtonGroupStyleSheet.replaceSync(FLOAT_BUTTON_GROUP_STYLES);
  }

  return floatButtonGroupStyleSheet;
}

export function applyFloatButtonStyles(shadowRoot: ShadowRoot) {
  applyStyles(shadowRoot, getFloatButtonStyleSheet, FLOAT_BUTTON_STYLES, "dsFloatButton");
}

export function applyFloatButtonGroupStyles(shadowRoot: ShadowRoot) {
  applyStyles(
    shadowRoot,
    getFloatButtonGroupStyleSheet,
    FLOAT_BUTTON_GROUP_STYLES,
    "dsFloatButtonGroup"
  );
}

function applyStyles(
  shadowRoot: ShadowRoot,
  getStyleSheet: () => CSSStyleSheet,
  styles: string,
  datasetKey: string
) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector(`style[data-${toKebabCase(datasetKey)}]`)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset[datasetKey] = "";
  styleElement.textContent = styles;
  shadowRoot.prepend(styleElement);
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function createFloatButtonControl(href: string) {
  const controlElement = href ? document.createElement("a") : document.createElement("button");

  controlElement.className = "ds-float-button";

  return controlElement;
}

function createBackTopIcon() {
  return createLucideElement(ArrowUp, {
    "aria-hidden": "true",
    focusable: "false",
    height: 18,
    width: 18,
    "stroke-width": 2.25
  });
}

function createGroupTriggerIcon() {
  return createLucideElement(Plus, {
    "aria-hidden": "true",
    focusable: "false",
    height: 18,
    width: 18,
    "stroke-width": 2.25
  });
}

function syncIconSlotVisibility(iconSlotElement: HTMLSlotElement, backTop: boolean) {
  iconSlotElement.hidden = backTop || iconSlotElement.assignedNodes({ flatten: true }).length === 0;
}

export function createFloatButtonElements({
  href,
  onClick
}: {
  href: string;
  onClick: (event: Event) => void;
}): FloatButtonElements {
  const controlElement = createFloatButtonControl(href);
  const iconSlotElement = document.createElement("slot");
  const contentElement = document.createElement("span");
  const badgeElement = document.createElement("span");

  iconSlotElement.className = "ds-float-button__icon";
  iconSlotElement.name = "icon";
  iconSlotElement.hidden = true;
  iconSlotElement.addEventListener("slotchange", () => {
    syncIconSlotVisibility(iconSlotElement, iconSlotElement.dataset.backTop === "true");
  });

  contentElement.className = "ds-float-button__content";
  badgeElement.className = "ds-float-button__badge";
  badgeElement.hidden = true;

  controlElement.addEventListener("click", onClick);
  controlElement.append(iconSlotElement, contentElement, badgeElement);
  queueMicrotask(() => {
    syncIconSlotVisibility(iconSlotElement, false);
  });

  return {
    badgeElement,
    contentElement,
    controlElement,
    iconSlotElement,
    rootElement: controlElement
  };
}

export function syncFloatButtonElements({
  ariaLabel,
  backTop,
  badge,
  content,
  disabled,
  elements,
  href,
  htmlType,
  onClick,
  rel,
  target,
  tooltip
}: SyncFloatButtonElementsOptions): FloatButtonElements {
  const needsAnchor = Boolean(href);
  const hasAnchor = elements.controlElement instanceof HTMLAnchorElement;
  let nextElements = elements;

  if (needsAnchor !== hasAnchor) {
    const replacement = createFloatButtonElements({ href, onClick });
    elements.controlElement.replaceWith(replacement.controlElement);
    elements.controlElement.removeEventListener("click", onClick);
    nextElements = replacement;
  }

  const { badgeElement, contentElement, controlElement, iconSlotElement } = nextElements;

  if (backTop && !controlElement.querySelector("[data-back-top-icon]")) {
    const icon = createBackTopIcon();
    const wrapper = document.createElement("span");

    wrapper.className = "ds-float-button__icon";
    wrapper.dataset.backTopIcon = "";
    wrapper.append(icon);
    controlElement.prepend(wrapper);
  }

  const backTopIconElement = controlElement.querySelector<HTMLElement>("[data-back-top-icon]");

  if (backTopIconElement) {
    backTopIconElement.hidden = !backTop;
  }

  iconSlotElement.dataset.backTop = String(backTop);
  syncIconSlotVisibility(iconSlotElement, backTop);
  syncText(contentElement, content);
  syncText(badgeElement, badge);
  contentElement.hidden = !content;
  badgeElement.hidden = !badge;

  controlElement.setAttribute("aria-disabled", String(disabled));
  syncOptionalAttribute(controlElement, "title", tooltip);

  if (ariaLabel) {
    controlElement.setAttribute("aria-label", ariaLabel);
  } else if (tooltip) {
    controlElement.setAttribute("aria-label", tooltip);
  } else if (content) {
    controlElement.setAttribute("aria-label", content);
  } else if (backTop) {
    controlElement.setAttribute("aria-label", "Back to top");
  } else {
    controlElement.removeAttribute("aria-label");
  }

  if (controlElement instanceof HTMLButtonElement) {
    controlElement.type = htmlType;
    controlElement.disabled = disabled;
  } else {
    if (disabled) {
      controlElement.removeAttribute("href");
    } else {
      controlElement.href = href;
    }

    controlElement.tabIndex = disabled ? -1 : 0;
    syncOptionalAttribute(controlElement, "target", target);
    syncOptionalAttribute(controlElement, "rel", rel || (target === "_blank" ? "noreferrer" : ""));
  }

  return nextElements;
}

export function createFloatButtonGroupElements({
  onMouseEnter,
  onMouseLeave,
  onTriggerClick
}: {
  onMouseEnter: (event: Event) => void;
  onMouseLeave: (event: Event) => void;
  onTriggerClick: (event: Event) => void;
}): FloatButtonGroupElements {
  const rootElement = document.createElement("div");
  const listSlotElement = document.createElement("slot");
  const triggerButtonElement = document.createElement("button");
  const triggerIconElement = document.createElement("span");

  rootElement.className = "ds-float-button-group";
  listSlotElement.className = "ds-float-button-group__list";
  triggerButtonElement.className = "ds-float-button-group__trigger";
  triggerButtonElement.type = "button";
  triggerButtonElement.setAttribute("aria-label", "Toggle float button menu");
  triggerIconElement.className = "ds-float-button-group__trigger-icon";
  triggerIconElement.append(createGroupTriggerIcon());

  triggerButtonElement.append(triggerIconElement);
  triggerButtonElement.addEventListener("click", onTriggerClick);
  rootElement.addEventListener("mouseenter", onMouseEnter);
  rootElement.addEventListener("mouseleave", onMouseLeave);
  rootElement.append(listSlotElement, triggerButtonElement);

  return {
    listSlotElement,
    rootElement,
    triggerButtonElement,
    triggerIconElement
  };
}

export function syncFloatButtonGroupElements({
  elements,
  onMouseEnter,
  onMouseLeave,
  onTriggerClick,
  open,
  trigger
}: SyncFloatButtonGroupElementsOptions) {
  const { listSlotElement, rootElement, triggerButtonElement } = elements;
  const hasMenuTrigger = Boolean(trigger);

  rootElement.removeEventListener("mouseenter", onMouseEnter);
  rootElement.removeEventListener("mouseleave", onMouseLeave);

  if (trigger === "hover") {
    rootElement.addEventListener("mouseenter", onMouseEnter);
    rootElement.addEventListener("mouseleave", onMouseLeave);
  }

  triggerButtonElement.hidden = !hasMenuTrigger;
  triggerButtonElement.removeEventListener("click", onTriggerClick);

  if (trigger === "click") {
    triggerButtonElement.addEventListener("click", onTriggerClick);
  }

  listSlotElement.hidden = hasMenuTrigger && !open;
  triggerButtonElement.setAttribute("aria-expanded", String(open));
}

function syncText(element: HTMLElement, value: string) {
  if (element.textContent !== value) {
    element.textContent = value;
  }
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
