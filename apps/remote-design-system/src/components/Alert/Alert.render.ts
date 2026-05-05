import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  X,
  createElement as createLucideElement
} from "lucide";

import { ALERT_STYLES } from "./Alert.styles";
import type { AlertType } from "./types/Alert.types";

export type AlertElements = {
  actionSlotElement: HTMLSlotElement;
  closeButtonElement: HTMLButtonElement;
  descriptionElement: HTMLParagraphElement;
  iconSlotElement: HTMLSlotElement;
  rootElement: HTMLDivElement;
  titleElement: HTMLParagraphElement;
};

let alertStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getAlertStyleSheet() {
  if (!alertStyleSheet) {
    alertStyleSheet = new CSSStyleSheet();
    alertStyleSheet.replaceSync(ALERT_STYLES);
  }

  return alertStyleSheet;
}

export function applyAlertStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getAlertStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-alert]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.dataset.dsAlert = "";
  styleElement.textContent = ALERT_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createAlertElements(): AlertElements {
  const rootElement = document.createElement("div");
  const iconSlotElement = document.createElement("slot");
  const sectionElement = document.createElement("div");
  const titleElement = document.createElement("p");
  const descriptionElement = document.createElement("p");
  const actionSlotElement = document.createElement("slot");
  const closeButtonElement = document.createElement("button");

  rootElement.className = "ds-alert";
  iconSlotElement.className = "ds-alert__icon";
  sectionElement.className = "ds-alert__section";
  titleElement.className = "ds-alert__title";
  descriptionElement.className = "ds-alert__description";
  actionSlotElement.className = "ds-alert__actions";
  closeButtonElement.className = "ds-alert__close";
  iconSlotElement.name = "icon";
  actionSlotElement.name = "action";
  closeButtonElement.type = "button";
  rootElement.setAttribute("part", "root");
  iconSlotElement.setAttribute("part", "icon");
  sectionElement.setAttribute("part", "section");
  titleElement.setAttribute("part", "title");
  descriptionElement.setAttribute("part", "description");
  actionSlotElement.setAttribute("part", "actions");
  closeButtonElement.setAttribute("part", "close");
  sectionElement.append(titleElement, descriptionElement);
  closeButtonElement.append(
    createLucideElement(X, {
      "aria-hidden": "true",
      focusable: "false",
      "stroke-width": 2
    })
  );
  rootElement.append(iconSlotElement, sectionElement, actionSlotElement, closeButtonElement);

  return {
    actionSlotElement,
    closeButtonElement,
    descriptionElement,
    iconSlotElement,
    rootElement,
    titleElement
  };
}

export function syncAlertElements(
  elements: AlertElements,
  state: {
    banner: boolean;
    closable: boolean;
    closeLabel: string;
    description: string;
    showIcon: boolean;
    title: string;
    type: AlertType;
  }
) {
  elements.rootElement.dataset.banner = String(state.banner);
  elements.rootElement.dataset.type = state.type;
  elements.rootElement.setAttribute("role", state.banner ? "status" : "alert");
  elements.iconSlotElement.hidden = !state.showIcon;
  elements.iconSlotElement.replaceChildren(createAlertIcon(state.type));
  elements.titleElement.textContent = state.title;
  elements.descriptionElement.hidden = state.description.length === 0;
  elements.descriptionElement.textContent = state.description;
  elements.closeButtonElement.hidden = !state.closable;
  elements.closeButtonElement.setAttribute("aria-label", state.closeLabel);
}

function createAlertIcon(type: AlertType) {
  const iconMap = {
    error: CircleX,
    info: Info,
    success: CircleCheck,
    warning: CircleAlert
  };

  return createLucideElement(iconMap[type], {
    "aria-hidden": "true",
    focusable: "false",
    "stroke-width": 2
  });
}
