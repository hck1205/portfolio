import { useEffect, useRef } from "react";

import { DS_SWITCH_CHANGE_EVENT } from "./Controls.constants";
import type { SwitchChangeEvent, SwitchElement } from "./Controls.types";
import type { SwitchControlProps } from "../ControlPanelTabs.types";

export function SwitchControl({
  checked,
  label,
  onChange
}: SwitchControlProps) {
  const switchRef = useRef<SwitchElement | null>(null);

  useEffect(() => {
    if (switchRef.current) {
      switchRef.current.checked = checked;
    }
  }, [checked]);

  useEffect(() => {
    const switchElement = switchRef.current;

    if (!switchElement) {
      return;
    }

    const handleChange = (event: Event) => {
      const switchEvent = event as SwitchChangeEvent;

      onChange(switchEvent.detail.checked);
    };

    switchElement.addEventListener(DS_SWITCH_CHANGE_EVENT, handleChange);

    return () => {
      switchElement.removeEventListener(DS_SWITCH_CHANGE_EVENT, handleChange);
    };
  }, [onChange]);

  return <ds-switch aria-label={label} ref={switchRef} size="small" />;
}
