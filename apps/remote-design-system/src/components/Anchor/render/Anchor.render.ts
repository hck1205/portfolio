import { ANCHOR_LINK_STYLES, ANCHOR_STYLES } from "../Anchor.styles";
import type { AnchorDirection } from "../types/Anchor.types";

export type AnchorElements = {
  listElement: HTMLDivElement;
  rootElement: HTMLElement;
};

export type AnchorLinkElements = {
  childrenSlotElement: HTMLSlotElement;
  labelSlotElement: HTMLSlotElement;
  rootElement: HTMLDivElement;
  labelElement: HTMLSpanElement;
  linkElement: HTMLAnchorElement;
};

let anchorStyleSheet: CSSStyleSheet | undefined;
let anchorLinkStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getAnchorStyleSheet() {
  if (!anchorStyleSheet) {
    anchorStyleSheet = new CSSStyleSheet();
    anchorStyleSheet.replaceSync(ANCHOR_STYLES);
  }

  return anchorStyleSheet;
}

function getAnchorLinkStyleSheet() {
  if (!anchorLinkStyleSheet) {
    anchorLinkStyleSheet = new CSSStyleSheet();
    anchorLinkStyleSheet.replaceSync(ANCHOR_LINK_STYLES);
  }

  return anchorLinkStyleSheet;
}

function applyStyles(shadowRoot: ShadowRoot, marker: string, styles: string, styleSheet: CSSStyleSheet) {
  if (canAdoptStyleSheets()) {
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

export function applyAnchorStyles(shadowRoot: ShadowRoot) {
  applyStyles(shadowRoot, "ds-anchor", ANCHOR_STYLES, getAnchorStyleSheet());
}

export function applyAnchorLinkStyles(shadowRoot: ShadowRoot) {
  applyStyles(shadowRoot, "ds-anchor-link", ANCHOR_LINK_STYLES, getAnchorLinkStyleSheet());
}

export function createAnchorElements(): AnchorElements {
  const rootElement = document.createElement("nav");
  const listElement = document.createElement("div");
  const slotElement = document.createElement("slot");

  rootElement.className = "ds-anchor";
  rootElement.setAttribute("aria-label", "Anchor navigation");
  listElement.className = "ds-anchor__list";
  listElement.setAttribute("role", "list");
  listElement.append(slotElement);
  rootElement.append(listElement);

  return {
    listElement,
    rootElement
  };
}

export function syncAnchorElements({
  direction,
  elements
}: {
  direction: AnchorDirection;
  elements: AnchorElements;
}) {
  elements.rootElement.dataset.direction = direction;
}

export function createAnchorLinkElements({
  onClick,
  onLabelSlotChange
}: {
  onClick: (event: Event) => void;
  onLabelSlotChange: () => void;
}): AnchorLinkElements {
  const rootElement = document.createElement("div");
  const linkElement = document.createElement("a");
  const labelSlotElement = document.createElement("slot");
  const labelElement = document.createElement("span");
  const childrenSlotElement = document.createElement("slot");
  const childrenElement = document.createElement("div");

  rootElement.className = "ds-anchor-link";
  rootElement.setAttribute("role", "listitem");
  linkElement.className = "ds-anchor-link__control";
  labelSlotElement.name = "label";
  labelElement.className = "ds-anchor-link__label";
  childrenElement.className = "ds-anchor-link__children";

  labelSlotElement.addEventListener("slotchange", onLabelSlotChange);
  linkElement.addEventListener("click", onClick);
  labelSlotElement.append(labelElement);
  linkElement.append(labelSlotElement);
  childrenElement.append(childrenSlotElement);
  rootElement.append(linkElement, childrenElement);

  return {
    childrenSlotElement,
    labelElement,
    labelSlotElement,
    linkElement,
    rootElement
  };
}

export function syncAnchorLinkElements({
  active,
  disabled,
  elements,
  href,
  target,
  title
}: {
  active: boolean;
  disabled: boolean;
  elements: AnchorLinkElements;
  href: string;
  target: string;
  title: string;
}) {
  elements.labelElement.textContent = title;
  elements.linkElement.setAttribute("href", href || "#");

  if (active) {
    elements.linkElement.setAttribute("aria-current", "location");
  } else {
    elements.linkElement.removeAttribute("aria-current");
  }

  if (disabled) {
    elements.linkElement.setAttribute("aria-disabled", "true");
  } else {
    elements.linkElement.removeAttribute("aria-disabled");
  }

  if (target) {
    elements.linkElement.target = target;
  } else {
    elements.linkElement.removeAttribute("target");
  }

  if (disabled) {
    elements.linkElement.tabIndex = -1;
  } else {
    elements.linkElement.removeAttribute("tabindex");
  }
}

export function hasAssignedLabel(labelSlotElement: HTMLSlotElement) {
  return labelSlotElement.assignedNodes({ flatten: true }).some((node) => {
    return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
  });
}
