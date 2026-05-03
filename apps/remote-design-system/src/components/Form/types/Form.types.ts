export type FormLayout = "horizontal" | "vertical" | "inline";

export type FormLabelAlign = "left" | "right";

export type FormRequiredMark = "true" | "false" | "optional";

export type FormSize = "small" | "medium" | "large";

export type FormValidateStatus = "success" | "warning" | "error" | "validating";

export type FormValidateTrigger = "onSubmit" | "onChange";

export type FormVariant = "outlined" | "borderless" | "filled" | "underlined";

export type FormValues = Record<string, FormDataEntryValue | boolean | string>;

export type FormSubmitDetail = {
  nativeEvent: SubmitEvent;
  values: FormValues;
};

export type FormSubmitFailedDetail = {
  errorFields: Array<{
    errors: string[];
    name: string;
  }>;
  nativeEvent: SubmitEvent;
  values: FormValues;
};

export type FormValuesChangeDetail = {
  changedValues: FormValues;
  values: FormValues;
};

export type FormResetDetail = {
  nativeEvent: Event;
};

export type FormParentOptions = {
  colon: boolean;
  disabled: boolean;
  labelAlign: FormLabelAlign;
  layout: FormLayout;
  requiredMark: FormRequiredMark;
  size: FormSize;
  variant: FormVariant;
};
