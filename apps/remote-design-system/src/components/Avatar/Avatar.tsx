import { User, createElement as createLucideElement } from "lucide";

import { AVATAR_GROUP_OBSERVED_ATTRIBUTES, AVATAR_OBSERVED_ATTRIBUTES } from "./constants/Avatar.constants";
import {
  getAvatarFit,
  getAvatarGap,
  getAvatarShape,
  getAvatarSize,
  getAvatarTextContent,
  getPositiveIntegerAttribute,
  syncNullableAttribute
} from "./dom/Avatar.dom";
import { applyAvatarGroupStyles, applyAvatarStyles } from "./Avatar.styles";
import type { AvatarFit, AvatarShape, AvatarSize } from "./types/Avatar.types";

export class DsAvatar extends HTMLElement {
  static observedAttributes = AVATAR_OBSERVED_ATTRIBUTES;

  private imageFailed = false;
  private rootElement?: HTMLSpanElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    if (name === "src") {
      this.imageFailed = false;
    }

    this.render();
  }

  get alt() {
    return this.getAttribute("alt") ?? this.text;
  }

  set alt(value: string) {
    syncNullableAttribute(this, "alt", value);
  }

  get fit(): AvatarFit {
    return getAvatarFit(this);
  }

  set fit(value: AvatarFit) {
    this.setAttribute("fit", value);
  }

  get gap() {
    return getAvatarGap(this);
  }

  set gap(value: number) {
    this.setAttribute("gap", String(value));
  }

  get icon() {
    return this.getAttribute("icon") ?? "";
  }

  set icon(value: string) {
    syncNullableAttribute(this, "icon", value);
  }

  get shape(): AvatarShape {
    return getAvatarShape(this);
  }

  set shape(value: AvatarShape) {
    this.setAttribute("shape", value);
  }

  get size(): AvatarSize {
    return getAvatarSize(this);
  }

  set size(value: AvatarSize) {
    this.setAttribute("size", value);
  }

  get src() {
    return this.getAttribute("src") ?? "";
  }

  set src(value: string) {
    syncNullableAttribute(this, "src", value);
  }

  get text() {
    return getAvatarTextContent(this);
  }

  set text(value: string) {
    syncNullableAttribute(this, "text", value);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.rootElement = document.createElement("span");
      this.rootElement.className = "ds-avatar";
      shadowRoot.replaceChildren(this.rootElement);
      applyAvatarStyles(shadowRoot);
    }

    this.setAttributeIfChanged("shape", this.shape);
    this.setAttributeIfChanged("size", this.size);
    this.rootElement.style.setProperty("--ds-avatar-fit", this.fit);
    this.rootElement.style.setProperty("--ds-avatar-gap", `${this.gap}px`);
    this.rootElement.replaceChildren(this.createContent());
  }

  private createContent() {
    if (this.src && !this.imageFailed) {
      return this.createImage();
    }

    if (this.text) {
      return this.createText();
    }

    return this.createIcon(User);
  }

  private createImage() {
    const image = document.createElement("img");

    this.rootElement?.setAttribute("data-tone", "image");
    image.alt = this.alt;
    image.className = "ds-avatar__image";
    image.draggable = false;
    image.src = this.src;
    image.addEventListener("error", () => {
      this.imageFailed = true;
      this.render();
    });

    return image;
  }

  private createText() {
    const text = document.createElement("span");
    const content = this.text;
    const size = this.getPixelSize();
    const fontSize = Math.min(14, Math.floor((size - this.gap * 2) / Math.max(content.length * 0.62, 1)));

    this.rootElement?.removeAttribute("data-tone");
    text.className = "ds-avatar__text";
    text.textContent = content;
    this.rootElement?.style.setProperty("--ds-avatar-font-size", `${Math.max(10, fontSize)}px`);

    return text;
  }

  private createIcon(icon: Parameters<typeof createLucideElement>[0]) {
    const size = this.size === "small" ? 14 : this.size === "large" ? 24 : 18;
    const element = createLucideElement(icon, {
      "aria-hidden": "true",
      class: "ds-avatar__icon",
      focusable: "false",
      height: size,
      width: size,
      "stroke-width": 2
    });

    this.rootElement?.setAttribute("data-tone", "icon");

    return element;
  }

  private getPixelSize() {
    if (this.size === "small") {
      return 24;
    }

    if (this.size === "large") {
      return 40;
    }

    return 32;
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}

export class DsAvatarGroup extends HTMLElement {
  static observedAttributes = AVATAR_GROUP_OBSERVED_ATTRIBUTES;

  private overflowElement?: HTMLSpanElement;
  private rootElement?: HTMLSpanElement;
  private slotElement?: HTMLSlotElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get maxCount() {
    return getPositiveIntegerAttribute(this, "max-count");
  }

  set maxCount(value: number | undefined) {
    syncNullableAttribute(this, "max-count", value === undefined ? "" : String(value));
  }

  get shape(): AvatarShape {
    return getAvatarShape(this);
  }

  set shape(value: AvatarShape) {
    this.setAttribute("shape", value);
  }

  get size(): AvatarSize {
    return getAvatarSize(this);
  }

  set size(value: AvatarSize) {
    this.setAttribute("size", value);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.slotElement = document.createElement("slot");
      this.overflowElement = document.createElement("span");
      this.rootElement = document.createElement("span");
      this.rootElement.className = "ds-avatar-group";
      this.overflowElement.className = "ds-avatar-group__overflow";
      this.slotElement.className = "ds-avatar-group__slot";
      this.slotElement.addEventListener("slotchange", () => this.syncItems());
      this.rootElement.append(this.slotElement, this.overflowElement);
      shadowRoot.replaceChildren(this.rootElement);
      applyAvatarGroupStyles(shadowRoot);
    }

    this.setAttributeIfChanged("shape", this.shape);
    this.setAttributeIfChanged("size", this.size);
    this.syncItems();
  }

  private syncItems() {
    const items = this.getAvatarItems();
    const maxCount = this.maxCount;
    const visibleCount = maxCount ? Math.min(maxCount, items.length) : items.length;
    const hiddenCount = Math.max(0, items.length - visibleCount);

    items.forEach((item, index) => {
      item.setAttribute("shape", this.shape);
      item.setAttribute("size", this.size);
      item.style.display = index < visibleCount ? "" : "none";
    });

    if (this.overflowElement) {
      this.overflowElement.dataset.visible = String(hiddenCount > 0);
      this.overflowElement.textContent = hiddenCount > 0 ? `+${hiddenCount}` : "";
    }
  }

  private getAvatarItems() {
    return (this.slotElement?.assignedElements({ flatten: true }) ?? []).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element.localName === "ds-avatar"
    );
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
