import { COLOR_PICKER_DEFAULT_COLOR } from "../constants/ColorPicker.constants";
import type {
  ColorPickerFormat,
  ColorPickerPickerPlacement,
  ColorPickerPlacement,
  ColorPickerPreset,
  ColorPickerSize,
  ColorPickerTrigger,
  ParsedColor
} from "../types/ColorPicker.types";

const HEX_COLOR_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const HSB_COLOR_PATTERN = /^hsba?\(([^)]+)\)$/i;
const RGB_COLOR_PATTERN = /^rgba?\(([^)]+)\)$/i;
let colorPickerId = 0;

export function createColorPickerId(prefix: string) {
  colorPickerId += 1;

  return `${prefix}-${colorPickerId}`;
}

export function normalizeBooleanAttribute(
  element: HTMLElement,
  name: string,
  defaultValue: boolean
) {
  const value = element.getAttribute(name);

  if (value === null) {
    return defaultValue;
  }

  return value !== "false";
}

export function getColorPickerFormat(element: HTMLElement): ColorPickerFormat {
  const value = element.getAttribute("format") ?? element.getAttribute("default-format");

  if (value === "rgb" || value === "hsb") {
    return value;
  }

  return "hex";
}

export function getColorPickerPlacement(element: HTMLElement): ColorPickerPlacement {
  const value = element.getAttribute("placement");

  if (value === "bottomRight" || value === "topLeft" || value === "topRight") {
    return value;
  }

  return "bottomLeft";
}

export function getColorPickerPickerPlacement(element: HTMLElement): ColorPickerPickerPlacement {
  const value = element.getAttribute("picker-placement");

  if (value === "top" || value === "right" || value === "left") {
    return value;
  }

  return "bottom";
}

export function getColorPickerSize(element: HTMLElement): ColorPickerSize {
  const value = element.getAttribute("size");

  if (value === "large" || value === "small") {
    return value;
  }

  return "middle";
}

export function getColorPickerTrigger(element: HTMLElement): ColorPickerTrigger {
  return element.getAttribute("trigger") === "hover" ? "hover" : "click";
}

export function parseColorValue(value: string): ParsedColor {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      alpha: 100,
      hex: COLOR_PICKER_DEFAULT_COLOR
    };
  }

  const hexMatch = trimmedValue.match(HEX_COLOR_PATTERN);

  if (hexMatch) {
    return {
      alpha: 100,
      hex: normalizeHex(hexMatch[1])
    };
  }

  const rgbMatch = trimmedValue.match(RGB_COLOR_PATTERN);

  if (rgbMatch) {
    const [r, g, b, a] = rgbMatch[1].split(",").map((part) => part.trim());

    return {
      alpha: clampAlpha(a === undefined ? 1 : Number(a)) * 100,
      hex: rgbToHex(Number(r), Number(g), Number(b))
    };
  }

  const hsbMatch = trimmedValue.match(HSB_COLOR_PATTERN);

  if (hsbMatch) {
    const [h, s, b, a] = hsbMatch[1].split(",").map((part) => part.trim().replace("%", ""));
    const rgb = hsbToRgb(Number(h), Number(s), Number(b));

    return {
      alpha: clampAlpha(a === undefined ? 1 : Number(a)) * 100,
      hex: rgbToHex(rgb.r, rgb.g, rgb.b)
    };
  }

  return {
    alpha: 100,
    hex: COLOR_PICKER_DEFAULT_COLOR
  };
}

export function formatColorValue(
  { alpha, hex }: ParsedColor,
  format: ColorPickerFormat,
  disabledAlpha: boolean
) {
  const normalizedAlpha = disabledAlpha ? 100 : clampPercentage(alpha);
  const { r, g, b } = hexToRgb(hex);

  if (format === "rgb") {
    if (normalizedAlpha < 100) {
      return `rgba(${r}, ${g}, ${b}, ${roundAlpha(normalizedAlpha / 100)})`;
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  if (format === "hsb") {
    const { h, s, b: brightness } = rgbToHsb(r, g, b);

    if (normalizedAlpha < 100) {
      return `hsba(${h}, ${s}%, ${brightness}%, ${roundAlpha(normalizedAlpha / 100)})`;
    }

    return `hsb(${h}, ${s}%, ${brightness}%)`;
  }

  return hex.toLowerCase();
}

export function getHueFromHex(hex: string) {
  return getHsbFromHex(hex).h;
}

export function getHsbFromHex(hex: string) {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHsb(r, g, b);
}

export function setHueForHex(hex: string, hue: number) {
  const currentHsb = getHsbFromHex(hex);

  return getHexFromHsb(hue, currentHsb.s, currentHsb.b);
}

export function getHexFromHsb(h: number, s: number, b: number) {
  const nextRgb = hsbToRgb(h, s, b);

  return rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b);
}

export function getPreviewBackground({ alpha, hex }: ParsedColor, disabledAlpha: boolean) {
  const { r, g, b } = hexToRgb(hex);
  const normalizedAlpha = disabledAlpha ? 1 : clampPercentage(alpha) / 100;

  return `rgba(${r}, ${g}, ${b}, ${roundAlpha(normalizedAlpha)})`;
}

export function parsePresetsAttribute(value: string | null): ColorPickerPreset[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(isPresetLike)
      .map((preset, index) => ({
        colors: preset.colors.filter(isColorValue),
        defaultOpen: Boolean(preset.defaultOpen),
        key: typeof preset.key === "string" ? preset.key : `preset-${index + 1}`,
        label: preset.label
      }))
      .filter((preset) => preset.colors.length > 0);
  } catch {
    return [];
  }
}

export function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 100;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeHex(value: string) {
  if (value.length === 3) {
    return `#${value
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`.toLowerCase();
  }

  return `#${value}`.toLowerCase();
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => Math.min(255, Math.max(0, Math.round(value))))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToRgb(hex: string) {
  const normalizedHex = normalizeHex(hex.replace("#", ""));
  const value = Number.parseInt(normalizedHex.slice(1), 16);

  return {
    b: value & 255,
    g: (value >> 8) & 255,
    r: (value >> 16) & 255
  };
}

function rgbToHsb(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === red) {
      h = ((green - blue) / delta) % 6;
    } else if (max === green) {
      h = (blue - red) / delta + 2;
    } else {
      h = (red - green) / delta + 4;
    }
  }

  return {
    b: Math.round(max * 100),
    h: Math.round(h * 60 < 0 ? h * 60 + 360 : h * 60),
    s: Math.round((max === 0 ? 0 : delta / max) * 100)
  };
}

function hsbToRgb(h: number, s: number, b: number) {
  const hue = ((Number.isFinite(h) ? h : 0) % 360) / 60;
  const saturation = Math.min(100, Math.max(0, s)) / 100;
  const brightness = Math.min(100, Math.max(0, b)) / 100;
  const chroma = brightness * saturation;
  const second = chroma * (1 - Math.abs((hue % 2) - 1));
  const match = brightness - chroma;
  const [red, green, blue] =
    hue >= 0 && hue < 1
      ? [chroma, second, 0]
      : hue >= 1 && hue < 2
        ? [second, chroma, 0]
        : hue >= 2 && hue < 3
          ? [0, chroma, second]
          : hue >= 3 && hue < 4
            ? [0, second, chroma]
            : hue >= 4 && hue < 5
              ? [second, 0, chroma]
              : [chroma, 0, second];

  return {
    b: Math.round((blue + match) * 255),
    g: Math.round((green + match) * 255),
    r: Math.round((red + match) * 255)
  };
}

function clampAlpha(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(1, Math.max(0, value));
}

function roundAlpha(value: number) {
  return Math.round(value * 100) / 100;
}

function isPresetLike(value: unknown): value is {
  colors: string[];
  defaultOpen?: boolean;
  key?: string;
  label: string;
} {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const preset = value as { colors?: unknown; label?: unknown };

  return typeof preset.label === "string" && Array.isArray(preset.colors);
}

function isColorValue(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();

  return (
    HEX_COLOR_PATTERN.test(trimmedValue) ||
    RGB_COLOR_PATTERN.test(trimmedValue) ||
    HSB_COLOR_PATTERN.test(trimmedValue)
  );
}
