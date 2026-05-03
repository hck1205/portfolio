import type {
  FormLabelAlign,
  FormLayout,
  FormRequiredMark,
  FormSize,
  FormValidateStatus,
  FormVariant,
  FormValues
} from "../types/Form.types";

const FORM_CONTROLS_SELECTOR =
  "input, textarea, select, button, ds-input, ds-input-number, ds-mentions";
const FORM_VALUE_SELECTOR = "input, textarea, select, ds-input, ds-input-number, ds-mentions";
const LAYOUTS = ["horizontal", "vertical", "inline"] as const;
const LABEL_ALIGNS = ["left", "right"] as const;
const REQUIRED_MARKS = ["true", "false", "optional"] as const;
const SIZES = ["small", "medium", "large"] as const;
const STATUSES = ["success", "warning", "error", "validating"] as const;
const VARIANTS = ["outlined", "borderless", "filled", "underlined"] as const;

let formId = 0;

export function createFormId(prefix: string) {
  formId += 1;

  return `ds-form-${prefix}-${formId}`;
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === name || value === "true";
}

export function getFormLayout(element: HTMLElement): FormLayout {
  const value = element.getAttribute("layout");

  return isOneOf(value, LAYOUTS) ? value : "horizontal";
}

export function getFormLabelAlign(element: HTMLElement): FormLabelAlign {
  const value = element.getAttribute("label-align");

  return isOneOf(value, LABEL_ALIGNS) ? value : "left";
}

export function getFormRequiredMark(element: HTMLElement): FormRequiredMark {
  const value = element.getAttribute("required-mark");

  return isOneOf(value, REQUIRED_MARKS) ? value : "true";
}

export function getFormSize(element: HTMLElement): FormSize {
  const value = element.getAttribute("size");

  return isOneOf(value, SIZES) ? value : "medium";
}

export function getFormValidateStatus(element: HTMLElement): FormValidateStatus | undefined {
  const value = element.getAttribute("validate-status");

  return isOneOf(value, STATUSES) ? value : undefined;
}

export function getFormVariant(element: HTMLElement): FormVariant {
  const value = element.getAttribute("variant");

  return isOneOf(value, VARIANTS) ? value : "outlined";
}

export function getFormControl(container: HTMLElement) {
  return container.querySelector<HTMLElement>(FORM_VALUE_SELECTOR) ?? undefined;
}

export function syncControlsDisabled(container: HTMLElement, disabled: boolean) {
  for (const control of container.querySelectorAll<HTMLElement>(FORM_CONTROLS_SELECTOR)) {
    if ("disabled" in control) {
      (control as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement).disabled = disabled;
    } else {
      control.toggleAttribute("disabled", disabled);
    }
  }
}

export function syncControlsSizeAndVariant(container: HTMLElement, size: FormSize, variant: FormVariant) {
  for (const control of container.querySelectorAll<HTMLElement>(FORM_VALUE_SELECTOR)) {
    if (control.localName.startsWith("ds-")) {
      control.setAttribute("size", size);
      control.setAttribute("variant", variant);
    }
  }
}

export function getControlName(control: HTMLElement | undefined, fallback: string) {
  return control?.getAttribute("name") || fallback;
}

export function getControlValue(control: HTMLElement | undefined) {
  if (!control) {
    return "";
  }

  if (control instanceof HTMLInputElement && control.type === "checkbox") {
    return control.checked;
  }

  if (control instanceof HTMLInputElement && control.type === "radio") {
    return control.checked ? control.value : "";
  }

  if ("value" in control) {
    return String((control as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | { value: unknown }).value ?? "");
  }

  return control.getAttribute("value") ?? "";
}

export function getFormValues(formElement: HTMLFormElement): FormValues {
  const values: FormValues = {};
  const formData = new FormData(formElement);

  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }

  for (const control of formElement.querySelectorAll<HTMLElement>("ds-input, ds-input-number, ds-mentions")) {
    const name = control.getAttribute("name");

    if (name) {
      values[name] = getControlValue(control);
    }
  }

  return values;
}

function isOneOf<T extends readonly string[]>(value: string | null, options: T): value is T[number] {
  return value !== null && options.includes(value);
}
