import {
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_STEP
} from "../constants/Slider.constants";
import type { SliderMark, SliderTooltipMode } from "../types/Slider.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getNumberAttribute(element: HTMLElement, name: string, fallback: number) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) ? value : fallback;
}

export function getSliderMin(element: HTMLElement) {
  return getNumberAttribute(element, "min", DEFAULT_SLIDER_MIN);
}

export function getSliderMax(element: HTMLElement) {
  const min = getSliderMin(element);
  const max = getNumberAttribute(element, "max", DEFAULT_SLIDER_MAX);

  return max > min ? max : min + DEFAULT_SLIDER_STEP;
}

export function getSliderStep(element: HTMLElement) {
  const step = element.getAttribute("step");

  if (step === "null") {
    return null;
  }

  const parsedStep = Number(step);

  return Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep : DEFAULT_SLIDER_STEP;
}

export function getSliderTooltip(element: HTMLElement): SliderTooltipMode {
  const value = element.getAttribute("tooltip");

  if (value === "open" || value === "closed") {
    return value;
  }

  return "auto";
}

export function parseSliderValue(value: string | null, range: boolean): [number, number] | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const normalizedValue = value.trim();
  const list = normalizedValue.startsWith("[")
    ? safeParseNumberList(normalizedValue)
    : normalizedValue.split(",").map((item) => Number(item.trim()));
  const finiteValues = list.filter(Number.isFinite);

  if (!finiteValues.length) {
    return undefined;
  }

  if (range) {
    return [finiteValues[0], finiteValues[1] ?? finiteValues[0]];
  }

  return [finiteValues[0], finiteValues[0]];
}

export function parseSliderMarks(value: string | null): SliderMark[] {
  if (!value) {
    return [];
  }

  if (value.trim().startsWith("{")) {
    return parseJsonMarks(value);
  }

  return value
    .split(",")
    .map((item) => {
      const [position, label = position] = item.split(":");
      const parsedPosition = Number(position.trim());

      if (!Number.isFinite(parsedPosition)) {
        return undefined;
      }

      return {
        label: label.trim(),
        value: parsedPosition
      };
    })
    .filter((mark): mark is SliderMark => Boolean(mark));
}

export function clampSliderValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeSliderPair(value: [number, number], min: number, max: number, range: boolean): [number, number] {
  const lowerValue = clampSliderValue(value[0], min, max);
  const upperValue = clampSliderValue(value[1], min, max);

  if (!range) {
    return [lowerValue, lowerValue];
  }

  return lowerValue <= upperValue ? [lowerValue, upperValue] : [upperValue, lowerValue];
}

export function snapSliderValue(value: number, options: { marks: SliderMark[]; min: number; max: number; step: number | null }) {
  const { marks, max, min, step } = options;

  if (step === null && marks.length) {
    return findClosestValue(value, [min, max, ...marks.map((mark) => mark.value)]);
  }

  if (step === null) {
    return clampSliderValue(value, min, max);
  }

  const snappedValue = Math.round((value - min) / step) * step + min;
  const precision = getStepPrecision(step);

  return clampSliderValue(Number(snappedValue.toFixed(precision)), min, max);
}

export function getSliderPercent(value: number, min: number, max: number, reverse: boolean) {
  const percent = ((value - min) / (max - min)) * 100;
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return reverse ? 100 - clampedPercent : clampedPercent;
}

function safeParseNumberList(value: string) {
  try {
    const parsedValue = JSON.parse(value);

    return Array.isArray(parsedValue) ? parsedValue.map(Number) : [];
  } catch {
    return [];
  }
}

function parseJsonMarks(value: string): SliderMark[] {
  try {
    const parsedValue = JSON.parse(value) as Record<string, string | { label?: string }>;

    return Object.entries(parsedValue)
      .map(([position, mark]) => {
        const parsedPosition = Number(position);

        if (!Number.isFinite(parsedPosition)) {
          return undefined;
        }

        return {
          label: typeof mark === "object" && mark?.label ? mark.label : String(mark),
          value: parsedPosition
        };
      })
      .filter((mark): mark is SliderMark => Boolean(mark));
  } catch {
    return [];
  }
}

function findClosestValue(value: number, values: number[]) {
  return values.reduce((closest, current) => {
    return Math.abs(current - value) < Math.abs(closest - value) ? current : closest;
  }, values[0]);
}

function getStepPrecision(step: number) {
  const [, decimal = ""] = String(step).split(".");

  return decimal.length;
}
