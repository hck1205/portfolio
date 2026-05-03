import { SELECT_OPTION_CHANGE_EVENT, SELECT_OPTION_OBSERVED_ATTRIBUTES } from "./constants/Select.constants";
import { normalizeBooleanAttribute } from "./dom/Select.dom";
import type { SelectOption } from "./types/Select.types";

export class DsSelectOption extends HTMLElement {
  static observedAttributes = SELECT_OPTION_OBSERVED_ATTRIBUTES;

  attributeChangedCallback() {
    this.dispatchOptionChange();
  }

  connectedCallback() {
    this.dispatchOptionChange();
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get label() {
    return this.getAttribute("label") || this.textContent?.trim() || this.value;
  }

  set label(value: string) {
    this.setAttribute("label", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  toOption(): SelectOption | undefined {
    if (!this.value) {
      return undefined;
    }

    return {
      disabled: this.disabled,
      label: this.label,
      title: this.getAttribute("title") ?? undefined,
      value: this.value
    };
  }

  private dispatchOptionChange() {
    this.dispatchEvent(
      new CustomEvent(SELECT_OPTION_CHANGE_EVENT, {
        bubbles: true
      })
    );
  }
}
