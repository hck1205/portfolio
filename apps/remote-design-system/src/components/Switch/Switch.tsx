import {
  SWITCH_CHANGE_EVENT,
  SWITCH_CLICK_EVENT,
  SWITCH_OBSERVED_ATTRIBUTES
} from "./constants/Switch.constants";
import { getInitialChecked, getSwitchSize, normalizeBooleanAttribute } from "./dom/Switch.dom";
import { createSwitchElements, syncSwitchElements } from "./render/Switch.render";
import { applySwitchStyles } from "./Switch.styles";
import type { SwitchChangeDetail, SwitchElements, SwitchSize } from "./types/Switch.types";

export class DsSwitch extends HTMLElement {
  static observedAttributes = SWITCH_OBSERVED_ATTRIBUTES;

  private elements?: SwitchElements;
  private internalChecked?: boolean;
  private isSyncingAttributes = false;

  connectedCallback() {
    this.internalChecked ??= getInitialChecked(this);
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (this.isSyncingAttributes || oldValue === newValue) {
      return;
    }

    if (name === "checked" || name === "value") {
      this.internalChecked = getInitialChecked(this);
    }

    this.render();
  }

  get checked() {
    return this.internalChecked ?? getInitialChecked(this);
  }

  set checked(value: boolean) {
    this.setChecked(value, undefined);
  }

  get checkedChildren() {
    return this.getAttribute("checked-children") ?? "";
  }

  set checkedChildren(value: string) {
    this.setAttribute("checked-children", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get loading() {
    return normalizeBooleanAttribute(this, "loading", false);
  }

  set loading(value: boolean) {
    this.toggleAttribute("loading", value);
  }

  get size(): SwitchSize {
    return getSwitchSize(this);
  }

  set size(value: SwitchSize) {
    this.setAttribute("size", value);
  }

  get uncheckedChildren() {
    return this.getAttribute("unchecked-children") ?? "";
  }

  set uncheckedChildren(value: string) {
    this.setAttribute("unchecked-children", value);
  }

  get value() {
    return this.checked;
  }

  set value(value: boolean) {
    this.checked = value;
  }

  focus(options?: FocusOptions) {
    this.elements?.button.focus(options);
  }

  blur() {
    this.elements?.button.blur();
  }

  private handleClick = (event: MouseEvent) => {
    if (this.disabled || this.loading) {
      return;
    }

    const nextChecked = !this.checked;

    this.setChecked(nextChecked, event);
    this.dispatchEvent(
      new CustomEvent<SwitchChangeDetail>(SWITCH_CLICK_EVENT, {
        bubbles: true,
        detail: {
          checked: nextChecked,
          nativeEvent: event
        }
      })
    );
  };

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncStructure();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createSwitchElements({
      onClick: this.handleClick
    });
    shadowRoot.replaceChildren(this.elements.root);
    applySwitchStyles(shadowRoot);
  }

  private syncAttributes() {
    this.isSyncingAttributes = true;

    try {
      this.setAttributeIfChanged("size", this.size);
      this.toggleAttributeIfChanged("checked", this.checked);
      this.toggleAttributeIfChanged("value", this.checked);
    } finally {
      this.isSyncingAttributes = false;
    }
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    syncSwitchElements(this.elements, {
      checked: this.checked,
      checkedChildren: this.checkedChildren,
      disabled: this.disabled,
      loading: this.loading,
      size: this.size,
      uncheckedChildren: this.uncheckedChildren
    });
  }

  private setChecked(checked: boolean, nativeEvent?: Event) {
    this.internalChecked = checked;
    this.render();
    this.dispatchEvent(
      new CustomEvent<SwitchChangeDetail>(SWITCH_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          checked,
          nativeEvent
        }
      })
    );
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
