import {
  COLOR_PICKER_CHANGE_COMPLETE_EVENT,
  COLOR_PICKER_CHANGE_EVENT,
  COLOR_PICKER_CLEAR_EVENT,
  COLOR_PICKER_FORMAT_CHANGE_EVENT,
  COLOR_PICKER_OBSERVED_ATTRIBUTES,
  COLOR_PICKER_OPEN_CHANGE_EVENT,
  COLOR_PICKER_HOVER_CLOSE_DELAY
} from "./constants/ColorPicker.constants";
import {
  clampPercentage,
  createColorPickerId,
  formatColorValue,
  getColorPickerFormat,
  getColorPickerPlacement,
  getColorPickerPickerPlacement,
  getColorPickerSize,
  getColorPickerTrigger,
  getHexFromHsb,
  getHueFromHex,
  getHsbFromHex,
  getPreviewBackground,
  normalizeBooleanAttribute,
  parseColorValue,
  parsePresetsAttribute,
  setHueForHex
} from "./dom/ColorPicker.dom";
import {
  applyColorPickerStyles,
  createColorPickerElements,
  syncColorPickerElements,
  type ColorPickerElements
} from "./ColorPicker.render";
import type {
  ColorPickerChangeDetail,
  ColorPickerChangeSource,
  ColorPickerFormat,
  ColorPickerFormatChangeDetail,
  ColorPickerOpenChangeDetail,
  ColorPickerOpenChangeSource,
  ColorPickerPickerPlacement,
  ColorPickerPlacement,
  ColorPickerPreset,
  ColorPickerSize,
  ColorPickerTrigger,
  ParsedColor
} from "./types/ColorPicker.types";

export class DsColorPicker extends HTMLElement {
  static observedAttributes = COLOR_PICKER_OBSERVED_ATTRIBUTES;

  private closeTimer = 0;
  private documentListenerAttached = false;
  private elements?: ColorPickerElements;
  private hasAppliedDefaultValue = false;
  private hasColor = true;
  private internalColor: ParsedColor = parseColorValue("");
  private internalHue = getHueFromHex(this.internalColor.hex);
  private isSyncingValueAttribute = false;
  private readonly popupId = createColorPickerId("ds-color-picker-popup");
  private propertyPresets?: ColorPickerPreset[];

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.detachDocumentListener();
    this.clearCloseTimer();
  }

  attributeChangedCallback(name: string) {
    if (name === "presets") {
      this.propertyPresets = undefined;
    }

    if (name === "value" && !this.isSyncingValueAttribute) {
      const value = this.getAttribute("value") ?? "";

      this.hasColor = Boolean(value);
      this.internalColor = parseColorValue(value);
      this.internalHue = getHueFromHex(this.internalColor.hex);
    }

    this.requestRender();
  }

  get allowClear() {
    return normalizeBooleanAttribute(this, "allow-clear", false);
  }

  set allowClear(value: boolean) {
    this.toggleAttribute("allow-clear", value);
  }

  get defaultFormat(): ColorPickerFormat {
    const value = this.getAttribute("default-format");

    if (value === "rgb" || value === "hsb") {
      return value;
    }

    return "hex";
  }

  set defaultFormat(value: ColorPickerFormat) {
    this.setAttribute("default-format", value);
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? "";
  }

  set defaultValue(value: string) {
    if (!this.hasAppliedDefaultValue && !this.hasAttribute("value")) {
      this.internalColor = parseColorValue(value);
    }

    this.syncNullableAttribute("default-value", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get disabledAlpha() {
    return normalizeBooleanAttribute(this, "disabled-alpha", false);
  }

  set disabledAlpha(value: boolean) {
    this.toggleAttribute("disabled-alpha", value);
  }

  get disabledFormat() {
    return normalizeBooleanAttribute(this, "disabled-format", false);
  }

  set disabledFormat(value: boolean) {
    this.toggleAttribute("disabled-format", value);
  }

  get format(): ColorPickerFormat {
    return getColorPickerFormat(this);
  }

  set format(value: ColorPickerFormat) {
    this.setAttribute("format", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get placement(): ColorPickerPlacement {
    return getColorPickerPlacement(this);
  }

  set placement(value: ColorPickerPlacement) {
    this.setAttribute("placement", value);
  }

  get pickerPlacement(): ColorPickerPickerPlacement {
    return getColorPickerPickerPlacement(this);
  }

  set pickerPlacement(value: ColorPickerPickerPlacement) {
    this.setAttribute("picker-placement", value);
  }

  get presets() {
    return this.propertyPresets ?? parsePresetsAttribute(this.getAttribute("presets"));
  }

  set presets(value: ColorPickerPreset[]) {
    this.propertyPresets = value;
    this.requestRender();
  }

  get showText() {
    return normalizeBooleanAttribute(this, "show-text", false);
  }

  set showText(value: boolean) {
    this.toggleAttribute("show-text", value);
  }

  get size(): ColorPickerSize {
    return getColorPickerSize(this);
  }

  set size(value: ColorPickerSize) {
    this.setAttribute("size", value);
  }

  get trigger(): ColorPickerTrigger {
    return getColorPickerTrigger(this);
  }

  set trigger(value: ColorPickerTrigger) {
    this.setAttribute("trigger", value);
  }

  get value() {
    if (this.hasAttribute("value")) {
      return this.getAttribute("value") ?? "";
    }

    return this.cssValue;
  }

  set value(value: string) {
    this.setColor(parseColorValue(value), "input", null, false);
  }

  blur() {
    this.elements?.triggerElement.blur();
  }

  focus() {
    this.elements?.triggerElement.focus();
  }

  private handleTriggerClick = (event: Event) => {
    if (this.disabled || this.trigger !== "click") {
      return;
    }

    event.preventDefault();
    this.setOpen(!this.open, "trigger");
  };

  private handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.setOpen(!this.open, "keyboard");
      return;
    }

    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      this.setOpen(false, "keyboard");
    }
  };

  private handleRootMouseEnter = () => {
    if (this.disabled || this.trigger !== "hover") {
      return;
    }

    this.clearCloseTimer();
    this.setOpen(true, "trigger");
  };

  private handleRootMouseLeave = () => {
    if (this.trigger !== "hover") {
      return;
    }

    this.clearCloseTimer();
    this.closeTimer = window.setTimeout(() => {
      this.setOpen(false, "trigger");
    }, COLOR_PICKER_HOVER_CLOSE_DELAY);
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }

    this.setOpen(false, "outside");
  };

  private handleBoardPointerDown = (event: PointerEvent) => {
    if (this.disabled || !this.elements) {
      return;
    }

    event.preventDefault();
    this.elements.boardElement.setPointerCapture(event.pointerId);
    this.updateColorFromBoard(event);
    this.elements.boardElement.addEventListener("pointermove", this.handleBoardPointerMove);
    this.elements.boardElement.addEventListener("pointerup", this.handleBoardPointerUp, {
      once: true
    });
  };

  private handleBoardPointerMove = (event: PointerEvent) => {
    this.updateColorFromBoard(event);
  };

  private handleBoardPointerUp = (event: PointerEvent) => {
    this.elements?.boardElement.removeEventListener("pointermove", this.handleBoardPointerMove);
    this.dispatchChangeCompleteEvent(event, "input");
  };

  private handleBoardKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    const currentHsb = this.currentHsb;
    const step = event.shiftKey ? 10 : 1;
    let nextSaturation = currentHsb.s;
    let nextBrightness = currentHsb.b;

    if (event.key === "ArrowLeft") {
      nextSaturation -= step;
    } else if (event.key === "ArrowRight") {
      nextSaturation += step;
    } else if (event.key === "ArrowUp") {
      nextBrightness += step;
    } else if (event.key === "ArrowDown") {
      nextBrightness -= step;
    } else {
      return;
    }

    event.preventDefault();
    this.setColor(
      {
        alpha: this.internalColor.alpha,
        hex: getHexFromHsb(
          this.internalHue,
          clampPercentage(nextSaturation),
          clampPercentage(nextBrightness)
        )
      },
      "input",
      event,
      true
    );
  };

  private handleColorInput = (event: Event) => {
    const inputElement = event.currentTarget;

    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    this.setColor(
      {
        alpha: this.internalColor.alpha,
        hex: inputElement.value
      },
      "input",
      event,
      true
    );
  };

  private handleColorInputComplete = (event: Event) => {
    this.dispatchChangeCompleteEvent(event, "input");
  };

  private handleHueInput = (event: Event) => {
    const inputElement = event.currentTarget;

    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    this.setColor(
      {
        alpha: this.internalColor.alpha,
        hex: setHueForHex(this.internalColor.hex, Number(inputElement.value))
      },
      "input",
      event,
      true
    );
  };

  private handleAlphaInput = (event: Event) => {
    const inputElement = event.currentTarget;

    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    this.setColor(
      {
        alpha: clampPercentage(Number(inputElement.value)),
        hex: this.internalColor.hex
      },
      "input",
      event,
      true
    );
  };

  private handleAlphaTextChange = (event: Event) => {
    const inputElement = event.currentTarget;

    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    this.setColor(
      {
        alpha: clampPercentage(Number(inputElement.value.replace("%", ""))),
        hex: this.internalColor.hex
      },
      "input",
      event,
      true
    );
    this.dispatchChangeCompleteEvent(event, "input");
  };

  private handleTextChange = (event: Event) => {
    const inputElement = event.currentTarget;

    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    this.setColor(parseColorValue(inputElement.value), "text", event, true);
    this.dispatchChangeCompleteEvent(event, "text");
  };

  private handleTextKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      this.setOpen(false, "keyboard");
      this.focus();
    }
  };

  private handleFormatChange = (event: Event) => {
    const customEvent = event as CustomEvent<{ key: string }>;
    const nextFormat = customEvent.detail?.key;

    if (nextFormat !== "hex" && nextFormat !== "rgb" && nextFormat !== "hsb") {
      return;
    }

    this.format = nextFormat;
    this.dispatchEvent(
      new CustomEvent<ColorPickerFormatChangeDetail>(COLOR_PICKER_FORMAT_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          format: this.format
        }
      })
    );
  };

  private handlePresetClick = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || !target.dataset.color) {
      return;
    }

    this.setColor(parseColorValue(target.dataset.color), "preset", event, true);
    this.dispatchChangeCompleteEvent(event, "preset");
  };

  private handleClear = (event: Event) => {
    if (this.disabled) {
      return;
    }

    this.setColor(parseColorValue(""), "clear", event, true, "");
    this.dispatchEvent(
      new CustomEvent(COLOR_PICKER_CLEAR_EVENT, {
        bubbles: true
      })
    );
  };

  private updateColorFromBoard(event: PointerEvent) {
    if (!this.elements) {
      return;
    }

    const rect = this.elements.boardElement.getBoundingClientRect();
    const saturation = clampPercentage(((event.clientX - rect.left) / rect.width) * 100);
    const brightness = clampPercentage(100 - ((event.clientY - rect.top) / rect.height) * 100);

    this.setColor(
      {
        alpha: this.internalColor.alpha,
        hex: getHexFromHsb(this.internalHue, saturation, brightness)
      },
      "input",
      event,
      true
    );
  }

  private render() {
    this.applyDefaultValue();

    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncElements();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createColorPickerElements({
      onAlphaInput: this.handleAlphaInput,
      onAlphaTextChange: this.handleAlphaTextChange,
      onBoardKeyDown: this.handleBoardKeyDown,
      onBoardPointerDown: this.handleBoardPointerDown,
      onClear: this.handleClear,
      onColorInput: this.handleColorInput,
      onColorInputComplete: this.handleColorInputComplete,
      onFormatChange: this.handleFormatChange,
      onHueInput: this.handleHueInput,
      onPresetClick: this.handlePresetClick,
      onTextChange: this.handleTextChange,
      onTextKeyDown: this.handleTextKeyDown,
      onTriggerClick: this.handleTriggerClick,
      onTriggerKeyDown: this.handleTriggerKeyDown
    });
    this.elements.rootElement.addEventListener("mouseenter", this.handleRootMouseEnter);
    this.elements.rootElement.addEventListener("mouseleave", this.handleRootMouseLeave);
    this.elements.popupElement.id = this.popupId;
    this.elements.triggerElement.setAttribute("aria-controls", this.popupId);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyColorPickerStyles(shadowRoot);
  }

  private applyDefaultValue() {
    if (this.hasAppliedDefaultValue) {
      return;
    }

    if (this.hasAttribute("value")) {
      this.internalColor = parseColorValue(this.value);
      this.internalHue = getHueFromHex(this.internalColor.hex);
      this.hasColor = Boolean(this.value);
    } else if (this.defaultValue) {
      this.internalColor = parseColorValue(this.defaultValue);
      this.internalHue = getHueFromHex(this.internalColor.hex);
      this.hasColor = true;
    }

    this.hasAppliedDefaultValue = true;
  }

  private syncAttributes() {
    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("picker-placement", this.pickerPlacement);
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("trigger", this.trigger);

    if (this.disabled && this.open) {
      this.setOpen(false, "trigger");
    }

    this.syncDocumentListener();
  }

  private syncElements() {
    if (!this.elements) {
      return;
    }

    syncColorPickerElements({
      allowClear: this.allowClear,
      alpha: this.currentColor.alpha,
      colorInputValue: this.currentColor.hex,
      cssValue: this.cssValue,
      disabled: this.disabled,
      disabledAlpha: this.disabledAlpha,
      disabledFormat: this.disabledFormat,
      elements: this.elements,
      format: this.format,
      hue: this.internalHue,
      open: this.open,
      presets: this.presets,
      previewBackground: this.hasColor
        ? getPreviewBackground(this.currentColor, this.disabledAlpha)
        : "transparent",
      saturation: this.currentHsb.s,
      showText: this.showText,
      textValue: this.cssValue,
      brightness: this.currentHsb.b
    });
  }

  private setColor(
    color: ParsedColor,
    source: ColorPickerChangeSource,
    nativeEvent: Event | null,
    emitChange: boolean,
    explicitValue?: string
  ) {
    if (this.disabled) {
      return;
    }

    const nextColor = {
      alpha: this.disabledAlpha ? 100 : clampPercentage(color.alpha),
      hex: color.hex
    };
    const hueElement = this.elements?.hueElement;

    this.internalColor = nextColor;
    this.internalHue =
      source === "input" && nativeEvent?.currentTarget === hueElement && hueElement
        ? Number(hueElement.value)
        : getHueFromHex(nextColor.hex);

    const nextValue =
      explicitValue ?? formatColorValue(this.internalColor, this.format, this.disabledAlpha);
    this.hasColor = nextValue !== "";
    this.isSyncingValueAttribute = true;
    this.syncNullableAttribute("value", nextValue);
    this.isSyncingValueAttribute = false;
    this.render();

    if (emitChange) {
      this.dispatchChangeEvent(source, nativeEvent, nextValue);
    }
  }

  private dispatchChangeEvent(
    source: ColorPickerChangeSource,
    nativeEvent: Event | null,
    value = this.cssValue
  ) {
    this.dispatchEvent(
      new CustomEvent<ColorPickerChangeDetail>(COLOR_PICKER_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          alpha: this.currentColor.alpha,
          css: value,
          format: this.format,
          nativeEvent,
          source,
          value
        }
      })
    );
  }

  private dispatchChangeCompleteEvent(
    nativeEvent: Event | null,
    source: ColorPickerChangeSource
  ) {
    this.dispatchEvent(
      new CustomEvent<ColorPickerChangeDetail>(COLOR_PICKER_CHANGE_COMPLETE_EVENT, {
        bubbles: true,
        detail: {
          alpha: this.currentColor.alpha,
          css: this.cssValue,
          format: this.format,
          nativeEvent,
          source,
          value: this.cssValue
        }
      })
    );
  }

  private setOpen(open: boolean, source: ColorPickerOpenChangeSource) {
    if (this.disabled && open) {
      return;
    }

    if (this.open === open) {
      return;
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<ColorPickerOpenChangeDetail>(COLOR_PICKER_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          open,
          source
        }
      })
    );
  }

  private get currentColor() {
    return this.internalColor;
  }

  private get currentHsb() {
    const hsb = getHsbFromHex(this.internalColor.hex);

    return {
      ...hsb,
      h: this.internalHue
    };
  }

  private get cssValue() {
    if (!this.hasColor) {
      return "";
    }

    return formatColorValue(this.currentColor, this.format, this.disabledAlpha);
  }

  private syncDocumentListener() {
    if (this.open && !this.documentListenerAttached) {
      document.addEventListener("pointerdown", this.handleDocumentPointerDown);
      this.documentListenerAttached = true;
      return;
    }

    if (!this.open) {
      this.detachDocumentListener();
    }
  }

  private detachDocumentListener() {
    if (!this.documentListenerAttached) {
      return;
    }

    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.documentListenerAttached = false;
  }

  private clearCloseTimer() {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = 0;
    }
  }

  private requestRender() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    this.render();
  }

  private syncNullableAttribute(name: string, value: string) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
