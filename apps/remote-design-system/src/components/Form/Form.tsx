import {
  DEFAULT_FORM_VALIDATE_TRIGGER,
  FORM_ITEM_ELEMENT_NAME,
  FORM_OBSERVED_ATTRIBUTES,
  FORM_RESET_EVENT,
  FORM_SUBMIT_EVENT,
  FORM_SUBMIT_FAILED_EVENT,
  FORM_VALUES_CHANGE_EVENT
} from "./constants/Form.constants";
import {
  getFormLabelAlign,
  getFormLayout,
  getFormRequiredMark,
  getFormSize,
  getFormValues,
  getFormVariant,
  normalizeBooleanAttribute
} from "./dom/Form.dom";
import { DsFormItem } from "./FormItem";
import type {
  FormLabelAlign,
  FormLayout,
  FormResetDetail,
  FormRequiredMark,
  FormSize,
  FormSubmitDetail,
  FormSubmitFailedDetail,
  FormValues,
  FormValuesChangeDetail,
  FormValidateTrigger,
  FormVariant
} from "./types/Form.types";

const INTERNAL_ATTRIBUTE = "data-ds-form-internal";

export class DsForm extends HTMLElement {
  static observedAttributes = FORM_OBSERVED_ATTRIBUTES;

  private formElement?: HTMLFormElement;
  private mutationObserver?: MutationObserver;
  private previousValues: FormValues = {};

  connectedCallback() {
    this.initializeStructure();
    this.observeChildChanges();
    this.sync();
  }

  disconnectedCallback() {
    this.mutationObserver?.disconnect();
    this.formElement?.removeEventListener("submit", this.handleSubmit);
    this.formElement?.removeEventListener("reset", this.handleReset);
    this.formElement?.removeEventListener("input", this.handleValuesChange);
    this.formElement?.removeEventListener("change", this.handleValuesChange);
  }

  attributeChangedCallback() {
    this.sync();
  }

  get colon() {
    return normalizeBooleanAttribute(this, "colon", true);
  }

  set colon(value: boolean) {
    this.setAttribute("colon", String(value));
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get labelAlign(): FormLabelAlign {
    return getFormLabelAlign(this);
  }

  set labelAlign(value: FormLabelAlign) {
    this.setAttribute("label-align", value);
  }

  get layout(): FormLayout {
    return getFormLayout(this);
  }

  set layout(value: FormLayout) {
    this.setAttribute("layout", value);
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value: string) {
    this.setAttribute("name", value);
  }

  get requiredMark(): FormRequiredMark {
    return getFormRequiredMark(this);
  }

  set requiredMark(value: FormRequiredMark) {
    this.setAttribute("required-mark", value);
  }

  get size(): FormSize {
    return getFormSize(this);
  }

  set size(value: FormSize) {
    this.setAttribute("size", value);
  }

  get validateTrigger(): FormValidateTrigger {
    const value = this.getAttribute("validate-trigger");

    return value === "onChange" ? value : DEFAULT_FORM_VALIDATE_TRIGGER;
  }

  set validateTrigger(value: FormValidateTrigger) {
    this.setAttribute("validate-trigger", value);
  }

  get variant(): FormVariant {
    return getFormVariant(this);
  }

  set variant(value: FormVariant) {
    this.setAttribute("variant", value);
  }

  submit() {
    this.formElement?.requestSubmit();
  }

  reset() {
    this.formElement?.reset();
    this.clearValidation();
  }

  getValues() {
    return this.formElement ? getFormValues(this.formElement) : {};
  }

  validateFields() {
    return this.validateItems();
  }

  private initializeStructure() {
    if (this.formElement) {
      return;
    }

    this.formElement = document.createElement("form");
    this.formElement.className = "ds-form__native";
    this.formElement.noValidate = true;
    this.formElement.setAttribute(INTERNAL_ATTRIBUTE, "");
    this.formElement.addEventListener("submit", this.handleSubmit);
    this.formElement.addEventListener("reset", this.handleReset);
    this.formElement.addEventListener("input", this.handleValuesChange);
    this.formElement.addEventListener("change", this.handleValuesChange);
    this.moveChildrenIntoForm();
    this.append(this.formElement);
    this.previousValues = this.getValues();
  }

  private observeChildChanges() {
    if (this.mutationObserver) {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      this.moveChildrenIntoForm();
      this.sync();
    });
    this.mutationObserver.observe(this, {
      childList: true
    });
  }

  private moveChildrenIntoForm() {
    if (!this.formElement) {
      return;
    }

    const children = Array.from(this.childNodes).filter((child) => {
      return !(child instanceof HTMLElement && child.hasAttribute(INTERNAL_ATTRIBUTE));
    });

    this.formElement.append(...children);
  }

  private sync() {
    if (!this.formElement) {
      return;
    }

    this.dataset.layout = this.layout;
    this.dataset.labelAlign = this.labelAlign;
    this.dataset.size = this.size;
    this.dataset.variant = this.variant;
    this.toggleAttribute("data-disabled", this.disabled);
    if (this.name) {
      this.formElement.id = this.name;
    } else {
      this.formElement.removeAttribute("id");
    }

    for (const item of this.items) {
      item.syncFromParent({
        colon: this.colon,
        disabled: this.disabled,
        labelAlign: this.labelAlign,
        layout: item.layout ?? this.layout,
        requiredMark: this.requiredMark,
        size: this.size,
        variant: this.variant
      });
    }
  }

  private handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const values = this.getValues();
    const errorFields = this.validateItems();

    if (errorFields.length > 0) {
      this.dispatchEvent(
        new CustomEvent<FormSubmitFailedDetail>(FORM_SUBMIT_FAILED_EVENT, {
          bubbles: true,
          detail: {
            errorFields,
            nativeEvent: event,
            values
          }
        })
      );
      return;
    }

    this.dispatchEvent(
      new CustomEvent<FormSubmitDetail>(FORM_SUBMIT_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent: event,
          values
        }
      })
    );
  };

  private handleReset = (event: Event) => {
    queueMicrotask(() => {
      this.previousValues = this.getValues();
      this.clearValidation();
    });
    this.dispatchEvent(
      new CustomEvent<FormResetDetail>(FORM_RESET_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent: event
        }
      })
    );
  };

  private handleValuesChange = () => {
    const values = this.getValues();
    const changedValues = Object.fromEntries(
      Object.entries(values).filter(([name, value]) => this.previousValues[name] !== value)
    );

    if (Object.keys(changedValues).length === 0) {
      return;
    }

    this.previousValues = values;
    this.dispatchEvent(
      new CustomEvent<FormValuesChangeDetail>(FORM_VALUES_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          changedValues,
          values
        }
      })
    );

    if (this.validateTrigger === "onChange") {
      this.validateItems();
    }
  };

  private validateItems() {
    return this.items.flatMap((item) => {
      const result = item.validate();

      return result ? [result] : [];
    });
  }

  private clearValidation() {
    for (const item of this.items) {
      item.clearValidation();
    }
  }

  private get items() {
    return Array.from(this.formElement?.querySelectorAll(FORM_ITEM_ELEMENT_NAME) ?? []).filter(
      (item): item is DsFormItem => item instanceof DsFormItem
    );
  }
}
