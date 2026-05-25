import styles from "../ControlPanelTabs.module.css";
import type { ControlRowProps } from "../ControlPanelTabs.types";

export function ControlRow({
  children,
  description,
  label,
  layout = "inline"
}: ControlRowProps) {
  const rowClassName =
    layout === "stacked"
      ? `${styles.controlRow} ${styles.controlRowStacked}`
      : styles.controlRow;

  return (
    <div className={rowClassName}>
      <div className={styles.controlText}>
        <ds-typography
          className={styles.controlLabel}
          typo-name="UI/Label/5/Bold"
        >
          {label}
        </ds-typography>
        <ds-typography
          className={styles.controlDescription}
          color="#69737d"
          display="block"
          text-overflow="break"
          typo-name="UI/Footnote/3/Normal"
        >
          {description}
        </ds-typography>
      </div>
      {children}
    </div>
  );
}
