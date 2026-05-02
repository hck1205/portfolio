import { TAB_CHANGE_EVENT, TAB_OBSERVED_ATTRIBUTES } from "./constants/Tabs.constants";
import { normalizeBooleanAttribute } from "./dom/Tabs.dom";

export class DsTab extends HTMLElement {
  static observedAttributes = TAB_OBSERVED_ATTRIBUTES;

  attributeChangedCallback() {
    this.dispatchTabChange();
  }

  connectedCallback() {
    this.setAttribute("role", "tabpanel");
    this.dispatchTabChange();
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get closable() {
    return normalizeBooleanAttribute(this, "closable", true);
  }

  set closable(value: boolean) {
    this.toggleAttribute("closable", value);
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

  get label() {
    return this.getAttribute("label") ?? "";
  }

  set label(value: string) {
    this.syncNullableAttribute("label", value);
  }

  syncFromParent({ active, buttonId, panelId }: { active: boolean; buttonId: string; panelId: string }) {
    this.hidden = !active;
    this.id = panelId;
    this.setAttribute("aria-labelledby", buttonId);
  }

  private dispatchTabChange() {
    this.dispatchEvent(
      new CustomEvent(TAB_CHANGE_EVENT, {
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
