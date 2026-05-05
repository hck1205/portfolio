import { X, createElement as createLucideElement } from "lucide";

import { DRAWER_STYLES } from "./Drawer.styles";
import type { DrawerPlacement } from "./types/Drawer.types";

export type DrawerElements = {
  bodySlotElement: HTMLSlotElement;
  closeButtonElement: HTMLButtonElement;
  extraElement: HTMLSpanElement;
  extraSlotElement: HTMLSlotElement;
  footerElement: HTMLElement;
  footerSlotElement: HTMLSlotElement;
  maskElement: HTMLDivElement;
  panelElement: HTMLElement;
  rootElement: HTMLDivElement;
  titleElement: HTMLHeadingElement;
};

let drawerStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getDrawerStyleSheet() {
  if (!drawerStyleSheet) {
    drawerStyleSheet = new CSSStyleSheet();
    drawerStyleSheet.replaceSync(DRAWER_STYLES);
  }

  return drawerStyleSheet;
}

export function applyDrawerStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getDrawerStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-drawer]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.dataset.dsDrawer = "";
  styleElement.textContent = DRAWER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createDrawerElements(): DrawerElements {
  const rootElement = document.createElement("div");
  const maskElement = document.createElement("div");
  const panelElement = document.createElement("section");
  const headerElement = document.createElement("header");
  const titleElement = document.createElement("h2");
  const extraElement = document.createElement("span");
  const extraSlotElement = document.createElement("slot");
  const closeButtonElement = document.createElement("button");
  const bodyElement = document.createElement("div");
  const bodySlotElement = document.createElement("slot");
  const footerElement = document.createElement("footer");
  const footerSlotElement = document.createElement("slot");

  rootElement.className = "ds-drawer";
  maskElement.className = "ds-drawer__mask";
  panelElement.className = "ds-drawer__panel";
  headerElement.className = "ds-drawer__header";
  titleElement.className = "ds-drawer__title";
  extraElement.className = "ds-drawer__extra";
  closeButtonElement.className = "ds-drawer__close";
  bodyElement.className = "ds-drawer__body";
  footerElement.className = "ds-drawer__footer";
  extraSlotElement.name = "extra";
  footerSlotElement.name = "footer";
  closeButtonElement.type = "button";
  rootElement.setAttribute("part", "root");
  maskElement.setAttribute("part", "mask");
  panelElement.setAttribute("part", "panel");
  panelElement.tabIndex = -1;
  headerElement.setAttribute("part", "header");
  titleElement.setAttribute("part", "title");
  extraElement.setAttribute("part", "extra");
  closeButtonElement.setAttribute("part", "close");
  bodyElement.setAttribute("part", "body");
  footerElement.setAttribute("part", "footer");
  closeButtonElement.append(
    createLucideElement(X, {
      "aria-hidden": "true",
      focusable: "false",
      "stroke-width": 2
    })
  );
  extraElement.append(extraSlotElement);
  footerElement.append(footerSlotElement);
  headerElement.append(titleElement, extraElement, closeButtonElement);
  bodyElement.append(bodySlotElement);
  panelElement.append(headerElement, bodyElement, footerElement);
  rootElement.append(maskElement, panelElement);

  return {
    bodySlotElement,
    closeButtonElement,
    extraElement,
    extraSlotElement,
    footerElement,
    footerSlotElement,
    maskElement,
    panelElement,
    rootElement,
    titleElement
  };
}

function hasAssignedContent(slotElement: HTMLSlotElement) {
  return slotElement.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return Boolean(node.textContent?.trim());
    }

    return node.nodeType === Node.ELEMENT_NODE;
  });
}

export function syncDrawerElements(
  elements: DrawerElements,
  state: {
    closable: boolean;
    closeLabel: string;
    height: string;
    mask: boolean;
    open: boolean;
    placement: DrawerPlacement;
    title: string;
    width: string;
  }
) {
  elements.rootElement.dataset.mask = String(state.mask);
  elements.rootElement.dataset.open = String(state.open);
  elements.rootElement.dataset.placement = state.placement;
  elements.panelElement.setAttribute("aria-modal", String(state.open));
  elements.panelElement.setAttribute("aria-labelledby", "ds-drawer-title");
  elements.panelElement.setAttribute("role", "dialog");
  elements.panelElement.style.setProperty("--ds-drawer-height", state.height);
  elements.panelElement.style.setProperty("--ds-drawer-width", state.width);
  elements.titleElement.id = "ds-drawer-title";
  elements.titleElement.textContent = state.title;
  elements.extraElement.hidden = !hasAssignedContent(elements.extraSlotElement);
  elements.footerElement.hidden = !hasAssignedContent(elements.footerSlotElement);
  elements.closeButtonElement.hidden = !state.closable;
  elements.closeButtonElement.setAttribute("aria-label", state.closeLabel);
}
