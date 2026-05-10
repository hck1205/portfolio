import styles from "../InspectorTabs.module.css";
import type { ControlRowProps } from "../InspectorTabs.types";

export function ControlRow({ children, description, label }: ControlRowProps) {
  return (
    <div className={styles.controlRow}>
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
