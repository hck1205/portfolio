import { EMPTY_OBSERVED_ATTRIBUTES } from "./constants/Empty.constants";
import { getEmptySize, isImageUrl, syncNullableAttribute } from "./dom/Empty.dom";
import { applyEmptyStyles, createEmptyIllustration } from "./Empty.render";
import type { EmptySize } from "./types/Empty.types";

export class DsEmpty extends HTMLElement {
  static observedAttributes = EMPTY_OBSERVED_ATTRIBUTES;

  private descriptionElement?: HTMLParagraphElement;
  private footerElement?: HTMLDivElement;
  private imageElement?: HTMLDivElement;
  private rootElement?: HTMLDivElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get description() {
    return this.getAttribute("description") ?? "No data";
  }

  set description(value: string) {
    syncNullableAttribute(this, "description", value);
  }

  get image() {
    return this.getAttribute("image") ?? "default";
  }

  set image(value: string) {
    syncNullableAttribute(this, "image", value);
  }

  get size(): EmptySize {
    return getEmptySize(this);
  }

  set size(value: EmptySize) {
    this.setAttribute("size", value);
  }

  private render() {
    if (!this.isConnected && !this.rootElement) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    this.setAttribute("size", this.size);
    this.syncImage();
    this.syncDescription();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("div");
    const imageElement = document.createElement("div");
    const descriptionElement = document.createElement("p");
    const footerElement = document.createElement("div");
    const slotElement = document.createElement("slot");

    rootElement.className = "ds-empty";
    imageElement.className = "ds-empty__image";
    descriptionElement.className = "ds-empty__description";
    footerElement.className = "ds-empty__footer";
    footerElement.append(slotElement);
    rootElement.append(imageElement, descriptionElement, footerElement);
    shadowRoot.replaceChildren(rootElement);
    applyEmptyStyles(shadowRoot);

    this.descriptionElement = descriptionElement;
    this.footerElement = footerElement;
    this.imageElement = imageElement;
    this.rootElement = rootElement;
  }

  private syncDescription() {
    if (!this.descriptionElement) {
      return;
    }

    const description = this.description;

    this.descriptionElement.hidden = description === "false";
    this.descriptionElement.textContent = description === "false" ? "" : description;
  }

  private syncImage() {
    if (!this.imageElement) {
      return;
    }

    const image = this.image;

    if (isImageUrl(image)) {
      const imageNode = document.createElement("img");

      imageNode.alt = "";
      imageNode.decoding = "async";
      imageNode.src = image;
      this.imageElement.replaceChildren(imageNode);
      return;
    }

    this.imageElement.replaceChildren(createEmptyIllustration(image === "simple" ? "simple" : "default"));
  }
}
