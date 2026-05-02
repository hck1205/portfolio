import { ChevronLeft, createElement as createLucideElement } from "lucide";

import { LAYOUT_REGION_STYLES, LAYOUT_SIDER_STYLES, LAYOUT_STYLES } from "../Layout.styles";

let layoutStyleSheet: CSSStyleSheet | undefined;
let regionStyleSheet: CSSStyleSheet | undefined;
let siderStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getStyleSheet(kind: "layout" | "region" | "sider") {
  if (kind === "layout") {
    layoutStyleSheet ??= createStyleSheet(LAYOUT_STYLES);
    return layoutStyleSheet;
  }

  if (kind === "region") {
    regionStyleSheet ??= createStyleSheet(LAYOUT_REGION_STYLES);
    return regionStyleSheet;
  }

  siderStyleSheet ??= createStyleSheet(LAYOUT_SIDER_STYLES);
  return siderStyleSheet;
}

function createStyleSheet(styles: string) {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styles);

  return styleSheet;
}

export function applyLayoutStyles(shadowRoot: ShadowRoot, kind: "layout" | "region" | "sider") {
  if (canAdoptStyleSheets()) {
    const styleSheet = getStyleSheet(kind);

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  const dataAttribute = `data-ds-layout-${kind}`;

  if (shadowRoot.querySelector(`style[${dataAttribute}]`)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.setAttribute(dataAttribute, "");
  styleElement.textContent =
    kind === "layout" ? LAYOUT_STYLES : kind === "region" ? LAYOUT_REGION_STYLES : LAYOUT_SIDER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createLayoutElements() {
  const rootElement = document.createElement("div");
  const slotElement = document.createElement("slot");

  rootElement.className = "ds-layout";
  rootElement.append(slotElement);

  return { rootElement, slotElement };
}

export function createLayoutRegionElements(region: "header" | "content" | "footer") {
  const tagName = region === "content" ? "main" : region;
  const rootElement = document.createElement(tagName);
  const slotElement = document.createElement("slot");

  rootElement.className = `ds-layout-region ds-layout-${region}`;
  rootElement.append(slotElement);

  return { rootElement, slotElement };
}

export type LayoutSiderElements = {
  bodyElement: HTMLDivElement;
  rootElement: HTMLElement;
  triggerElement: HTMLButtonElement;
  triggerIconElement: HTMLSpanElement;
  triggerLabelElement: HTMLSpanElement;
  triggerSlotElement: HTMLSlotElement;
  zeroTriggerElement: HTMLButtonElement;
};

function createTriggerIcon() {
  const icon = createLucideElement(ChevronLeft, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
  const wrapper = document.createElement("span");

  wrapper.className = "ds-layout-sider__trigger-icon";
  wrapper.append(icon);

  return wrapper;
}

export function createLayoutSiderElements(onToggle: () => void): LayoutSiderElements {
  const rootElement = document.createElement("aside");
  const bodyElement = document.createElement("div");
  const contentSlotElement = document.createElement("slot");
  const triggerElement = document.createElement("button");
  const triggerSlotElement = document.createElement("slot");
  const triggerLabelElement = document.createElement("span");
  const zeroTriggerElement = document.createElement("button");

  rootElement.className = "ds-layout-sider";
  bodyElement.className = "ds-layout-sider__body";
  triggerElement.className = "ds-layout-sider__trigger";
  triggerElement.type = "button";
  triggerSlotElement.name = "trigger";
  triggerLabelElement.className = "ds-layout-sider__trigger-label";
  zeroTriggerElement.className = "ds-layout-sider__zero-trigger";
  zeroTriggerElement.type = "button";
  zeroTriggerElement.append(createTriggerIcon());

  const triggerIconElement = createTriggerIcon();

  triggerElement.append(triggerIconElement, triggerLabelElement, triggerSlotElement);
  triggerElement.addEventListener("click", onToggle);
  zeroTriggerElement.addEventListener("click", onToggle);
  bodyElement.append(contentSlotElement);
  rootElement.append(triggerElement, bodyElement, zeroTriggerElement);

  return {
    bodyElement,
    rootElement,
    triggerElement,
    triggerIconElement,
    triggerLabelElement,
    triggerSlotElement,
    zeroTriggerElement
  };
}
