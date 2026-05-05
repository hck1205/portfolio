import { X, createElement as createLucideElement } from "lucide";

import { hasAssignedContent } from "./dom/Modal.dom";
import { MODAL_STYLES } from "./Modal.styles";

export type ModalElements = {
  closeButtonElement: HTMLButtonElement;
  dialogElement: HTMLDivElement;
  footerElement: HTMLElement;
  footerSlotElement: HTMLSlotElement;
  maskElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  titleElement: HTMLHeadingElement;
};

let modalStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getModalStyleSheet() {
  if (!modalStyleSheet) {
    modalStyleSheet = new CSSStyleSheet();
    modalStyleSheet.replaceSync(MODAL_STYLES);
  }

  return modalStyleSheet;
}

export function applyModalStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getModalStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-modal]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.dataset.dsModal = "";
  styleElement.textContent = MODAL_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createModalElements(): ModalElements {
  const rootElement = document.createElement("div");
  const maskElement = document.createElement("div");
  const dialogElement = document.createElement("div");
  const headerElement = document.createElement("header");
  const titleElement = document.createElement("h2");
  const closeButtonElement = document.createElement("button");
  const bodyElement = document.createElement("div");
  const bodySlotElement = document.createElement("slot");
  const footerElement = document.createElement("footer");
  const footerSlotElement = document.createElement("slot");

  rootElement.className = "ds-modal";
  maskElement.className = "ds-modal__mask";
  dialogElement.className = "ds-modal__dialog";
  headerElement.className = "ds-modal__header";
  titleElement.className = "ds-modal__title";
  closeButtonElement.className = "ds-modal__close";
  bodyElement.className = "ds-modal__body";
  footerElement.className = "ds-modal__footer";
  footerSlotElement.name = "footer";
  closeButtonElement.type = "button";
  rootElement.setAttribute("part", "root");
  maskElement.setAttribute("part", "mask");
  dialogElement.setAttribute("part", "dialog");
  dialogElement.tabIndex = -1;
  headerElement.setAttribute("part", "header");
  titleElement.setAttribute("part", "title");
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
  headerElement.append(titleElement, closeButtonElement);
  bodyElement.append(bodySlotElement);
  footerElement.append(footerSlotElement);
  dialogElement.append(headerElement, bodyElement, footerElement);
  rootElement.append(maskElement, dialogElement);

  return {
    closeButtonElement,
    dialogElement,
    footerElement,
    footerSlotElement,
    maskElement,
    rootElement,
    titleElement
  };
}

export function syncModalElements(
  elements: ModalElements,
  state: {
    centered: boolean;
    closable: boolean;
    closeLabel: string;
    mask: boolean;
    open: boolean;
    title: string;
    width: string;
  }
) {
  elements.rootElement.dataset.centered = String(state.centered);
  elements.rootElement.dataset.mask = String(state.mask);
  elements.rootElement.dataset.open = String(state.open);
  elements.dialogElement.setAttribute("aria-modal", String(state.open));
  elements.dialogElement.setAttribute("aria-labelledby", "ds-modal-title");
  elements.dialogElement.setAttribute("role", "dialog");
  elements.dialogElement.style.setProperty("--ds-modal-width", state.width);
  elements.titleElement.id = "ds-modal-title";
  elements.titleElement.textContent = state.title;
  elements.closeButtonElement.hidden = !state.closable;
  elements.closeButtonElement.setAttribute("aria-label", state.closeLabel);
  elements.maskElement.hidden = !state.mask;
  syncModalFooterVisibility(elements);
}

export function syncModalFooterVisibility(elements: ModalElements) {
  elements.footerElement.hidden = !hasAssignedContent(elements.footerSlotElement);
}
