import { STEP_OBSERVED_ATTRIBUTES } from "./constants/Steps.constants";
import { getStepStatus, normalizeBooleanAttribute } from "./dom/Steps.dom";
import type { StepsStatus } from "./types/Steps.types";

export class DsStep extends HTMLElement {
  static observedAttributes = STEP_OBSERVED_ATTRIBUTES;

  attributeChangedCallback() {
    this.dispatchStepChange();
  }

  connectedCallback() {
    this.dispatchStepChange();
  }

  get description() {
    return this.getAttribute("description") ?? "";
  }

  set description(value: string) {
    this.syncNullableAttribute("description", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get icon() {
    return this.getAttribute("icon") ?? "";
  }

  set icon(value: string) {
    this.syncNullableAttribute("icon", value);
  }

  get itemKey() {
    return this.getAttribute("item-key") ?? "";
  }

  set itemKey(value: string) {
    this.syncNullableAttribute("item-key", value);
  }

  get status(): StepsStatus | undefined {
    return getStepStatus(this);
  }

  set status(value: StepsStatus | undefined) {
    this.syncNullableAttribute("status", value ?? "");
  }

  get subTitle() {
    return this.getAttribute("sub-title") ?? "";
  }

  set subTitle(value: string) {
    this.syncNullableAttribute("sub-title", value);
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    this.syncNullableAttribute("title", value);
  }

  private dispatchStepChange() {
    this.dispatchEvent(
      new CustomEvent("ds-step-change", {
        bubbles: true
      })
    );
  }

  private syncNullableAttribute(name: string, value: string) {
    if (value) {
      this.setAttribute(name, value);
      return;
    }

    this.removeAttribute(name);
  }
}
