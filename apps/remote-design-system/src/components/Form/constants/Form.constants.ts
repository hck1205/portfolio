import type { FormValidateTrigger } from "../types/Form.types";

export const FORM_ELEMENT_NAME = "ds-form";

export const FORM_ITEM_ELEMENT_NAME = "ds-form-item";

export const FORM_SUBMIT_EVENT = "ds-form-submit";

export const FORM_SUBMIT_FAILED_EVENT = "ds-form-submit-failed";

export const FORM_VALUES_CHANGE_EVENT = "ds-form-values-change";

export const FORM_RESET_EVENT = "ds-form-reset";

export const FORM_OBSERVED_ATTRIBUTES = [
  "colon",
  "disabled",
  "label-align",
  "layout",
  "name",
  "required-mark",
  "size",
  "validate-trigger",
  "variant"
] as const;

export const FORM_ITEM_OBSERVED_ATTRIBUTES = [
  "extra",
  "help",
  "hidden",
  "html-for",
  "label",
  "label-align",
  "layout",
  "name",
  "no-style",
  "required",
  "validate-status"
] as const;

export const DEFAULT_FORM_VALIDATE_TRIGGER: FormValidateTrigger = "onSubmit";
