import {
  AUTO_COMPLETE_OPTION_CHANGE_EVENT,
  AUTO_COMPLETE_OPTION_ELEMENT_NAME,
  AUTO_COMPLETE_OPTION_OBSERVED_ATTRIBUTES
} from "./constants/AutoComplete.constants";
import type { AutoCompleteOption } from "./types/AutoComplete.types";

export class DsAutoCompleteOption extends HTMLElement {
  static observedAttributes = AUTO_COMPLETE_OPTION_OBSERVED_ATTRIBUTES;

  attributeChangedCallback() {
    this.dispatchOptionChange();
  }

  connectedCallback() {
    this.setAttribute("aria-hidden", "true");
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get label() {
    return this.getAttribute("label") ?? this.textContent?.trim() ?? "";
  }

  set label(value: string) {
    this.setAttribute("label", value);
  }

  get value() {
    return this.getAttribute("value") ?? this.textContent?.trim() ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  toOption(): AutoCompleteOption | undefined {
    if (!this.value) {
      return undefined;
    }

    return {
      disabled: this.disabled,
      label: this.label || this.value,
      value: this.value
    };
  }

  private dispatchOptionChange() {
    this.dispatchEvent(
      new CustomEvent(AUTO_COMPLETE_OPTION_CHANGE_EVENT, {
        bubbles: true
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [AUTO_COMPLETE_OPTION_ELEMENT_NAME]: DsAutoCompleteOption;
  }
}
