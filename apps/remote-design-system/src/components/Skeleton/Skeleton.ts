import { SKELETON_OBSERVED_ATTRIBUTES } from "./constants/Skeleton.constants";
import { getRowCount, normalizeBooleanAttribute } from "./dom/Skeleton.dom";
import { SKELETON_STYLES } from "./Skeleton.styles";

let skeletonStyleSheet: CSSStyleSheet | undefined;

export class DsSkeleton extends HTMLElement {
  static observedAttributes = SKELETON_OBSERVED_ATTRIBUTES;

  private avatarElement?: HTMLDivElement;
  private contentSlotElement?: HTMLSlotElement;
  private paragraphElement?: HTMLDivElement;
  private placeholderElement?: HTMLDivElement;
  private rootElement?: HTMLDivElement;
  private titleElement?: HTMLDivElement;

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
    if (!this.isConnected && !this.rootElement) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    if (this.rootElement) {
      this.rootElement.dataset.active = String(this.active);
      this.rootElement.dataset.round = String(this.round);
    }
    if (this.placeholderElement) {
      this.placeholderElement.hidden = !this.loading;
    }
    if (this.contentSlotElement) {
      this.contentSlotElement.hidden = this.loading;
    }
    if (this.avatarElement) {
      this.avatarElement.hidden = !this.avatar;
    }
    if (this.titleElement) {
      this.titleElement.hidden = !this.titleVisible;
    }
    this.syncRows();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("div");
    const placeholderElement = document.createElement("div");
    const avatarElement = document.createElement("div");
    const bodyElement = document.createElement("div");
    const titleElement = document.createElement("div");
    const paragraphElement = document.createElement("div");
    const contentSlotElement = document.createElement("slot");

    rootElement.className = "ds-skeleton";
    placeholderElement.className = "ds-skeleton__placeholder";
    avatarElement.className = "ds-skeleton__avatar";
    bodyElement.className = "ds-skeleton__body";
    titleElement.className = "ds-skeleton__title";
    paragraphElement.className = "ds-skeleton__paragraph";
    contentSlotElement.className = "ds-skeleton__content";
    rootElement.setAttribute("part", "root");
    placeholderElement.setAttribute("part", "placeholder");
    avatarElement.setAttribute("part", "avatar");
    titleElement.setAttribute("part", "title");
    paragraphElement.setAttribute("part", "paragraph");
    contentSlotElement.setAttribute("part", "content");
    placeholderElement.setAttribute("aria-hidden", "true");
    bodyElement.append(titleElement, paragraphElement);
    placeholderElement.append(avatarElement, bodyElement);
    rootElement.append(placeholderElement, contentSlotElement);
    shadowRoot.replaceChildren(rootElement);
    applySkeletonStyles(shadowRoot);
    this.rootElement = rootElement;
    this.placeholderElement = placeholderElement;
    this.avatarElement = avatarElement;
    this.titleElement = titleElement;
    this.paragraphElement = paragraphElement;
    this.contentSlotElement = contentSlotElement;
  }

  private syncRows() {
    if (!this.paragraphElement) {
      return;
    }

    if (this.paragraphElement.children.length !== this.paragraphRows) {
      this.paragraphElement.replaceChildren(
        ...Array.from({ length: this.paragraphRows }, () => {
          const row = document.createElement("span");

          row.className = "ds-skeleton__line";
          return row;
        })
      );
    }
  }
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function applySkeletonStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    if (!skeletonStyleSheet) {
      skeletonStyleSheet = new CSSStyleSheet();
      skeletonStyleSheet.replaceSync(SKELETON_STYLES);
    }

    if (!shadowRoot.adoptedStyleSheets.includes(skeletonStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, skeletonStyleSheet];
    }

    return;
  }

  const styleElement = document.createElement("style");

  styleElement.textContent = SKELETON_STYLES;
  shadowRoot.prepend(styleElement);
}
