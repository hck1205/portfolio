import { ChevronRight, createElement as createLucideElement } from "lucide";

import { MENU_ITEM_STYLES, MENU_STYLES } from "../Menu.styles";
import type { MenuItemType, MenuMode, MenuTheme } from "../types/Menu.types";

export type MenuElements = {
  rootElement: HTMLUListElement;
};

export type MenuItemElements = {
  childrenElement: HTMLDivElement;
  controlElement: HTMLAnchorElement | HTMLButtonElement;
  dividerElement: HTMLHRElement;
  extraElement: HTMLSpanElement;
  groupLabelElement: HTMLDivElement;
  iconSlotElement: HTMLSlotElement;
  labelElement: HTMLSpanElement;
  rootElement: HTMLLIElement;
  chevronElement: HTMLSpanElement;
};

let menuStyleSheet: CSSStyleSheet | undefined;
let menuItemStyleSheet: CSSStyleSheet | undefined;

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

function getMenuStyleSheet() {
  if (!menuStyleSheet) {
    menuStyleSheet = new CSSStyleSheet();
    menuStyleSheet.replaceSync(MENU_STYLES);
  }

  return menuStyleSheet;
}

function getMenuItemStyleSheet() {
  if (!menuItemStyleSheet) {
    menuItemStyleSheet = new CSSStyleSheet();
    menuItemStyleSheet.replaceSync(MENU_ITEM_STYLES);
  }

  return menuItemStyleSheet;
}

export function applyMenuStyles(shadowRoot: ShadowRoot) {
  applyStyles(shadowRoot, "ds-menu", MENU_STYLES, getMenuStyleSheet);
}

export function applyMenuItemStyles(shadowRoot: ShadowRoot) {
  applyStyles(shadowRoot, "ds-menu-item", MENU_ITEM_STYLES, getMenuItemStyleSheet);
}

export function createMenuElements(): MenuElements {
  const rootElement = document.createElement("ul");
  const slotElement = document.createElement("slot");

  rootElement.className = "ds-menu";
  rootElement.setAttribute("role", "menu");
  rootElement.append(slotElement);

  return {
    rootElement
  };
}

export function syncMenuElements({
  elements,
  mode,
  theme,
  collapsed
}: {
  collapsed: boolean;
  elements: MenuElements;
  mode: MenuMode;
  theme: MenuTheme;
}) {
  elements.rootElement.dataset.mode = mode;
  elements.rootElement.dataset.theme = theme;
  elements.rootElement.dataset.collapsed = String(collapsed);
  elements.rootElement.setAttribute("aria-orientation", mode === "horizontal" ? "horizontal" : "vertical");
}

function createChevronIcon() {
  const icon = createLucideElement(ChevronRight, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });

  return icon;
}

function createMenuItemControl(href: string) {
  const controlElement = href ? document.createElement("a") : document.createElement("button");

  controlElement.className = "ds-menu-item__control";

  return controlElement;
}

export function createMenuItemElements({
  href,
  onClick
}: {
  href: string;
  onClick: (event: Event) => void;
}): MenuItemElements {
  const rootElement = document.createElement("li");
  const controlElement = createMenuItemControl(href);
  const iconSlotElement = document.createElement("slot");
  const labelElement = document.createElement("span");
  const extraElement = document.createElement("span");
  const chevronElement = document.createElement("span");
  const childrenElement = document.createElement("div");
  const groupLabelElement = document.createElement("div");
  const dividerElement = document.createElement("hr");
  const childrenSlotElement = document.createElement("slot");

  rootElement.className = "ds-menu-item";
  iconSlotElement.className = "ds-menu-item__icon";
  iconSlotElement.name = "icon";
  iconSlotElement.hidden = true;
  labelElement.className = "ds-menu-item__label";
  extraElement.className = "ds-menu-item__extra";
  chevronElement.className = "ds-menu-item__chevron";
  chevronElement.setAttribute("aria-hidden", "true");
  chevronElement.append(createChevronIcon());
  childrenElement.className = "ds-menu-item__children";
  groupLabelElement.className = "ds-menu-item__group-label";
  dividerElement.className = "ds-menu-item__divider";
  dividerElement.setAttribute("role", "separator");

  iconSlotElement.addEventListener("slotchange", () => {
    iconSlotElement.hidden = iconSlotElement.assignedElements({ flatten: true }).length === 0;
  });
  controlElement.addEventListener("click", onClick);
  childrenElement.append(childrenSlotElement);
  controlElement.append(iconSlotElement, labelElement, extraElement, chevronElement);
  rootElement.append(controlElement, groupLabelElement, childrenElement, dividerElement);

  return {
    chevronElement,
    childrenElement,
    controlElement,
    dividerElement,
    extraElement,
    groupLabelElement,
    iconSlotElement,
    labelElement,
    rootElement
  };
}

function replaceMenuItemControl({
  elements,
  href,
  onClick
}: {
  elements: MenuItemElements;
  href: string;
  onClick: (event: Event) => void;
}) {
  const controlElement = createMenuItemControl(href);

  elements.controlElement.removeEventListener("click", onClick);
  controlElement.addEventListener("click", onClick);
  controlElement.append(elements.iconSlotElement, elements.labelElement, elements.extraElement, elements.chevronElement);
  elements.controlElement.replaceWith(controlElement);

  return {
    ...elements,
    controlElement
  };
}

export function syncMenuItemElements({
  disabled,
  elements,
  extra,
  href,
  label,
  collapsed,
  mode,
  onClick,
  open,
  selected,
  target,
  type
}: {
  disabled: boolean;
  elements: MenuItemElements;
  extra: string;
  href: string;
  label: string;
  collapsed: boolean;
  mode: MenuMode;
  onClick: (event: Event) => void;
  open: boolean;
  selected: boolean;
  target: string;
  type: MenuItemType;
}): MenuItemElements {
  const needsAnchor = Boolean(href);
  const hasAnchor = elements.controlElement instanceof HTMLAnchorElement;
  const nextElements = needsAnchor === hasAnchor ? elements : replaceMenuItemControl({ elements, href, onClick });
  const isDivider = type === "divider";
  const isSubmenu = type === "submenu";
  const isGroup = type === "group";

  nextElements.labelElement.textContent = label;
  nextElements.extraElement.textContent = extra;
  nextElements.extraElement.hidden = !extra;
  nextElements.chevronElement.hidden = !isSubmenu;
  nextElements.childrenElement.hidden = collapsed || (!isSubmenu && !isGroup) || (isSubmenu && !open);
  nextElements.groupLabelElement.textContent = label;
  nextElements.rootElement.setAttribute("role", isDivider ? "separator" : "none");
  nextElements.controlElement.setAttribute("role", "menuitem");
  nextElements.controlElement.setAttribute("aria-disabled", String(disabled));
  nextElements.controlElement.setAttribute("aria-selected", String(selected));

  if (isSubmenu) {
    nextElements.controlElement.setAttribute("aria-expanded", String(open));
  } else {
    nextElements.controlElement.removeAttribute("aria-expanded");
  }

  if (nextElements.controlElement instanceof HTMLButtonElement) {
    nextElements.controlElement.type = "button";
    nextElements.controlElement.disabled = disabled || isDivider || isGroup;
  } else {
    if (disabled || isDivider || isGroup) {
      nextElements.controlElement.removeAttribute("href");
    } else {
      nextElements.controlElement.href = href;
    }

    nextElements.controlElement.tabIndex = disabled || isDivider || isGroup ? -1 : 0;
    syncOptionalAttribute(nextElements.controlElement, "target", target);
    syncOptionalAttribute(nextElements.controlElement, "rel", target === "_blank" ? "noreferrer" : "");
  }

  nextElements.rootElement.dataset.menuMode = mode;
  nextElements.rootElement.toggleAttribute("data-menu-collapsed", collapsed);

  return nextElements;
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
