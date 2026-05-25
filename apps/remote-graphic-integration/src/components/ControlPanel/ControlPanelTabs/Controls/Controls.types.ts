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

export type SliderElement = HTMLElement & {
  value: number | [number, number];
};

export type SliderChangeEvent = CustomEvent<{
  value: number | [number, number];
}>;

export type SelectElement = HTMLElement & {
  value: string;
};

export type SelectChangeEvent = CustomEvent<{
  value: string | string[];
}>;
