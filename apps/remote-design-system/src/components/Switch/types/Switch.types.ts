export type SwitchSize = "medium" | "small";

export type SwitchChangeDetail = {
  checked: boolean;
  nativeEvent?: Event;
};

export type SwitchElements = {
  button: HTMLButtonElement;
  checkedContent: HTMLSpanElement;
  handle: HTMLSpanElement;
  loadingIndicator: HTMLSpanElement;
  root: HTMLSpanElement;
  uncheckedContent: HTMLSpanElement;
};

export type SwitchSyncOptions = {
  checked: boolean;
  checkedChildren: string;
  disabled: boolean;
  loading: boolean;
  size: SwitchSize;
  uncheckedChildren: string;
};
