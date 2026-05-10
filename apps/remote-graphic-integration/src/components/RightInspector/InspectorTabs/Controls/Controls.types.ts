export type ColorPickerElement = HTMLElement & {
  value: string;
};

export type ColorPickerChangeEvent = CustomEvent<{
  value: string;
}>;

export type SwitchElement = HTMLElement & {
  checked: boolean;
};

export type SwitchChangeEvent = CustomEvent<{
  checked: boolean;
}>;
