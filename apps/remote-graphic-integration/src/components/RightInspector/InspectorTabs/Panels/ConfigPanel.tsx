import {
  ColorControl,
  ControlRow,
  PendingControl,
  SwitchControl
} from "../Controls";
import { configControlSections } from "../InspectorTabs.constants";
import styles from "../InspectorTabs.module.css";
import type {
  ConfigControl,
  ConfigPanelProps
} from "../InspectorTabs.types";

export function ConfigPanel({
  onMaterialTintChange,
  onViewerConfigChange,
  viewerConfig
}: ConfigPanelProps) {
  const renderControlInput = (control: ConfigControl) => {
    if (control.type === "boolean") {
      return (
        <SwitchControl
          checked={viewerConfig[control.key]}
          label={control.label}
          onChange={(nextChecked) =>
            onViewerConfigChange(control.key, nextChecked)
          }
        />
      );
    }

    if (control.type === "color") {
      return (
        <ColorControl
          className={styles.colorControl}
          label={control.label}
          onChange={onMaterialTintChange}
          value={viewerConfig.materialTint}
        />
      );
    }

    return <PendingControl />;
  };

  return (
    <section className={styles.tabPanel}>
      <div className={styles.sectionList}>
        {configControlSections.map((section) => (
          <section className={styles.configSection} key={section.id}>
            <header className={styles.sectionHeader}>
              <ds-typography
                className={styles.sectionTitle}
                typo-name="UI/Label/4/Bold"
              >
                {section.title}
              </ds-typography>
              <ds-typography
                className={styles.sectionDescription}
                color="#69737d"
                display="block"
                text-overflow="break"
                typo-name="UI/Footnote/4/Normal"
              >
                {section.description}
              </ds-typography>
            </header>
            <div className={styles.controlList}>
              {section.controls.map((control) => (
                <ControlRow
                  description={control.description}
                  key={`${section.id}-${control.label}`}
                  label={control.label}
                >
                  {renderControlInput(control)}
                </ControlRow>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
