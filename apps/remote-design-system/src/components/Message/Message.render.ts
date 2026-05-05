import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  X,
  createElement as createLucideElement
} from "lucide";

import { MESSAGE_STYLES } from "./Message.styles";
import type { MessageType } from "./types/Message.types";

export type MessageElements = {
  closeButtonElement: HTMLButtonElement;
  contentElement: HTMLSpanElement;
  iconElement: HTMLSpanElement;
  rootElement: HTMLDivElement;
};

let messageStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getMessageStyleSheet() {
  if (!messageStyleSheet) {
    messageStyleSheet = new CSSStyleSheet();
    messageStyleSheet.replaceSync(MESSAGE_STYLES);
  }

  return messageStyleSheet;
}

export function applyMessageStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getMessageStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-message]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.dataset.dsMessage = "";
  styleElement.textContent = MESSAGE_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createMessageElements(): MessageElements {
  const rootElement = document.createElement("div");
  const iconElement = document.createElement("span");
  const contentElement = document.createElement("span");
  const closeButtonElement = document.createElement("button");

  rootElement.className = "ds-message";
  iconElement.className = "ds-message__icon";
  contentElement.className = "ds-message__content";
  closeButtonElement.className = "ds-message__close";
  closeButtonElement.type = "button";
  rootElement.setAttribute("part", "root");
  iconElement.setAttribute("part", "icon");
  contentElement.setAttribute("part", "content");
  closeButtonElement.setAttribute("part", "close");
  closeButtonElement.setAttribute("aria-label", "메시지 닫기");
  closeButtonElement.append(
    createLucideElement(X, {
      "aria-hidden": "true",
      focusable: "false",
      "stroke-width": 2
    })
  );
  rootElement.append(iconElement, contentElement, closeButtonElement);

  return {
    closeButtonElement,
    contentElement,
    iconElement,
    rootElement
  };
}

export function syncMessageElements(
  elements: MessageElements,
  state: {
    closable: boolean;
    content: string;
    type: MessageType;
  }
) {
  elements.rootElement.dataset.type = state.type;
  elements.rootElement.setAttribute("role", state.type === "error" ? "alert" : "status");
  elements.iconElement.replaceChildren(createMessageIcon(state.type));
  elements.contentElement.textContent = state.content;
  elements.closeButtonElement.hidden = !state.closable;
}

function createMessageIcon(type: MessageType) {
  const iconMap = {
    error: CircleX,
    info: Info,
    loading: LoaderCircle,
    success: CircleCheck,
    warning: CircleAlert
  };

  return createLucideElement(iconMap[type], {
    "aria-hidden": "true",
    focusable: "false",
    "stroke-width": 2
  });
}
