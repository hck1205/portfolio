import styles from "../InspectorTabs.module.css";

export function PendingControl() {
  return (
    <ds-typography
      className={styles.pendingBadge}
      color="#8a6470"
      typo-name="UI/Footnote/4/Bold"
    >
      준비중
    </ds-typography>
  );
}
