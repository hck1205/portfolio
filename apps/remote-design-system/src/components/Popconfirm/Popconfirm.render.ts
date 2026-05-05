import { POPCONFIRM_STYLES } from "./Popconfirm.styles";

export type PopconfirmElements = {
  cancelButtonElement: HTMLButtonElement;
  descriptionElement: HTMLParagraphElement;
  okButtonElement: HTMLButtonElement;
  popupElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  titleElement: HTMLParagraphElement;
  triggerElement: HTMLSpanElement;
};

let popconfirmStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getPopconfirmStyleSheet() {
  if (!popconfirmStyleSheet) {
    popconfirmStyleSheet = new CSSStyleSheet();
    popconfirmStyleSheet.replaceSync(POPCONFIRM_STYLES);
  }

  return popconfirmStyleSheet;
}

export function applyPopconfirmStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getPopconfirmStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-popconfirm]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.dataset.dsPopconfirm = "";
  styleElement.textContent = POPCONFIRM_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createPopconfirmElements(): PopconfirmElements {
  const rootElement = document.createElement("div");
  const triggerElement = document.createElement("span");
  const triggerSlotElement = document.createElement("slot");
  const popupElement = document.createElement("div");
  const contentElement = document.createElement("div");
  const titleElement = document.createElement("p");
  const descriptionElement = document.createElement("p");
  const actionsElement = document.createElement("div");
  const cancelButtonElement = document.createElement("button");
  const okButtonElement = document.createElement("button");

  triggerElement.className = "ds-popconfirm__trigger";
  popupElement.className = "ds-popconfirm__popup";
  contentElement.className = "ds-popconfirm__content";
  titleElement.className = "ds-popconfirm__title";
  descriptionElement.className = "ds-popconfirm__description";
  actionsElement.className = "ds-popconfirm__actions";
  cancelButtonElement.className = "ds-popconfirm__button ds-popconfirm__button--cancel";
  okButtonElement.className = "ds-popconfirm__button ds-popconfirm__button--ok";
  cancelButtonElement.type = "button";
  okButtonElement.type = "button";
  triggerElement.setAttribute("part", "trigger");
  popupElement.setAttribute("part", "popup");
  titleElement.setAttribute("part", "title");
  descriptionElement.setAttribute("part", "description");
  actionsElement.setAttribute("part", "actions");
  cancelButtonElement.setAttribute("part", "cancel-button");
  okButtonElement.setAttribute("part", "ok-button");
  triggerElement.append(triggerSlotElement);
  contentElement.append(titleElement, descriptionElement);
  actionsElement.append(cancelButtonElement, okButtonElement);
  popupElement.append(contentElement, actionsElement);
  rootElement.append(triggerElement, popupElement);

  return { cancelButtonElement, descriptionElement, okButtonElement, popupElement, rootElement, titleElement, triggerElement };
}

export function syncPopconfirmElements(
  elements: PopconfirmElements,
  state: {
    cancelText: string;
    description: string;
    okText: string;
    open: boolean;
    title: string;
  }
) {
  elements.popupElement.hidden = !state.open;
  elements.popupElement.setAttribute("role", "dialog");
  elements.popupElement.setAttribute("aria-modal", "false");
  elements.titleElement.textContent = state.title;
  elements.descriptionElement.hidden = state.description.length === 0;
  elements.descriptionElement.textContent = state.description;
  elements.cancelButtonElement.textContent = state.cancelText;
  elements.okButtonElement.textContent = state.okText;
}
