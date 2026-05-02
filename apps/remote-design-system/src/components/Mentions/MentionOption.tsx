import { MENTION_OPTION_CHANGE_EVENT, MENTION_OPTION_OBSERVED_ATTRIBUTES } from "./constants/Mentions.constants";
import { normalizeBooleanAttribute } from "./dom/Mentions.dom";

export class DsMentionOption extends HTMLElement {
  static observedAttributes = MENTION_OPTION_OBSERVED_ATTRIBUTES;

  connectedCallback() {
    this.hidden = true;
    this.dispatchChange();
  }

  attributeChangedCallback() {
    this.dispatchChange();
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get label() {
    return this.getAttribute("label") ?? this.textContent?.trim() ?? this.value;
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

  private dispatchChange() {
    this.dispatchEvent(
      new CustomEvent(MENTION_OPTION_CHANGE_EVENT, {
        bubbles: true
      })
    );
  }
}
