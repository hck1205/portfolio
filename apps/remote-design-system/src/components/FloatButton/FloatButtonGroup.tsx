import {
  FLOAT_BUTTON_ELEMENT_NAME,
  FLOAT_BUTTON_GROUP_OPEN_CHANGE_EVENT,
  FLOAT_BUTTON_GROUP_OBSERVED_ATTRIBUTES
} from "./constants/FloatButton.constants";
import {
  getFloatButtonGroupPlacement,
  getFloatButtonGroupTrigger,
  getFloatButtonShape,
  normalizeBooleanAttribute
} from "./dom/FloatButton.dom";
import {
  applyFloatButtonGroupStyles,
  createFloatButtonGroupElements,
  syncFloatButtonGroupElements,
  type FloatButtonGroupElements
} from "./FloatButton.render";
import type {
  FloatButtonGroupOpenChangeDetail,
  FloatButtonGroupPlacement,
  FloatButtonGroupTrigger,
  FloatButtonShape
} from "./types/FloatButton.types";

export class DsFloatButtonGroup extends HTMLElement {
  static observedAttributes = FLOAT_BUTTON_GROUP_OBSERVED_ATTRIBUTES;

  private elements?: FloatButtonGroupElements;
  private childObserver?: MutationObserver;

  connectedCallback() {
    this.render();
    this.childObserver = new MutationObserver(() => {
      this.syncChildren();
    });
    this.childObserver.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.childObserver?.disconnect();
    this.childObserver = undefined;
  }

  attributeChangedCallback() {
    this.render();
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get placement(): FloatButtonGroupPlacement {
    return getFloatButtonGroupPlacement(this);
  }

  set placement(value: FloatButtonGroupPlacement) {
    this.setAttribute("placement", value);
  }

  get shape(): FloatButtonShape {
    return getFloatButtonShape(this);
  }

  set shape(value: FloatButtonShape) {
    this.setAttribute("shape", value);
  }

  get trigger(): FloatButtonGroupTrigger | undefined {
    return getFloatButtonGroupTrigger(this);
  }

  set trigger(value: FloatButtonGroupTrigger | undefined) {
    if (value) {
      this.setAttribute("trigger", value);
      return;
    }

    this.removeAttribute("trigger");
  }

  private handleTriggerClick = (event: Event) => {
    if (this.trigger !== "click") {
      return;
    }

    this.setOpen(!this.open, event);
  };

  private handleMouseEnter = (event: Event) => {
    if (this.trigger === "hover") {
      this.setOpen(true, event);
    }
  };

  private handleMouseLeave = (event: Event) => {
    if (this.trigger === "hover") {
      this.setOpen(false, event);
    }
  };

  private setOpen(open: boolean, nativeEvent?: Event) {
    if (this.open === open) {
      return;
    }

    this.toggleAttribute("open", open);
    this.dispatchEvent(
      new CustomEvent<FloatButtonGroupOpenChangeDetail>(FLOAT_BUTTON_GROUP_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent,
          open
        }
      })
    );
  }

  /**
   * Keeps direct float-button children aligned with the group shape and static layout.
   */
  private syncChildren() {
    for (const child of this.children) {
      if (child.localName !== FLOAT_BUTTON_ELEMENT_NAME) {
        continue;
      }

      child.setAttribute("shape", this.shape);
      (child as HTMLElement).style.position = "static";
    }
  }

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncStructure();
    this.syncChildren();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createFloatButtonGroupElements({
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onTriggerClick: this.handleTriggerClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyFloatButtonGroupStyles(shadowRoot);
  }

  private syncAttributes() {
    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("shape", this.shape);
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    syncFloatButtonGroupElements({
      elements: this.elements,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onTriggerClick: this.handleTriggerClick,
      open: this.open,
      trigger: this.trigger
    });
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
