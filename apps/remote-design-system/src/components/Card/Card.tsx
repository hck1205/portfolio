import { CARD_GRID_OBSERVED_ATTRIBUTES, CARD_META_OBSERVED_ATTRIBUTES, CARD_OBSERVED_ATTRIBUTES } from "./constants/Card.constants";
import { getCardSize, getCardVariant, normalizeBooleanAttribute, syncNullableAttribute } from "./dom/Card.dom";
import { applyCardGridStyles, applyCardMetaStyles, applyCardStyles } from "./Card.styles";
import type { CardSize, CardVariant } from "./types/Card.types";

export class DsCard extends HTMLElement {
  static observedAttributes = CARD_OBSERVED_ATTRIBUTES;

  private actionsSlot?: HTMLSlotElement;
  private bodyElement?: HTMLDivElement;
  private coverElement?: HTMLDivElement;
  private coverImageElement?: HTMLImageElement;
  private coverSlot?: HTMLSlotElement;
  private extraElement?: HTMLDivElement;
  private extraLinkElement?: HTMLAnchorElement;
  private extraSlot?: HTMLSlotElement;
  private headerElement?: HTMLDivElement;
  private loadingElement?: HTMLDivElement;
  private rootElement?: HTMLDivElement;
  private titleElement?: HTMLDivElement;
  private titleSlot?: HTMLSlotElement;
  private titleTextElement?: HTMLSpanElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get coverSrc() {
    return this.getAttribute("cover-src") ?? "";
  }

  set coverSrc(value: string) {
    syncNullableAttribute(this, "cover-src", value);
  }

  get extra() {
    return this.getAttribute("extra") ?? "";
  }

  set extra(value: string) {
    syncNullableAttribute(this, "extra", value);
  }

  get extraHref() {
    return this.getAttribute("extra-href") ?? "";
  }

  set extraHref(value: string) {
    syncNullableAttribute(this, "extra-href", value);
  }

  get extraRel() {
    return this.getAttribute("extra-rel") ?? "";
  }

  set extraRel(value: string) {
    syncNullableAttribute(this, "extra-rel", value);
  }

  get extraTarget() {
    return this.getAttribute("extra-target") ?? "";
  }

  set extraTarget(value: string) {
    syncNullableAttribute(this, "extra-target", value);
  }

  get hoverable() {
    return normalizeBooleanAttribute(this, "hoverable", false);
  }

  set hoverable(value: boolean) {
    this.setAttribute("hoverable", String(value));
  }

  get loading() {
    return normalizeBooleanAttribute(this, "loading", false);
  }

  set loading(value: boolean) {
    this.setAttribute("loading", String(value));
  }

  get size(): CardSize {
    return getCardSize(this);
  }

  set size(value: CardSize) {
    this.setAttribute("size", value);
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  get variant(): CardVariant {
    return getCardVariant(this);
  }

  set variant(value: CardVariant) {
    this.setAttribute("variant", value);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    this.setAttributeIfChanged("hoverable", String(this.hoverable));
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.syncCover();
    this.syncHeader();
    this.syncBody();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const defaultSlot = document.createElement("slot");

    this.rootElement = document.createElement("div");
    this.coverElement = document.createElement("div");
    this.coverImageElement = document.createElement("img");
    this.coverSlot = document.createElement("slot");
    this.headerElement = document.createElement("div");
    this.titleElement = document.createElement("div");
    this.titleTextElement = document.createElement("span");
    this.titleSlot = document.createElement("slot");
    this.extraElement = document.createElement("div");
    this.extraLinkElement = document.createElement("a");
    this.extraSlot = document.createElement("slot");
    this.bodyElement = document.createElement("div");
    this.loadingElement = document.createElement("div");
    this.actionsSlot = document.createElement("slot");
    this.rootElement.className = "ds-card";
    this.coverElement.className = "ds-card__cover";
    this.headerElement.className = "ds-card__header";
    this.titleElement.className = "ds-card__title";
    this.extraElement.className = "ds-card__extra";
    this.extraLinkElement.className = "ds-card__extra-link";
    this.bodyElement.className = "ds-card__body";
    this.loadingElement.className = "ds-card__loading";
    this.actionsSlot.className = "ds-card__actions";
    this.titleSlot.name = "title";
    this.extraSlot.name = "extra";
    this.coverSlot.name = "cover";
    this.actionsSlot.name = "actions";
    this.titleElement.append(this.titleTextElement, this.titleSlot);
    this.extraElement.append(this.extraLinkElement, this.extraSlot);
    this.coverElement.append(this.coverImageElement, this.coverSlot);
    this.bodyElement.append(defaultSlot);
    this.loadingElement.append(...Array.from({ length: 3 }, () => this.createSkeleton()));
    this.rootElement.append(this.coverElement, this.headerElement, this.bodyElement, this.loadingElement, this.actionsSlot);
    this.headerElement.append(this.titleElement, this.extraElement);
    shadowRoot.replaceChildren(this.rootElement);
    applyCardStyles(shadowRoot);
  }

  private syncCover() {
    if (!this.coverElement) {
      return;
    }

    const assignedCover = this.querySelector("[slot='cover']");
    this.coverElement.hidden = !this.coverSrc && !assignedCover;
    this.coverImageElement!.hidden = !this.coverSrc || Boolean(assignedCover);
    this.coverSlot!.hidden = !assignedCover;

    if (this.coverSrc) {
      this.coverImageElement!.alt = this.title;
      this.coverImageElement!.src = this.coverSrc;
    }
  }

  private syncHeader() {
    if (!this.headerElement || !this.titleElement || !this.extraElement || !this.extraLinkElement || !this.titleTextElement || !this.titleSlot || !this.extraSlot) {
      return;
    }

    const assignedTitle = this.querySelector("[slot='title']");
    const assignedExtra = this.querySelector("[slot='extra']");

    this.titleTextElement.hidden = Boolean(assignedTitle);
    this.titleTextElement.textContent = assignedTitle ? "" : this.title;
    this.titleSlot.hidden = !assignedTitle;
    this.extraLinkElement.hidden = Boolean(assignedExtra) || !this.extra;
    this.extraLinkElement.textContent = assignedExtra ? "" : this.extra;
    this.syncExtraLink();
    this.extraSlot.hidden = !assignedExtra;
    this.headerElement.hidden = !this.title && !this.extra && !assignedTitle && !assignedExtra;
  }

  private syncExtraLink() {
    if (!this.extraLinkElement) {
      return;
    }

    const isHashLink = this.extraHref.startsWith("#");
    const target = isHashLink ? "" : this.extraTarget;

    syncNullableAttribute(this.extraLinkElement, "href", this.extraHref);
    syncNullableAttribute(this.extraLinkElement, "target", target);
    syncNullableAttribute(this.extraLinkElement, "rel", this.extraRel || (target === "_blank" ? "noopener noreferrer" : ""));
  }

  private syncBody() {
    if (!this.bodyElement || !this.loadingElement || !this.actionsSlot) {
      return;
    }

    const hasActions = Boolean(this.querySelector("[slot='actions']"));

    this.bodyElement.hidden = this.loading;
    this.loadingElement.hidden = !this.loading;
    this.actionsSlot.hidden = !hasActions;
  }

  private createSkeleton() {
    const item = document.createElement("span");

    item.className = "ds-card__skeleton";

    return item;
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}

export class DsCardGrid extends HTMLElement {
  static observedAttributes = CARD_GRID_OBSERVED_ATTRIBUTES;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get hoverable() {
    return normalizeBooleanAttribute(this, "hoverable", true);
  }

  set hoverable(value: boolean) {
    this.setAttribute("hoverable", String(value));
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    if (!shadowRoot.firstChild) {
      const slot = document.createElement("slot");

      shadowRoot.replaceChildren(slot);
      applyCardGridStyles(shadowRoot);
    }

    this.setAttributeIfChanged("hoverable", String(this.hoverable));
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}

export class DsCardMeta extends HTMLElement {
  static observedAttributes = CARD_META_OBSERVED_ATTRIBUTES;

  private avatarElement?: HTMLSpanElement;
  private descriptionElement?: HTMLSpanElement;
  private titleElement?: HTMLSpanElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get avatarSrc() {
    return this.getAttribute("avatar-src") ?? "";
  }

  set avatarSrc(value: string) {
    syncNullableAttribute(this, "avatar-src", value);
  }

  get description() {
    return this.getAttribute("description") ?? "";
  }

  set description(value: string) {
    syncNullableAttribute(this, "description", value);
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.titleElement) {
      this.initializeStructure();
    }

    this.syncMeta();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const root = document.createElement("div");
    const content = document.createElement("span");

    this.avatarElement = document.createElement("span");
    this.titleElement = document.createElement("span");
    this.descriptionElement = document.createElement("span");
    root.className = "ds-card-meta";
    content.className = "ds-card-meta__content";
    this.avatarElement.className = "ds-card-meta__avatar";
    this.titleElement.className = "ds-card-meta__title";
    this.descriptionElement.className = "ds-card-meta__description";
    content.append(this.titleElement, this.descriptionElement);
    root.append(this.avatarElement, content);
    shadowRoot.replaceChildren(root);
    applyCardMetaStyles(shadowRoot);
  }

  private syncMeta() {
    if (!this.avatarElement || !this.titleElement || !this.descriptionElement) {
      return;
    }

    this.avatarElement.hidden = !this.avatarSrc;
    this.avatarElement.replaceChildren();

    if (this.avatarSrc) {
      const image = document.createElement("img");

      image.alt = this.title;
      image.src = this.avatarSrc;
      this.avatarElement.append(image);
    }

    this.titleElement.textContent = this.title;
    this.descriptionElement.textContent = this.description;
  }
}
