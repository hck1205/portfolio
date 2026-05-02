import { DIVIDER_STYLES } from "./Divider.styles";

export type DividerElements = {
  contentSlotElement: HTMLSlotElement;
  rootElement: HTMLDivElement;
};

let dividerStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getDividerStyleSheet() {
  if (!dividerStyleSheet) {
    dividerStyleSheet = new CSSStyleSheet();
    dividerStyleSheet.replaceSync(DIVIDER_STYLES);
  }

  return dividerStyleSheet;
}

export function applyDividerStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getDividerStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-divider]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsDivider = "";
  styleElement.textContent = DIVIDER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createDividerElements({
  onSlotChange
}: {
  onSlotChange: () => void;
}): DividerElements {
  const rootElement = document.createElement("div");
  const contentSlotElement = document.createElement("slot");

  rootElement.className = "ds-divider";
  rootElement.setAttribute("role", "separator");
  contentSlotElement.className = "ds-divider__content";
  contentSlotElement.addEventListener("slotchange", onSlotChange);
  rootElement.append(contentSlotElement);

  return {
    contentSlotElement,
    rootElement
  };
}

export function hasDividerContent(contentSlotElement: HTMLSlotElement) {
  return contentSlotElement
    .assignedNodes({ flatten: true })
    .some((node) => node.textContent?.trim() || node.nodeType === Node.ELEMENT_NODE);
}
