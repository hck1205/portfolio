import {
  ANCHOR_CLICK_EVENT,
  ANCHOR_LINK_OBSERVED_ATTRIBUTES
} from "./constants/Anchor.constants";
import { normalizeBooleanAttribute } from "./dom/Anchor.dom";
import {
  applyAnchorLinkStyles,
  createAnchorLinkElements,
  hasAssignedLabel,
  syncAnchorLinkElements,
  type AnchorLinkElements
} from "./render/Anchor.render";
import type { AnchorClickDetail, AnchorDirection } from "./types/Anchor.types";

export class DsAnchorLink extends HTMLElement {
  static observedAttributes = ANCHOR_LINK_OBSERVED_ATTRIBUTES;

  private active = false;
  private direction: AnchorDirection = "vertical";
  private elements?: AnchorLinkElements;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get href() {
    return this.getAttribute("href") ?? "";
  }

  set href(value: string) {
    this.syncNullableAttribute("href", value);
  }

  get target() {
    return this.getAttribute("target") ?? "";
  }

  set target(value: string) {
    this.syncNullableAttribute("target", value);
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    this.syncNullableAttribute("title", value);
  }

  syncFromAnchor({ active, direction }: { active: boolean; direction: AnchorDirection }) {
    if (this.active === active && this.direction === direction) {
      return;
    }

    this.active = active;
    this.direction = direction;
    this.render();
  }

  private handleClick = (event: Event) => {
    const nativeEvent = event as MouseEvent;

    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent<AnchorClickDetail>(ANCHOR_CLICK_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          href: this.href,
          nativeEvent
        }
      })
    );
  };

  private handleLabelSlotChange = () => {
    if (!this.elements) {
      return;
    }

    this.elements.labelElement.hidden = hasAssignedLabel(this.elements.labelSlotElement);
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.handleLabelSlotChange();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createAnchorLinkElements({
      onClick: this.handleClick,
      onLabelSlotChange: this.handleLabelSlotChange
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyAnchorLinkStyles(shadowRoot);
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    this.toggleAttributeIfChanged("data-active", this.active);
    this.toggleAttributeIfChanged("aria-disabled", this.disabled);
    this.setAttributeIfChanged("data-direction", this.direction);

    syncAnchorLinkElements({
      active: this.active,
      disabled: this.disabled,
      elements: this.elements,
      href: this.href,
      target: this.target,
      title: this.title
    });
  }

  private syncNullableAttribute(name: string, value: string) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }

  private toggleAttributeIfChanged(name: string, force: boolean) {
    if (this.hasAttribute(name) !== force) {
      this.toggleAttribute(name, force);
    }
  }
}
