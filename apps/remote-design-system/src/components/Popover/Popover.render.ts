import { POPOVER_STYLES } from "./Popover.styles";

export type PopoverElements = {
  arrowElement: HTMLSpanElement;
  contentElement: HTMLDivElement;
  contentSlot: HTMLSlotElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLSpanElement;
  titleElement: HTMLDivElement;
  titleSlot: HTMLSlotElement;
  triggerElement: HTMLSpanElement;
};

let popoverStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getPopoverStyleSheet() {
  if (!popoverStyleSheet) {
    popoverStyleSheet = new CSSStyleSheet();
    popoverStyleSheet.replaceSync(POPOVER_STYLES);
  }

  return popoverStyleSheet;
}

export function applyPopoverStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getPopoverStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-popover]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsPopover = "";
  styleElement.textContent = POPOVER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createPopoverElements() {
  const rootElement = document.createElement("span");
  const triggerElement = document.createElement("span");
  const triggerSlot = document.createElement("slot");
  const popupElement = document.createElement("div");
  const arrowElement = document.createElement("span");
  const titleElement = document.createElement("div");
  const titleSlot = document.createElement("slot");
  const contentElement = document.createElement("div");
  const contentSlot = document.createElement("slot");

  rootElement.className = "ds-popover";
  triggerElement.className = "ds-popover__trigger";
  popupElement.className = "ds-popover__popup";
  popupElement.setAttribute("role", "dialog");
  arrowElement.className = "ds-popover__arrow";
  titleElement.className = "ds-popover__title";
  titleSlot.name = "title";
  contentElement.className = "ds-popover__content";
  contentSlot.name = "content";

  triggerElement.append(triggerSlot);
  titleElement.append(titleSlot);
  contentElement.append(contentSlot);
  popupElement.append(arrowElement, titleElement, contentElement);
  rootElement.append(triggerElement, popupElement);

  return {
    arrowElement,
    contentElement,
    contentSlot,
    popupElement,
    rootElement,
    titleElement,
    titleSlot,
    triggerElement
  } satisfies PopoverElements;
}
