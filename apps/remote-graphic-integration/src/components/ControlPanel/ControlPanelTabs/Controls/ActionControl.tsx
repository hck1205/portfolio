import styles from "../ControlPanelTabs.module.css";
import type { ActionControlProps } from "../ControlPanelTabs.types";

export function ActionControl({
  icon,
  label,
  onClick
}: ActionControlProps) {
  return (
    <ds-button
      className={styles.actionControl}
      html-type="button"
      onClick={onClick}
      size="small"
      type="default"
    >
      <ds-icon icon={icon} size="14" />
      {label}
    </ds-button>
  );
}
