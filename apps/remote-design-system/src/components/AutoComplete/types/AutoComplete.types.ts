export type AutoCompleteSize = "small" | "medium" | "large";

export type AutoCompleteStatus = "error" | "warning";

export type AutoCompleteVariant = "outlined" | "borderless" | "filled" | "underlined";

export type AutoCompleteInputMode = "input" | "textarea";

export type AutoCompleteOption = {
  disabled?: boolean;
  label?: string;
  value: string;
};

export type AutoCompleteOpenChangeSource = "input" | "keyboard" | "option" | "clear" | "outside";

export type AutoCompleteChangeDetail = {
  value: string;
};

export type AutoCompleteSearchDetail = {
  value: string;
};

export type AutoCompleteSelectDetail = {
  option: AutoCompleteOption;
  value: string;
};

export type AutoCompleteClearDetail = {
  previousValue: string;
};

export type AutoCompleteOpenChangeDetail = {
  open: boolean;
  source: AutoCompleteOpenChangeSource;
};
