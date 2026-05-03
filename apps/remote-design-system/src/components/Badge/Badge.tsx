import { BADGE_OBSERVED_ATTRIBUTES, BADGE_RIBBON_OBSERVED_ATTRIBUTES } from "./constants/Badge.constants";
import {
  getBadgeCountText,
  getBadgeOffset,
  getBadgeOverflowCount,
  getBadgeSize,
  getBadgeStatus,
  getRibbonPlacement,
  normalizeBooleanAttribute,
  syncNullableAttribute
} from "./dom/Badge.dom";
import { applyBadgeRibbonStyles, applyBadgeStyles } from "./Badge.styles";
import type { BadgeRibbonPlacement, BadgeSize, BadgeStatus } from "./types/Badge.types";

export class DsBadge extends HTMLElement {
  static observedAttributes = BADGE_OBSERVED_ATTRIBUTES;

  private indicatorElement?: HTMLElement;
  private rootElement?: HTMLSpanElement;
  private slotElement?: HTMLSlotElement;
  private statusTextElement?: HTMLSpanElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get color() {
    return this.getAttribute("color") ?? "";
  }

  set color(value: string) {
    syncNullableAttribute(this, "color", value);
  }

  get count() {
    return this.getAttribute("count") ?? "";
  }

  set count(value: string) {
    syncNullableAttribute(this, "count", value);
  }

  get dot() {
    return normalizeBooleanAttribute(this, "dot", false);
  }

  set dot(value: boolean) {
    this.toggleAttribute("dot", value);
  }

  get overflowCount() {
    return getBadgeOverflowCount(this);
  }

  set overflowCount(value: number) {
    this.setAttribute("overflow-count", String(value));
  }

  get showZero() {
    return normalizeBooleanAttribute(this, "show-zero", false);
  }

  set showZero(value: boolean) {
    this.setAttribute("show-zero", String(value));
  }

  get size(): BadgeSize {
    return getBadgeSize(this);
  }

  set size(value: BadgeSize) {
    this.setAttribute("size", value);
  }

  get status(): BadgeStatus | undefined {
    return getBadgeStatus(this);
  }

  set status(value: BadgeStatus | undefined) {
    syncNullableAttribute(this, "status", value ?? "");
  }

  get text() {
    return this.getAttribute("text") ?? "";
  }

  set text(value: string) {
    syncNullableAttribute(this, "text", value);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    const hasContent = Boolean(this.slotElement?.assignedNodes({ flatten: true }).some((node) => node.textContent?.trim() || node.nodeType === Node.ELEMENT_NODE));
    const status = this.status;
    const standalone = !hasContent || Boolean(status);
    const [offsetX, offsetY] = getBadgeOffset(this);

    this.setAttributeIfChanged("size", this.size);
    if (this.rootElement) {
      this.rootElement.dataset.standalone = String(standalone);
    }
    this.indicatorElement?.style.setProperty("--ds-badge-offset-x", `${offsetX}px`);
    this.indicatorElement?.style.setProperty("--ds-badge-offset-y", `${offsetY}px`);
    if (this.color) {
      this.indicatorElement?.style.setProperty("--ds-badge-color", this.color);
    } else {
      this.indicatorElement?.style.removeProperty("--ds-badge-color");
    }
    this.syncIndicator({ standalone, status });
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.rootElement = document.createElement("span");
    this.slotElement = document.createElement("slot");
    this.indicatorElement = document.createElement("sup");
    this.statusTextElement = document.createElement("span");
    this.rootElement.className = "ds-badge";
    this.slotElement.className = "ds-badge__content";
    this.indicatorElement.className = "ds-badge__indicator";
    this.statusTextElement.className = "ds-badge__status";
    this.slotElement.addEventListener("slotchange", () => this.render());
    this.rootElement.append(this.slotElement, this.indicatorElement, this.statusTextElement);
    shadowRoot.replaceChildren(this.rootElement);
    applyBadgeStyles(shadowRoot);
  }

  private syncIndicator({ standalone, status }: { standalone: boolean; status?: BadgeStatus }) {
    if (!this.indicatorElement || !this.statusTextElement) {
      return;
    }

    const countText = getBadgeCountText(this.count, this.overflowCount);
    const shouldHide = !status && !this.dot && (countText === "" || (countText === "0" && !this.showZero));

    this.indicatorElement.dataset.dot = String(this.dot || Boolean(status));
    this.indicatorElement.dataset.hidden = String(shouldHide);
    this.indicatorElement.dataset.size = this.size;
    this.indicatorElement.dataset.standalone = String(standalone);
    this.indicatorElement.dataset.status = status ?? "";
    this.indicatorElement.title = this.getAttribute("title") ?? countText;
    this.indicatorElement.textContent = this.dot || status ? "" : countText;
    this.statusTextElement.hidden = !status || !this.text;
    this.statusTextElement.textContent = this.text;
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}

export class DsBadgeRibbon extends HTMLElement {
  static observedAttributes = BADGE_RIBBON_OBSERVED_ATTRIBUTES;

  private labelElement?: HTMLSpanElement;
  private rootElement?: HTMLSpanElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get color() {
    return this.getAttribute("color") ?? "";
  }

  set color(value: string) {
    syncNullableAttribute(this, "color", value);
  }

  get placement(): BadgeRibbonPlacement {
    return getRibbonPlacement(this);
  }

  set placement(value: BadgeRibbonPlacement) {
    this.setAttribute("placement", value);
  }

  get text() {
    return this.getAttribute("text") ?? "";
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
      const slot = document.createElement("slot");

      this.rootElement = document.createElement("span");
      this.labelElement = document.createElement("span");
      this.rootElement.className = "ds-badge-ribbon";
      slot.className = "ds-badge-ribbon__content";
      this.labelElement.className = "ds-badge-ribbon__label";
      this.rootElement.append(slot, this.labelElement);
      shadowRoot.replaceChildren(this.rootElement);
      applyBadgeRibbonStyles(shadowRoot);
    }

    this.setAttributeIfChanged("placement", this.placement);
    if (this.color) {
      this.labelElement!.style.setProperty("--ds-ribbon-color", this.color);
    } else {
      this.labelElement!.style.removeProperty("--ds-ribbon-color");
    }
    this.labelElement!.textContent = this.text;
    this.labelElement!.hidden = !this.text;
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
