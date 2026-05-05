import { CircleAlert, CircleCheck, CircleX, Info, X, createElement as createLucideElement } from "lucide";

import { NOTIFICATION_STYLES } from "./Notification.styles";
import type { NotificationType } from "./types/Notification.types";

export type NotificationElements = {
  closeButtonElement: HTMLButtonElement;
  descriptionElement: HTMLParagraphElement;
  iconElement: HTMLSpanElement;
  progressElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  titleElement: HTMLParagraphElement;
};

let notificationStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getNotificationStyleSheet() {
  if (!notificationStyleSheet) {
    notificationStyleSheet = new CSSStyleSheet();
    notificationStyleSheet.replaceSync(NOTIFICATION_STYLES);
  }

  return notificationStyleSheet;
}

export function applyNotificationStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getNotificationStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-notification]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.dataset.dsNotification = "";
  styleElement.textContent = NOTIFICATION_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createNotificationElements(): NotificationElements {
  const rootElement = document.createElement("div");
  const iconElement = document.createElement("span");
  const sectionElement = document.createElement("div");
  const titleElement = document.createElement("p");
  const descriptionElement = document.createElement("p");
  const closeButtonElement = document.createElement("button");
  const progressElement = document.createElement("div");

  rootElement.className = "ds-notification";
  iconElement.className = "ds-notification__icon";
  sectionElement.className = "ds-notification__section";
  titleElement.className = "ds-notification__title";
  descriptionElement.className = "ds-notification__description";
  closeButtonElement.className = "ds-notification__close";
  progressElement.className = "ds-notification__progress";
  closeButtonElement.type = "button";
  rootElement.setAttribute("part", "root");
  iconElement.setAttribute("part", "icon");
  sectionElement.setAttribute("part", "section");
  titleElement.setAttribute("part", "title");
  descriptionElement.setAttribute("part", "description");
  closeButtonElement.setAttribute("part", "close");
  progressElement.setAttribute("part", "progress");
  closeButtonElement.setAttribute("aria-label", "알림 닫기");
  closeButtonElement.append(createLucideElement(X, { "aria-hidden": "true", focusable: "false", "stroke-width": 2 }));
  sectionElement.append(titleElement, descriptionElement);
  rootElement.append(iconElement, sectionElement, closeButtonElement, progressElement);

  return { closeButtonElement, descriptionElement, iconElement, progressElement, rootElement, titleElement };
}

export function syncNotificationElements(
  elements: NotificationElements,
  state: {
    closable: boolean;
    description: string;
    progress: number;
    showProgress: boolean;
    title: string;
    type: NotificationType;
  }
) {
  elements.rootElement.dataset.type = state.type;
  elements.rootElement.setAttribute("role", state.type === "error" ? "alert" : "status");
  elements.iconElement.replaceChildren(createNotificationIcon(state.type));
  elements.titleElement.textContent = state.title;
  elements.descriptionElement.textContent = state.description;
  elements.closeButtonElement.hidden = !state.closable;
  elements.progressElement.hidden = !state.showProgress;
  elements.progressElement.style.transform = `scaleX(${state.progress})`;
}

function createNotificationIcon(type: NotificationType) {
  const iconMap = {
    error: CircleX,
    info: Info,
    success: CircleCheck,
    warning: CircleAlert
  };

  return createLucideElement(iconMap[type], { "aria-hidden": "true", focusable: "false", "stroke-width": 2 });
}
