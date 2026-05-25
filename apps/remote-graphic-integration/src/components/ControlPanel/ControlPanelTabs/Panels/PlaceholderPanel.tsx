import styles from "../ControlPanelTabs.module.css";

export function PlaceholderPanel() {
  return (
    <section className={styles.placeholderPanel}>
      <ds-typography color="#69737d" typo-name="UI/Label/5/Normal">
        Coming soon.
      </ds-typography>
    </section>
  );
}
