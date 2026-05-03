import { CHECKBOX_CHANGE_EVENT, CHECKBOX_OBSERVED_ATTRIBUTES } from "./constants/Checkbox.constants";
import { normalizeBooleanAttribute, syncNullableAttribute } from "./dom/Checkbox.dom";
import {
  applyCheckboxStyles,
  createCheckboxElements,
  syncCheckboxElements,
  type CheckboxElements
} from "./Checkbox.render";
import type {
  CheckboxChangeDetail,
  CheckboxGroupSyncOptions,
  CheckboxValue
} from "./types/Checkbox.types";

export class DsCheckbox extends HTMLElement {
  static observedAttributes = CHECKBOX_OBSERVED_ATTRIBUTES;

  private elements?: CheckboxElements;
  private groupChecked?: boolean;
  private groupDisabled = false;
  private groupName = "";
  private hasAppliedDefaultChecked = false;
  private internalChecked = false;
  private valueState?: CheckboxValue;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === "value" && this.valueState !== undefined && String(this.valueState) !== newValue) {
      this.valueState = undefined;
    }

    this.requestRender();
  }

  get checked() {
    if (this.groupChecked !== undefined) {
      return this.groupChecked;
    }

    if (this.hasAttribute("checked")) {
      return normalizeBooleanAttribute(this, "checked", false);
    }

    return this.internalChecked;
  }

  set checked(value: boolean) {
    this.internalChecked = value;
    this.toggleAttribute("checked", value);
  }

  get defaultChecked() {
    return normalizeBooleanAttribute(this, "default-checked", false);
  }

  set defaultChecked(value: boolean) {
    if (!this.hasAttribute("checked") && !this.hasAppliedDefaultChecked) {
      this.internalChecked = value;
    }

    this.toggleAttribute("default-checked", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get indeterminate() {
    return normalizeBooleanAttribute(this, "indeterminate", false);
  }

  set indeterminate(value: boolean) {
    this.toggleAttribute("indeterminate", value);
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value: string) {
    syncNullableAttribute(this, "name", value);
  }

  get nativeElement() {
    return this.elements?.inputElement;
  }

  get value(): CheckboxValue {
    return this.valueState ?? this.getAttribute("value") ?? "on";
  }

  set value(value: CheckboxValue) {
    this.valueState = typeof value === "string" ? undefined : value;
    this.setAttribute("value", String(value));
  }

  blur() {
    this.elements?.inputElement.blur();
  }

  focus() {
    this.elements?.inputElement.focus();
  }

  syncFromGroup({ checked, disabled, name }: CheckboxGroupSyncOptions) {
    this.groupChecked = checked;
    this.groupDisabled = disabled;
    this.groupName = name;
    this.render();
  }

  clearGroupSync() {
    this.groupChecked = undefined;
    this.groupDisabled = false;
    this.groupName = "";
    this.render();
  }

  private handleChange = (event: Event) => {
    if (!this.elements) {
      return;
    }

    const nextChecked = this.elements.inputElement.checked;

    if (this.effectiveDisabled) {
      event.preventDefault();
      this.render();
      return;
    }

    if (this.groupChecked === undefined) {
      this.checked = nextChecked;
    }

    if (this.indeterminate) {
      this.indeterminate = false;
    }

    this.dispatchEvent(
      new CustomEvent<CheckboxChangeDetail>(CHECKBOX_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          checked: nextChecked,
          indeterminate: this.indeterminate,
          nativeEvent: event,
          value: this.value
        }
      })
    );
  };

  private get effectiveDisabled() {
    return this.disabled || this.groupDisabled;
  }

  private get effectiveName() {
    return this.name || this.groupName;
  }

  private render() {
    this.applyDefaultChecked();

    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncStructure();
  }

  private requestRender() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    this.render();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createCheckboxElements(this.handleChange);
    shadowRoot.replaceChildren(this.elements.labelElement);
    applyCheckboxStyles(shadowRoot);
  }

  private applyDefaultChecked() {
    if (this.hasAppliedDefaultChecked) {
      return;
    }

    if (!this.hasAttribute("checked")) {
      this.internalChecked = this.defaultChecked;
    }

    this.hasAppliedDefaultChecked = true;
  }

  private syncAttributes() {
    this.toggleAttribute("data-checked", this.checked);
    this.toggleAttribute("data-disabled", this.effectiveDisabled);
    this.toggleAttribute("data-indeterminate", this.indeterminate);
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    syncCheckboxElements({
      ariaLabel: this.getAttribute("aria-label") ?? "",
      checked: this.checked,
      disabled: this.effectiveDisabled,
      elements: this.elements,
      indeterminate: this.indeterminate,
      name: this.effectiveName,
      value: String(this.value)
    });
  }
}
