import { ChevronDown, createElement as createLucideElement } from "lucide";

import { DROPDOWN_ITEM_STYLES, DROPDOWN_STYLES } from "../Dropdown.styles";
import type { DropdownItemType, DropdownPlacement } from "../types/Dropdown.types";

export type DropdownElements = {
  arrowElement: HTMLSpanElement;
  fallbackTriggerElement: HTMLButtonElement;
  fallbackTriggerLabelElement: HTMLSpanElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  triggerElement: HTMLSpanElement;
  triggerSlotElement: HTMLSlotElement;
};

export type DropdownItemElements = {
  controlElement: HTMLAnchorElement | HTMLButtonElement;
  dividerElement: HTMLHRElement;
  labelElement: HTMLSpanElement;
  labelSlotElement: HTMLSlotElement;
  rootElement: HTMLDivElement;
  shortcutElement: HTMLSpanElement;
};

let dropdownStyleSheet: CSSStyleSheet | undefined;
let dropdownItemStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function applyStyles(shadowRoot: ShadowRoot, marker: string, styles: string, getStyleSheet: () => CSSStyleSheet) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector(`style[data-${marker}]`)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.setAttribute(`data-${marker}`, "");
  styleElement.textContent = styles;
  shadowRoot.prepend(styleElement);
}

function getDropdownStyleSheet() {
  if (!dropdownStyleSheet) {
    dropdownStyleSheet = new CSSStyleSheet();
    dropdownStyleSheet.replaceSync(DROPDOWN_STYLES);
  }

  return dropdownStyleSheet;
}

function getDropdownItemStyleSheet() {
  if (!dropdownItemStyleSheet) {
    dropdownItemStyleSheet = new CSSStyleSheet();
    dropdownItemStyleSheet.replaceSync(DROPDOWN_ITEM_STYLES);
  }

  return dropdownItemStyleSheet;
}

export function applyDropdownStyles(shadowRoot: ShadowRoot) {
  applyStyles(shadowRoot, "ds-dropdown", DROPDOWN_STYLES, getDropdownStyleSheet);
}

export function applyDropdownItemStyles(shadowRoot: ShadowRoot) {
  applyStyles(shadowRoot, "ds-dropdown-item", DROPDOWN_ITEM_STYLES, getDropdownItemStyleSheet);
}

export function createDropdownElements({
  onKeyDown
}: {
  onKeyDown: (event: KeyboardEvent) => void;
}): DropdownElements {
  const rootElement = document.createElement("div");
  const triggerElement = document.createElement("span");
  const triggerSlotElement = document.createElement("slot");
  const fallbackTriggerElement = document.createElement("button");
  const fallbackTriggerLabelElement = document.createElement("span");
  const popupElement = document.createElement("div");
  const arrowElement = document.createElement("span");
  const menuSlotElement = document.createElement("slot");

  rootElement.className = "ds-dropdown";
  triggerElement.className = "ds-dropdown__trigger";
  triggerSlotElement.name = "trigger";
  fallbackTriggerElement.className = "ds-dropdown__fallback-trigger";
  fallbackTriggerElement.type = "button";
  fallbackTriggerLabelElement.className = "ds-dropdown__fallback-trigger-label";
  fallbackTriggerElement.append(fallbackTriggerLabelElement, createDropdownChevron());
  popupElement.className = "ds-dropdown__popup";
  popupElement.hidden = true;
  popupElement.setAttribute("role", "menu");
  arrowElement.className = "ds-dropdown__arrow";
  arrowElement.setAttribute("aria-hidden", "true");

  popupElement.addEventListener("keydown", onKeyDown);
  triggerSlotElement.append(fallbackTriggerElement);
  triggerElement.append(triggerSlotElement);
  popupElement.append(arrowElement, menuSlotElement);
  rootElement.append(triggerElement, popupElement);

  return {
    arrowElement,
    fallbackTriggerElement,
    fallbackTriggerLabelElement,
    popupElement,
    rootElement,
    triggerElement,
    triggerSlotElement
  };
}

function createDropdownChevron() {
  const iconElement = document.createElement("span");

  iconElement.className = "ds-dropdown__trigger-icon";
  iconElement.append(
    createLucideElement(ChevronDown, {
      "aria-hidden": "true",
      focusable: "false",
      height: 14,
      width: 14,
      "stroke-width": 2.25
    })
  );

  return iconElement;
}

export function syncDropdownElements({
  arrow,
  disabled,
  elements,
  open,
  placement,
  triggerLabel
}: {
  arrow: boolean;
  disabled: boolean;
  elements: DropdownElements;
  open: boolean;
  placement: DropdownPlacement;
  triggerLabel: string;
}) {
  elements.arrowElement.hidden = !arrow;
  elements.fallbackTriggerElement.disabled = disabled;
  elements.fallbackTriggerElement.setAttribute("aria-expanded", String(open));
  elements.fallbackTriggerElement.setAttribute("aria-haspopup", "menu");
  elements.fallbackTriggerLabelElement.textContent = triggerLabel;
  elements.popupElement.dataset.placement = placement;
  elements.popupElement.hidden = !open;
  elements.triggerElement.setAttribute("aria-expanded", String(open));
  elements.triggerElement.setAttribute("aria-haspopup", "menu");
  syncAssignedTriggerElements(elements.triggerSlotElement, { disabled, open });
}

function syncAssignedTriggerElements(
  triggerSlotElement: HTMLSlotElement,
  { disabled, open }: { disabled: boolean; open: boolean }
) {
  for (const element of triggerSlotElement.assignedElements({ flatten: true })) {
    if (!(element instanceof HTMLElement)) {
      continue;
    }

    element.setAttribute("aria-expanded", String(open));
    element.setAttribute("aria-haspopup", "menu");

    if (element instanceof HTMLButtonElement) {
      element.disabled = disabled;
    } else {
      element.setAttribute("aria-disabled", String(disabled));
      element.tabIndex = disabled ? -1 : 0;
    }
  }
}

function createDropdownItemControl(href: string) {
  const controlElement = href ? document.createElement("a") : document.createElement("button");

  controlElement.className = "ds-dropdown-item__control";

  return controlElement;
}

export function createDropdownItemElements({
  href,
  onClick
}: {
  href: string;
  onClick: (event: Event) => void;
}): DropdownItemElements {
  const rootElement = document.createElement("div");
  const controlElement = createDropdownItemControl(href);
  const labelSlotElement = document.createElement("slot");
  const labelElement = document.createElement("span");
  const shortcutElement = document.createElement("span");
  const dividerElement = document.createElement("hr");

  rootElement.className = "ds-dropdown-item";
  labelElement.className = "ds-dropdown-item__label";
  shortcutElement.className = "ds-dropdown-item__shortcut";
  dividerElement.className = "ds-dropdown-item__divider";
  dividerElement.setAttribute("role", "separator");
  labelSlotElement.className = "ds-dropdown-item__label-slot";
  controlElement.addEventListener("click", onClick);
  labelSlotElement.append(labelElement);
  controlElement.append(labelSlotElement, shortcutElement);
  rootElement.append(controlElement, dividerElement);

  return {
    controlElement,
    dividerElement,
    labelElement,
    labelSlotElement,
    rootElement,
    shortcutElement
  };
}

function replaceDropdownItemControl({
  elements,
  href,
  onClick
}: {
  elements: DropdownItemElements;
  href: string;
  onClick: (event: Event) => void;
}) {
  const controlElement = createDropdownItemControl(href);

  elements.controlElement.removeEventListener("click", onClick);
  controlElement.addEventListener("click", onClick);
  controlElement.append(elements.labelSlotElement, elements.shortcutElement);
  elements.controlElement.replaceWith(controlElement);

  return {
    ...elements,
    controlElement
  };
}

export function syncDropdownItemElements({
  disabled,
  elements,
  href,
  label,
  role,
  selected,
  shortcut,
  target,
  type,
  onClick
}: {
  disabled: boolean;
  elements: DropdownItemElements;
  href: string;
  label: string;
  onClick: (event: Event) => void;
  role: "menuitem" | "menuitemcheckbox";
  selected: boolean;
  shortcut: string;
  target: string;
  type: DropdownItemType;
}): DropdownItemElements {
  const needsAnchor = Boolean(href);
  const hasAnchor = elements.controlElement instanceof HTMLAnchorElement;
  const nextElements = needsAnchor === hasAnchor ? elements : replaceDropdownItemControl({ elements, href, onClick });

  nextElements.labelElement.textContent = label;
  nextElements.shortcutElement.textContent = shortcut;
  nextElements.shortcutElement.hidden = !shortcut;
  nextElements.rootElement.setAttribute("role", type === "divider" ? "separator" : "none");
  nextElements.controlElement.setAttribute("role", role);
  nextElements.controlElement.setAttribute("aria-disabled", String(disabled));

  if (role === "menuitemcheckbox") {
    nextElements.controlElement.setAttribute("aria-checked", String(selected));
  } else {
    nextElements.controlElement.removeAttribute("aria-checked");
  }

  if (nextElements.controlElement instanceof HTMLButtonElement) {
    nextElements.controlElement.type = "button";
    nextElements.controlElement.disabled = disabled || type === "divider";
  } else {
    if (disabled || type === "divider") {
      nextElements.controlElement.removeAttribute("href");
    } else {
      nextElements.controlElement.href = href;
    }

    nextElements.controlElement.tabIndex = disabled || type === "divider" ? -1 : 0;
    syncOptionalAttribute(nextElements.controlElement, "target", target);
    syncOptionalAttribute(nextElements.controlElement, "rel", target === "_blank" ? "noreferrer" : "");
  }

  return nextElements;
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
