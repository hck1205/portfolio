import { createElement as createLucideElement } from "lucide";

import { ICON_OBSERVED_ATTRIBUTES } from "./constants/Icon.constants";
import { getIconNumberAttribute, normalizeBooleanAttribute } from "./dom/Icon.dom";
import { applyIconStyles } from "./Icon.styles";
import { getIconNode } from "./logic/Icon.registry";

export class DsIcon extends HTMLElement {
  static observedAttributes = ICON_OBSERVED_ATTRIBUTES;

  private rootElement?: SVGElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get decorative() {
    return normalizeBooleanAttribute(this, "decorative", !this.label);
  }

  set decorative(value: boolean) {
    this.setAttribute("decorative", String(value));
  }

  get icon() {
    return this.getAttribute("icon") ?? "";
  }

  set icon(value: string) {
    this.syncNullableAttribute("icon", value);
  }

  get label() {
    return this.getAttribute("label") ?? "";
  }

  set label(value: string) {
    this.syncNullableAttribute("label", value);
  }

  get size() {
    return getIconNumberAttribute(this, "size", 16);
  }

  set size(value: number) {
    this.setAttribute("size", String(value));
  }

  get strokeWidth() {
    return getIconNumberAttribute(this, "stroke-width", 2);
  }

  set strokeWidth(value: number) {
    this.setAttribute("stroke-width", String(value));
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const iconNode = getIconNode(this.icon);

    applyIconStyles(shadowRoot);
    this.style.setProperty("--ds-icon-size", `${this.size}px`);

    if (!iconNode) {
      shadowRoot.replaceChildren();
      this.rootElement = undefined;
      return;
    }

    const iconAttributes: Record<string, string | number> = {
      "aria-hidden": String(this.decorative),
      class: "ds-icon",
      focusable: "false",
      height: this.size,
      width: this.size,
      "stroke-width": this.strokeWidth
    };

    if (!this.decorative) {
      iconAttributes.role = "img";
    }

    const iconElement = createLucideElement(iconNode, iconAttributes);

    if (this.label && !this.decorative) {
      iconElement.setAttribute("aria-label", this.label);
    } else {
      iconElement.removeAttribute("aria-label");
    }

    this.rootElement = iconElement;
    shadowRoot.replaceChildren(iconElement);
    applyIconStyles(shadowRoot);
  }

  private syncNullableAttribute(name: string, value: string) {
    if (value) {
      this.setAttribute(name, value);
      return;
    }

    this.removeAttribute(name);
  }
}
