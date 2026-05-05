import {
  BadgeAlert,
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  createElement as createLucideElement
} from "lucide";

import { RESULT_OBSERVED_ATTRIBUTES } from "./constants/Result.constants";
import { getResultStatus, syncNullableAttribute } from "./dom/Result.dom";
import { RESULT_STYLES } from "./Result.styles";
import type { ResultStatus } from "./types/Result.types";

let resultStyleSheet: CSSStyleSheet | undefined;

export class DsResult extends HTMLElement {
  static observedAttributes = RESULT_OBSERVED_ATTRIBUTES;

  private iconElement?: HTMLDivElement;
  private rootElement?: HTMLElement;
  private subTitleElement?: HTMLParagraphElement;
  private titleElement?: HTMLHeadingElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get status(): ResultStatus {
    return getResultStatus(this);
  }

  set status(value: ResultStatus) {
    this.setAttribute("status", value);
  }

  get subTitle() {
    return this.getAttribute("sub-title") ?? "";
  }

  set subTitle(value: string) {
    syncNullableAttribute(this, "sub-title", value);
  }

  get title() {
    return this.getAttribute("title") ?? "결과";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  private render() {
    if (!this.isConnected && !this.rootElement) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    if (this.rootElement) {
      this.rootElement.dataset.status = this.status;
    }
    this.iconElement?.replaceChildren(createResultIcon(this.status));

    if (this.titleElement) {
      this.titleElement.textContent = this.title;
    }

    if (this.subTitleElement) {
      this.subTitleElement.hidden = this.subTitle.length === 0;
      this.subTitleElement.textContent = this.subTitle;
    }
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("section");
    const iconElement = document.createElement("div");
    const copyElement = document.createElement("div");
    const titleElement = document.createElement("h2");
    const subTitleElement = document.createElement("p");
    const extraElement = document.createElement("slot");

    rootElement.className = "ds-result";
    iconElement.className = "ds-result__icon";
    copyElement.className = "ds-result__copy";
    titleElement.className = "ds-result__title";
    subTitleElement.className = "ds-result__subtitle";
    extraElement.className = "ds-result__extra";
    extraElement.name = "extra";
    rootElement.setAttribute("part", "root");
    iconElement.setAttribute("part", "icon");
    titleElement.setAttribute("part", "title");
    subTitleElement.setAttribute("part", "sub-title");
    extraElement.setAttribute("part", "extra");
    copyElement.append(titleElement, subTitleElement);
    rootElement.append(iconElement, copyElement, extraElement);
    shadowRoot.replaceChildren(rootElement);
    applyResultStyles(shadowRoot);
    this.rootElement = rootElement;
    this.iconElement = iconElement;
    this.titleElement = titleElement;
    this.subTitleElement = subTitleElement;
  }
}

function createResultIcon(status: ResultStatus) {
  if (status === "403" || status === "404" || status === "500") {
    const code = document.createElement("span");

    code.className = "ds-result__status-code";
    code.textContent = status;

    return code;
  }

  const iconMap = {
    error: CircleX,
    info: Info,
    success: CircleCheck,
    warning: CircleAlert
  };

  return createLucideElement(iconMap[status] ?? BadgeAlert, {
    "aria-hidden": "true",
    focusable: "false",
    "stroke-width": 2
  });
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function applyResultStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    if (!resultStyleSheet) {
      resultStyleSheet = new CSSStyleSheet();
      resultStyleSheet.replaceSync(RESULT_STYLES);
    }

    if (!shadowRoot.adoptedStyleSheets.includes(resultStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, resultStyleSheet];
    }

    return;
  }

  const styleElement = document.createElement("style");

  styleElement.textContent = RESULT_STYLES;
  shadowRoot.prepend(styleElement);
}
