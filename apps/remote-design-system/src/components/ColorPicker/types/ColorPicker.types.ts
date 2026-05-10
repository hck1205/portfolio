import type { COLOR_PICKER_PICKER_PLACEMENTS } from "../constants/ColorPicker.constants";

export type ColorPickerFormat = "hex" | "rgb" | "hsb";
export type ColorPickerPickerPlacement =
  (typeof COLOR_PICKER_PICKER_PLACEMENTS)[number];
export type ColorPickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type ColorPickerSize = "large" | "middle" | "small";
export type ColorPickerTrigger = "click" | "hover";
export type ColorPickerChangeSource = "clear" | "input" | "preset" | "text";
export type ColorPickerOpenChangeSource = "outside" | "trigger" | "keyboard";

export type ColorPickerPreset = {
  colors: string[];
  defaultOpen?: boolean;
  key?: string;
  label: string;
};

export type ParsedColor = {
  alpha: number;
  hex: string;
};

export type ColorPickerChangeDetail = {
  alpha: number;
  css: string;
  format: ColorPickerFormat;
  nativeEvent: Event | null;
  source: ColorPickerChangeSource;
  value: string;
};

export type ColorPickerFormatChangeDetail = {
  format: ColorPickerFormat;
};

export type ColorPickerOpenChangeDetail = {
  open: boolean;
  source: ColorPickerOpenChangeSource;
};
