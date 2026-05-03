import { ChevronDown, Eraser, createElement as createLucideElement } from "lucide";

import { COLOR_PICKER_STYLES } from "./ColorPicker.styles";
import type { ColorPickerFormat, ColorPickerPreset } from "./types/ColorPicker.types";

export type ColorPickerElements = {
  alphaElement: HTMLInputElement;
  alphaInputElement: HTMLInputElement;
  alphaFieldElement: HTMLDivElement;
  boardElement: HTMLDivElement;
  boardThumbElement: HTMLSpanElement;
  clearButtonElement: HTMLButtonElement;
  colorInputElement: HTMLInputElement;
  formatDropdownElement: HTMLElement;
  hueElement: HTMLInputElement;
  popupElement: HTMLDivElement;
  presetsElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  swatchColorElement: HTMLSpanElement;
  panelPreviewElement: HTMLSpanElement;
  textElement: HTMLSpanElement;
  textInputElement: HTMLInputElement;
  triggerElement: HTMLButtonElement;
};

export type SyncColorPickerElementsOptions = {
  allowClear: boolean;
  alpha: number;
  colorInputValue: string;
  cssValue: string;
  disabled: boolean;
  disabledAlpha: boolean;
  disabledFormat: boolean;
  elements: ColorPickerElements;
  format: ColorPickerFormat;
  hue: number;
  open: boolean;
  presets: ColorPickerPreset[];
  previewBackground: string;
  saturation: number;
  showText: boolean;
  textValue: string;
  brightness: number;
};

let colorPickerStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getColorPickerStyleSheet() {
  if (!colorPickerStyleSheet) {
    colorPickerStyleSheet = new CSSStyleSheet();
    colorPickerStyleSheet.replaceSync(COLOR_PICKER_STYLES);
  }

  return colorPickerStyleSheet;
}

export function applyColorPickerStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getColorPickerStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-color-picker]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsColorPicker = "";
  styleElement.textContent = COLOR_PICKER_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createColorPickerElements({
  onAlphaInput,
  onAlphaTextChange,
  onBoardKeyDown,
  onBoardPointerDown,
  onClear,
  onColorInput,
  onColorInputComplete,
  onFormatChange,
  onHueInput,
  onPresetClick,
  onTextChange,
  onTextKeyDown,
  onTriggerClick,
  onTriggerKeyDown
}: {
  onAlphaInput: (event: Event) => void;
  onAlphaTextChange: (event: Event) => void;
  onBoardKeyDown: (event: KeyboardEvent) => void;
  onBoardPointerDown: (event: PointerEvent) => void;
  onClear: (event: Event) => void;
  onColorInput: (event: Event) => void;
  onColorInputComplete: (event: Event) => void;
  onFormatChange: (event: Event) => void;
  onHueInput: (event: Event) => void;
  onPresetClick: (event: Event) => void;
  onTextChange: (event: Event) => void;
  onTextKeyDown: (event: KeyboardEvent) => void;
  onTriggerClick: (event: Event) => void;
  onTriggerKeyDown: (event: KeyboardEvent) => void;
}): ColorPickerElements {
  const rootElement = document.createElement("div");
  const triggerElement = document.createElement("button");
  const swatchElement = document.createElement("span");
  const swatchColorElement = document.createElement("span");
  const textElement = document.createElement("span");
  const chevronElement = document.createElement("span");
  const popupElement = document.createElement("div");
  const boardElement = document.createElement("div");
  const boardThumbElement = document.createElement("span");
  const colorInputElement = document.createElement("input");
  const controlsElement = document.createElement("div");
  const sliderStackElement = document.createElement("div");
  const hueFieldElement = document.createElement("div");
  const hueLabelElement = document.createElement("label");
  const hueElement = document.createElement("input");
  const sliderPreviewElement = document.createElement("span");
  const sliderPreviewColorElement = document.createElement("span");
  const alphaFieldElement = document.createElement("div");
  const alphaLabelElement = document.createElement("label");
  const alphaElement = document.createElement("input");
  const inputFieldElement = document.createElement("div");
  const inputRowElement = document.createElement("div");
  const formatDropdownElement = document.createElement("ds-dropdown");
  const textInputElement = document.createElement("input");
  const alphaInputElement = document.createElement("input");
  const clearButtonElement = document.createElement("button");
  const presetsElement = document.createElement("div");

  rootElement.className = "ds-color-picker";
  triggerElement.className = "ds-color-picker__trigger";
  triggerElement.type = "button";
  triggerElement.setAttribute("aria-haspopup", "dialog");
  swatchElement.className = "ds-color-picker__swatch";
  swatchColorElement.className = "ds-color-picker__swatch-color";
  textElement.className = "ds-color-picker__text";
  chevronElement.className = "ds-color-picker__chevron";
  chevronElement.append(createIcon(ChevronDown));
  popupElement.className = "ds-color-picker__popup";
  popupElement.setAttribute("role", "dialog");
  popupElement.setAttribute("aria-label", "Color picker panel");
  boardElement.className = "ds-color-picker__board";
  boardElement.tabIndex = 0;
  boardElement.setAttribute("aria-label", "Saturation and brightness");
  boardElement.setAttribute("role", "slider");
  boardElement.setAttribute("aria-valuemin", "0");
  boardElement.setAttribute("aria-valuemax", "100");
  boardThumbElement.className = "ds-color-picker__board-thumb";
  colorInputElement.className = "ds-color-picker__native";
  colorInputElement.type = "color";
  controlsElement.className = "ds-color-picker__controls";
  sliderStackElement.className = "ds-color-picker__sliders";
  hueFieldElement.className = "ds-color-picker__slider-field";
  hueLabelElement.className = "ds-color-picker__sr-label";
  hueLabelElement.textContent = "Hue";
  hueElement.className = "ds-color-picker__hue";
  hueElement.max = "360";
  hueElement.min = "0";
  hueElement.type = "range";
  sliderPreviewElement.className = "ds-color-picker__panel-preview";
  sliderPreviewColorElement.className = "ds-color-picker__panel-preview-color";
  alphaFieldElement.className = "ds-color-picker__slider-field";
  alphaLabelElement.className = "ds-color-picker__sr-label";
  alphaLabelElement.textContent = "Alpha";
  alphaElement.className = "ds-color-picker__alpha";
  alphaElement.max = "100";
  alphaElement.min = "0";
  alphaElement.type = "range";
  inputFieldElement.className = "ds-color-picker__field";
  inputRowElement.className = "ds-color-picker__input-row";
  formatDropdownElement.className = "ds-color-picker__format-dropdown";
  formatDropdownElement.setAttribute("placement", "bottom-left");
  formatDropdownElement.setAttribute("selectable", "true");
  formatDropdownElement.setAttribute("trigger", "click");
  textInputElement.className = "ds-color-picker__text-input";
  textInputElement.type = "text";
  alphaInputElement.className = "ds-color-picker__alpha-input";
  alphaInputElement.inputMode = "numeric";
  alphaInputElement.type = "text";
  clearButtonElement.className = "ds-color-picker__clear";
  clearButtonElement.type = "button";
  clearButtonElement.setAttribute("aria-label", "Clear color");
  clearButtonElement.append(createIcon(Eraser));
  presetsElement.className = "ds-color-picker__presets";

  for (const format of ["hex", "rgb", "hsb"] satisfies ColorPickerFormat[]) {
    const itemElement = document.createElement("ds-dropdown-item");

    itemElement.setAttribute("item-key", format);
    itemElement.setAttribute("label", format.toUpperCase());
    itemElement.textContent = format.toUpperCase();
    formatDropdownElement.append(itemElement);
  }

  triggerElement.addEventListener("click", onTriggerClick);
  triggerElement.addEventListener("keydown", onTriggerKeyDown);
  boardElement.addEventListener("keydown", onBoardKeyDown);
  boardElement.addEventListener("pointerdown", onBoardPointerDown);
  colorInputElement.addEventListener("input", onColorInput);
  colorInputElement.addEventListener("change", onColorInputComplete);
  hueElement.addEventListener("input", onHueInput);
  alphaElement.addEventListener("input", onAlphaInput);
  alphaInputElement.addEventListener("change", onAlphaTextChange);
  textInputElement.addEventListener("change", onTextChange);
  textInputElement.addEventListener("keydown", onTextKeyDown);
  formatDropdownElement.addEventListener("ds-dropdown-select", onFormatChange);
  clearButtonElement.addEventListener("click", onClear);
  presetsElement.addEventListener("click", onPresetClick);

  swatchElement.append(swatchColorElement);
  triggerElement.append(swatchElement, textElement, chevronElement);
  boardElement.append(boardThumbElement);
  hueFieldElement.append(hueLabelElement, hueElement);
  sliderPreviewElement.append(sliderPreviewColorElement);
  alphaFieldElement.append(alphaLabelElement, alphaElement);
  sliderStackElement.append(hueFieldElement, alphaFieldElement, sliderPreviewElement);
  inputRowElement.append(formatDropdownElement, textInputElement, alphaInputElement, clearButtonElement);
  inputFieldElement.append(inputRowElement);
  controlsElement.append(sliderStackElement, inputFieldElement);
  popupElement.append(boardElement, colorInputElement, controlsElement, presetsElement);
  rootElement.append(triggerElement, popupElement);

  return {
    alphaElement,
    alphaInputElement,
    alphaFieldElement,
    boardElement,
    boardThumbElement,
    clearButtonElement,
    colorInputElement,
    formatDropdownElement,
    hueElement,
    popupElement,
    presetsElement,
    rootElement,
    swatchColorElement,
    panelPreviewElement: sliderPreviewColorElement,
    textElement,
    textInputElement,
    triggerElement
  };
}

export function syncColorPickerElements({
  allowClear,
  alpha,
  colorInputValue,
  cssValue,
  disabled,
  disabledAlpha,
  disabledFormat,
  elements,
  format,
  hue,
  open,
  presets,
  previewBackground,
  saturation,
  showText,
  textValue,
  brightness
}: SyncColorPickerElementsOptions) {
  elements.triggerElement.disabled = disabled;
  elements.triggerElement.setAttribute("aria-expanded", String(open));
  elements.popupElement.hidden = !open;
  elements.boardElement.style.setProperty("--ds-color-picker-board-color", colorInputValue);
  elements.boardElement.setAttribute(
    "aria-valuetext",
    `Saturation ${saturation}%, brightness ${brightness}%`
  );
  elements.boardThumbElement.style.insetInlineStart = `${saturation}%`;
  elements.boardThumbElement.style.insetBlockStart = `${100 - brightness}%`;
  elements.colorInputElement.disabled = disabled;
  elements.colorInputElement.value = colorInputValue;
  elements.hueElement.disabled = disabled;
  elements.hueElement.value = String(hue);
  elements.alphaElement.disabled = disabled || disabledAlpha;
  elements.alphaElement.value = String(alpha);
  elements.alphaElement.style.setProperty("--ds-color-picker-alpha-color", colorInputValue);
  elements.alphaInputElement.disabled = disabled || disabledAlpha;
  elements.alphaInputElement.value = `${alpha}%`;
  elements.textInputElement.disabled = disabled;
  elements.textInputElement.value = textValue;
  elements.formatDropdownElement.toggleAttribute("disabled", disabled || disabledFormat);
  elements.formatDropdownElement.hidden = disabledFormat;
  elements.formatDropdownElement.setAttribute("selected-key", format);
  elements.formatDropdownElement.setAttribute("trigger-label", format.toUpperCase());
  elements.clearButtonElement.hidden = !allowClear;
  elements.clearButtonElement.disabled = disabled;
  elements.swatchColorElement.style.background = previewBackground;
  elements.panelPreviewElement.style.background = previewBackground;
  elements.textElement.hidden = !showText;
  elements.textElement.textContent = cssValue || "No color";
  renderPresets(elements.presetsElement, presets);
}

function renderPresets(container: HTMLDivElement, presets: ColorPickerPreset[]) {
  const signature = JSON.stringify(presets);

  if (container.dataset.signature === signature) {
    return;
  }

  container.dataset.signature = signature;
  container.hidden = presets.length === 0;
  container.replaceChildren(
    ...presets.map((preset) => {
      const presetElement = document.createElement("div");
      const labelElement = document.createElement("span");
      const colorsElement = document.createElement("div");

      presetElement.className = "ds-color-picker__preset";
      labelElement.className = "ds-color-picker__preset-label";
      labelElement.textContent = preset.label;
      colorsElement.className = "ds-color-picker__preset-colors";
      colorsElement.append(
        ...preset.colors.map((color) => {
          const colorButtonElement = document.createElement("button");

          colorButtonElement.className = "ds-color-picker__preset-color";
          colorButtonElement.type = "button";
          colorButtonElement.dataset.color = color;
          colorButtonElement.style.setProperty("--preset-color", color);
          colorButtonElement.setAttribute("aria-label", color);

          return colorButtonElement;
        })
      );
      presetElement.append(labelElement, colorsElement);

      return presetElement;
    })
  );
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
}
