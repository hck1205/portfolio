import { useEffect, useRef, useState } from "react";

import {
  COAT_COLOR_PICKER_PLACEMENT,
  DS_COLOR_PICKER_CHANGE_EVENT
} from "./Controls.constants";
import type {
  ColorPickerChangeEvent,
  ColorPickerElement
} from "./Controls.types";
import styles from "../ControlPanelTabs.module.css";
import type { ColorControlProps } from "../ControlPanelTabs.types";

export function ColorControl({
  className,
  label,
  onChange,
  value
}: ColorControlProps) {
  const colorPickerRef = useRef<ColorPickerElement | null>(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (colorPickerRef.current) {
      colorPickerRef.current.value = value;
    }

    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    const colorPickerElement = colorPickerRef.current;

    if (!colorPickerElement) {
      return;
    }

    const handleChange = (event: Event) => {
      const colorPickerEvent = event as ColorPickerChangeEvent;
      const nextValue = colorPickerEvent.detail.value;

      setDisplayValue(nextValue);
      onChange(nextValue);
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
    <div className={className}>
      <ds-color-picker
        aria-label={label}
        disabled-alpha=""
        format="hex"
        picker-placement={COAT_COLOR_PICKER_PLACEMENT}
        ref={colorPickerRef}
        size="small"
        value={value}
      />
      <ds-typography
        className={styles.colorValue}
        color="#4b5560"
        typo-name="UI/Footnote/4/Bold"
      >
        {displayValue.toUpperCase()}
      </ds-typography>
    </div>
  );
}
