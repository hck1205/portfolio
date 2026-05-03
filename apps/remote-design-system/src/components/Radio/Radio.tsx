import { RADIO_CHANGE_EVENT, RADIO_OBSERVED_ATTRIBUTES } from "./constants/Radio.constants";
import { normalizeBooleanAttribute, syncNullableAttribute } from "./dom/Radio.dom";
import {
  applyRadioStyles,
  createRadioElements,
  syncRadioElements,
  type RadioElements
} from "./Radio.render";
import type {
  RadioButtonStyle,
  RadioChangeDetail,
  RadioGroupSyncOptions,
  RadioOptionType,
  RadioSize,
  RadioValue
} from "./types/Radio.types";

export class DsRadio extends HTMLElement {
  static observedAttributes = RADIO_OBSERVED_ATTRIBUTES;

  private elements?: RadioElements;
  private groupBlock = false;
  private groupButtonStyle: RadioButtonStyle = "outline";
  private groupChecked?: boolean;
  private groupDisabled = false;
  private groupName = "";
  private groupOptionType: RadioOptionType = "default";
  private groupSize: RadioSize = "middle";
  private hasAppliedDefaultChecked = false;
  private internalChecked = false;
  private valueState?: RadioValue;

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

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value: string) {
    syncNullableAttribute(this, "name", value);
  }

  get nativeElement() {
    return this.elements?.inputElement;
  }

  get value(): RadioValue {
    return this.valueState ?? this.getAttribute("value") ?? "on";
  }

  set value(value: RadioValue) {
    this.valueState = typeof value === "string" ? undefined : value;
    this.setAttribute("value", String(value));
  }

  blur() {
    this.elements?.inputElement.blur();
  }

  focus() {
    this.elements?.inputElement.focus();
  }

  syncFromGroup({
    block,
    buttonStyle,
    checked,
    disabled,
    name,
    optionType,
    size
  }: RadioGroupSyncOptions) {
    this.groupBlock = block;
    this.groupButtonStyle = buttonStyle;
    this.groupChecked = checked;
    this.groupDisabled = disabled;
    this.groupName = name;
    this.groupOptionType = optionType;
    this.groupSize = size;
    this.render();
  }

  clearGroupSync() {
    this.groupBlock = false;
    this.groupButtonStyle = "outline";
    this.groupChecked = undefined;
    this.groupDisabled = false;
    this.groupName = "";
    this.groupOptionType = "default";
    this.groupSize = "middle";
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

    this.dispatchEvent(
      new CustomEvent<RadioChangeDetail>(RADIO_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          checked: nextChecked,
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

    this.elements = createRadioElements(this.handleChange);
    shadowRoot.replaceChildren(this.elements.labelElement);
    applyRadioStyles(shadowRoot);
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
    this.toggleAttribute("data-block", this.groupBlock);
    this.toggleAttribute("data-checked", this.checked);
    this.toggleAttribute("data-disabled", this.effectiveDisabled);
    this.setAttribute("data-button-style", this.groupButtonStyle);
    this.setAttribute("data-option-type", this.groupOptionType);
    this.setAttribute("data-size", this.groupSize);
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    syncRadioElements({
      ariaLabel: this.getAttribute("aria-label") ?? "",
      checked: this.checked,
      disabled: this.effectiveDisabled,
      elements: this.elements,
      name: this.effectiveName,
      value: String(this.value)
    });
  }
}
