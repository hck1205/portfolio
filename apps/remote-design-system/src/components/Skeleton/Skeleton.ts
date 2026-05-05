import { SKELETON_OBSERVED_ATTRIBUTES } from "./constants/Skeleton.constants";
import { getRowCount, normalizeBooleanAttribute } from "./dom/Skeleton.dom";
import { createSkeletonElements, createSkeletonLine, type SkeletonElements } from "./dom/Skeleton.structure";
import { applySkeletonStyles } from "./styles/Skeleton.stylesheet";

export class DsSkeleton extends HTMLElement {
  static observedAttributes = SKELETON_OBSERVED_ATTRIBUTES;

  private elements?: SkeletonElements;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get active() {
    return normalizeBooleanAttribute(this, "active", false);
  }

  set active(value: boolean) {
    this.setAttribute("active", String(value));
  }

  get avatar() {
    return normalizeBooleanAttribute(this, "avatar", false);
  }

  set avatar(value: boolean) {
    this.setAttribute("avatar", String(value));
  }

  get loading() {
    return normalizeBooleanAttribute(this, "loading", true);
  }

  set loading(value: boolean) {
    this.setAttribute("loading", String(value));
  }

  get paragraphRows() {
    return getRowCount(this);
  }

  set paragraphRows(value: number) {
    this.setAttribute("paragraph-rows", String(value));
  }

  get round() {
    return normalizeBooleanAttribute(this, "round", false);
  }

  set round(value: boolean) {
    this.setAttribute("round", String(value));
  }

  get titleVisible() {
    return normalizeBooleanAttribute(this, "title", true);
  }

  set titleVisible(value: boolean) {
    this.setAttribute("title", String(value));
  }

  private render() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    const elements = this.elements ?? this.initializeStructure();
    const active = this.active;
    const avatar = this.avatar;
    const loading = this.loading;

    elements.rootElement.dataset.active = String(active);
    elements.rootElement.dataset.avatar = String(avatar);
    elements.rootElement.dataset.round = String(this.round);
    elements.placeholderElement.hidden = !loading;
    elements.contentSlotElement.hidden = loading;
    elements.avatarElement.hidden = !avatar;
    elements.titleElement.hidden = !this.titleVisible;
    this.syncRows(elements);
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const elements = createSkeletonElements();

    shadowRoot.replaceChildren(elements.rootElement);
    applySkeletonStyles(shadowRoot);
    this.elements = elements;

    return elements;
  }

  private syncRows({ paragraphElement }: SkeletonElements) {
    const paragraphRows = this.paragraphRows;

    if (paragraphElement.childElementCount !== paragraphRows) {
      paragraphElement.replaceChildren(...Array.from({ length: paragraphRows }, createSkeletonLine));
    }
  }
}
