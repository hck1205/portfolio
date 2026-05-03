import { FORM_ITEM_OBSERVED_ATTRIBUTES } from "./constants/Form.constants";
import {
  createFormId,
  getControlName,
  getControlValue,
  getFormControl,
  getFormLabelAlign,
  getFormLayout,
  getFormValidateStatus,
  normalizeBooleanAttribute,
  syncControlsDisabled,
  syncControlsSizeAndVariant
} from "./dom/Form.dom";
import type { FormLabelAlign, FormLayout, FormParentOptions, FormValidateStatus } from "./types/Form.types";

const INTERNAL_ATTRIBUTE = "data-ds-form-item-internal";

export class DsFormItem extends HTMLElement {
  static observedAttributes = FORM_ITEM_OBSERVED_ATTRIBUTES;

  private controlElement?: HTMLDivElement;
  private extraElement?: HTMLDivElement;
  private generatedValidationHelp?: string;
  private helpElement?: HTMLDivElement;
  private labelElement?: HTMLLabelElement;
  private mutationObserver?: MutationObserver;
  private parentOptions?: FormParentOptions;

  connectedCallback() {
    this.initializeStructure();
    this.observeChildChanges();
    this.sync();
  }

  disconnectedCallback() {
    this.mutationObserver?.disconnect();
  }

  attributeChangedCallback() {
    this.sync();
  }

  get extra() {
    return this.getAttribute("extra") ?? "";
  }

  set extra(value: string) {
    this.setAttribute("extra", value);
  }

  get help() {
    return this.getAttribute("help") ?? "";
  }

  set help(value: string) {
    this.setAttribute("help", value);
  }

  get label() {
    return this.getAttribute("label") ?? "";
  }

  set label(value: string) {
    this.setAttribute("label", value);
  }

  get labelAlign(): FormLabelAlign | undefined {
    return this.hasAttribute("label-align") ? getFormLabelAlign(this) : undefined;
  }

  set labelAlign(value: FormLabelAlign | undefined) {
    this.syncNullableAttribute("label-align", value);
  }

  get layout(): FormLayout | undefined {
    return this.hasAttribute("layout") ? getFormLayout(this) : undefined;
  }

  set layout(value: FormLayout | undefined) {
    this.syncNullableAttribute("layout", value);
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value: string) {
    this.setAttribute("name", value);
  }

  get noStyle() {
    return normalizeBooleanAttribute(this, "no-style", false);
  }

  set noStyle(value: boolean) {
    this.toggleAttribute("no-style", value);
  }

  get required() {
    return normalizeBooleanAttribute(this, "required", false);
  }

  set required(value: boolean) {
    this.toggleAttribute("required", value);
  }

  get validateStatus(): FormValidateStatus | undefined {
    return getFormValidateStatus(this);
  }

  set validateStatus(value: FormValidateStatus | undefined) {
    this.syncNullableAttribute("validate-status", value);
  }

  syncFromParent(options: FormParentOptions) {
    this.parentOptions = options;
    this.sync();
  }

  validate() {
    const control = getFormControl(this.controlElement ?? this);
    const value = getControlValue(control);

    if (this.required && !String(value).trim()) {
      this.setValidationError(`${this.label || this.name || getControlName(control, "field")} 항목은 필수입니다.`);
      return {
        errors: [this.help],
        name: this.name || getControlName(control, "")
      };
    }

    if (!this.hasAttribute("validate-status")) {
      this.clearValidation();
    }

    return undefined;
  }

  clearValidation() {
    if (
      this.generatedValidationHelp &&
      this.getAttribute("validate-status") === "error" &&
      this.help === this.generatedValidationHelp
    ) {
      this.removeAttribute("validate-status");
      this.removeAttribute("help");
      this.generatedValidationHelp = undefined;
    }
  }

  private initializeStructure() {
    if (this.controlElement) {
      return;
    }

    this.labelElement = this.createInternalElement("label", "ds-form-item__label");
    this.controlElement = this.createInternalElement("div", "ds-form-item__control");
    this.helpElement = this.createInternalElement("div", "ds-form-item__help");
    this.extraElement = this.createInternalElement("div", "ds-form-item__extra");
    this.moveControlChildren();
    this.append(this.labelElement, this.controlElement);
    this.controlElement.append(this.helpElement, this.extraElement);
  }

  private observeChildChanges() {
    if (this.mutationObserver) {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      this.moveControlChildren();
      this.sync();
    });
    this.mutationObserver.observe(this, {
      childList: true
    });
  }

  private moveControlChildren() {
    if (!this.controlElement) {
      return;
    }

    const children = Array.from(this.childNodes).filter((child) => {
      return !(child instanceof HTMLElement && child.hasAttribute(INTERNAL_ATTRIBUTE));
    });

    this.controlElement.prepend(...children);
  }

  private sync() {
    if (!this.controlElement || !this.extraElement || !this.helpElement || !this.labelElement) {
      return;
    }

    const parentOptions = this.parentOptions;
    const layout = this.layout ?? parentOptions?.layout ?? "horizontal";
    const labelAlign = this.labelAlign ?? parentOptions?.labelAlign ?? "left";
    const colon = parentOptions?.colon ?? true;
    const requiredMark = parentOptions?.requiredMark ?? "true";
    const disabled = parentOptions?.disabled ?? false;
    const size = parentOptions?.size ?? "medium";
    const variant = parentOptions?.variant ?? "outlined";
    const control = getFormControl(this.controlElement);
    const controlId = this.getControlId(control);

    this.dataset.layout = layout;
    this.dataset.labelAlign = labelAlign;
    this.dataset.validateStatus = this.validateStatus ?? "";
    this.toggleAttribute("data-required", this.required);
    this.toggleAttribute("data-no-style", this.noStyle);
    this.labelElement.hidden = !this.label || this.noStyle;
    this.labelElement.htmlFor = controlId;
    this.labelElement.textContent = this.getLabelText({ colon, layout, requiredMark });
    this.helpElement.hidden = !this.help;
    this.helpElement.textContent = this.help;
    this.extraElement.hidden = !this.extra;
    this.extraElement.textContent = this.extra;
    syncControlsDisabled(this.controlElement, disabled);
    syncControlsSizeAndVariant(this.controlElement, size, variant);
  }

  private createInternalElement<K extends keyof HTMLElementTagNameMap>(tagName: K, className: string) {
    const element = document.createElement(tagName);

    element.className = className;
    element.setAttribute(INTERNAL_ATTRIBUTE, "");

    return element;
  }

  private getControlId(control: HTMLElement | undefined) {
    if (!control) {
      return "";
    }

    const id = this.getAttribute("html-for") || control.id || createFormId("control");

    control.id = id;

    return id;
  }

  private getLabelText({
    colon,
    layout,
    requiredMark
  }: {
    colon: boolean;
    layout: FormLayout;
    requiredMark: FormParentOptions["requiredMark"];
  }) {
    const suffix = colon && layout !== "vertical" ? ":" : "";
    const optional = requiredMark === "optional" && !this.required ? " (선택)" : "";

    return `${this.label}${optional}${suffix}`;
  }

  private setValidationError(message: string) {
    this.generatedValidationHelp = message;
    this.setAttribute("validate-status", "error");
    this.setAttribute("help", message);
  }

  private syncNullableAttribute(name: string, value: string | undefined) {
    if (value) {
      this.setAttribute(name, value);
      return;
    }

    this.removeAttribute(name);
  }
}
