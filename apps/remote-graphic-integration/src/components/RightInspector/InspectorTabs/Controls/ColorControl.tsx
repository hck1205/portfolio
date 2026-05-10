import { useEffect, useRef } from "react";

import {
  COAT_COLOR_PICKER_PLACEMENT,
  DS_COLOR_PICKER_CHANGE_EVENT
} from "./Controls.constants";
import type {
  ColorPickerChangeEvent,
  ColorPickerElement
} from "./Controls.types";
import type { ColorControlProps } from "../InspectorTabs.types";

export function ColorControl({
  className,
  label,
  onChange,
  value
}: ColorControlProps) {
  const colorPickerRef = useRef<ColorPickerElement | null>(null);

  useEffect(() => {
    if (colorPickerRef.current) {
      colorPickerRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    const colorPickerElement = colorPickerRef.current;

    if (!colorPickerElement) {
      return;
    }

    const handleChange = (event: Event) => {
      const colorPickerEvent = event as ColorPickerChangeEvent;

      onChange(colorPickerEvent.detail.value);
    };

    colorPickerElement.addEventListener(
      DS_COLOR_PICKER_CHANGE_EVENT,
      handleChange
    );

    return () => {
      colorPickerElement.removeEventListener(
        DS_COLOR_PICKER_CHANGE_EVENT,
        handleChange
      );
    };
  }, [onChange]);

  return (
    <ds-color-picker
      aria-label={label}
      className={className}
      disabled-alpha=""
      format="hex"
      picker-placement={COAT_COLOR_PICKER_PLACEMENT}
      ref={colorPickerRef}
      size="small"
      value={value}
    />
  );
}
