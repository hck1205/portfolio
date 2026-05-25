import { useEffect, useRef } from "react";

import { DS_SLIDER_CHANGE_EVENT } from "./Controls.constants";
import type { SliderChangeEvent, SliderElement } from "./Controls.types";
import styles from "../ControlPanelTabs.module.css";
import type { SliderControlProps } from "../ControlPanelTabs.types";

export function SliderControl({
  label,
  max,
  min,
  onChange,
  step,
  value
}: SliderControlProps) {
  const sliderRef = useRef<SliderElement | null>(null);
  const roundedValue = Number(value.toFixed(2));

  useEffect(() => {
    sliderRef.current?.setAttribute("value", String(roundedValue));
  }, [roundedValue]);

  useEffect(() => {
    const sliderElement = sliderRef.current;

    if (!sliderElement) {
      return;
    }

    const handleChange = (event: Event) => {
      const sliderEvent = event as SliderChangeEvent;
      const nextValue = sliderEvent.detail.value;

      if (typeof nextValue === "number") {
        onChange(nextValue);
      }
    };

    sliderElement.addEventListener(DS_SLIDER_CHANGE_EVENT, handleChange);

    return () => {
      sliderElement.removeEventListener(DS_SLIDER_CHANGE_EVENT, handleChange);
    };
  }, [onChange]);

  return (
    <div className={styles.sliderControl}>
      <ds-slider
        aria-label={label}
        max={max}
        min={min}
        ref={sliderRef}
        step={step}
        tooltip="auto"
        value={roundedValue}
      />
      <ds-typography
        className={styles.sliderValue}
        color="#4b5560"
        typo-name="UI/Footnote/4/Bold"
      >
        {roundedValue.toFixed(2)}
      </ds-typography>
    </div>
  );
}
