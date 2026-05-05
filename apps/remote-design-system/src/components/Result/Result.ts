import { RESULT_OBSERVED_ATTRIBUTES } from "./constants/Result.constants";
import { getResultStatus, syncNullableAttribute } from "./dom/Result.dom";
import { createResultElements, type ResultElements } from "./dom/Result.structure";
import { createResultIcon } from "./icons/Result.icons";
import { applyResultStyles } from "./styles/Result.stylesheet";
import type { ResultStatus } from "./types/Result.types";

export class DsResult extends HTMLElement {
  static observedAttributes = RESULT_OBSERVED_ATTRIBUTES;

  private elements?: ResultElements;
  private renderedStatus?: ResultStatus;

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
    if (!this.isConnected && !this.elements) {
      return;
    }

    const elements = this.elements ?? this.initializeStructure();
    const status = this.status;
    const subTitle = this.subTitle;

    elements.rootElement.dataset.status = status;
    elements.titleElement.textContent = this.title;
    elements.subTitleElement.hidden = subTitle.length === 0;
    elements.subTitleElement.textContent = subTitle;
    this.syncIcon(elements, status);
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const elements = createResultElements();

    shadowRoot.replaceChildren(elements.rootElement);
    applyResultStyles(shadowRoot);
    this.elements = elements;

    return elements;
  }

  private syncIcon({ iconElement }: ResultElements, status: ResultStatus) {
    if (this.renderedStatus !== status) {
      iconElement.replaceChildren(createResultIcon(status));
      this.renderedStatus = status;
    }
  }
}
