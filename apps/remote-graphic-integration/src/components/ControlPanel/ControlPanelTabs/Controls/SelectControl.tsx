import { useEffect, useMemo, useRef } from "react";

import { DS_SELECT_CHANGE_EVENT } from "./Controls.constants";
import type { SelectChangeEvent, SelectElement } from "./Controls.types";
import styles from "../ControlPanelTabs.module.css";
import type { SelectControlProps } from "../ControlPanelTabs.types";

export function SelectControl({
  label,
  onChange,
  options,
  value
}: SelectControlProps) {
  const selectRef = useRef<SelectElement | null>(null);
  const serializedOptions = useMemo(
    () => JSON.stringify(options),
    [options]
  );

  useEffect(() => {
    selectRef.current?.setAttribute("value", value);
  }, [value]);

  useEffect(() => {
    const selectElement = selectRef.current;

    if (!selectElement) {
      return;
    }

    const handleChange = (event: Event) => {
      const selectEvent = event as SelectChangeEvent;
      const nextValue = selectEvent.detail.value;

      if (typeof nextValue === "string") {
        onChange(nextValue);
      }
    };

    selectElement.addEventListener(DS_SELECT_CHANGE_EVENT, handleChange);

    return () => {
      selectElement.removeEventListener(DS_SELECT_CHANGE_EVENT, handleChange);
    };
  }, [onChange]);

  return (
    <ds-select
      aria-label={label}
      className={styles.selectControl}
      options={serializedOptions}
      placement="topLeft"
      ref={selectRef}
      show-search="false"
      size="small"
      value={value}
    />
  );
}
