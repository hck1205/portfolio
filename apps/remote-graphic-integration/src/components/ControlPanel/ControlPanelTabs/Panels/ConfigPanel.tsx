import { useEffect, useRef, useState } from "react";

import {
  ActionControl,
  ColorControl,
  ControlRow,
  PendingControl,
  SelectControl,
  SliderControl,
  SwitchControl
} from "../Controls";
import {
  DEFAULT_ACTIVE_CONFIG_SECTION_ID,
  configControlSections,
  materialPresetOptions
} from "../ControlPanelTabs.constants";
import styles from "../ControlPanelTabs.module.css";
import type {
  ConfigControlSectionId,
  ConfigControl,
  ConfigPanelProps,
  MaterialPresetOption
} from "../ControlPanelTabs.types";
import {
  isCameraPresetId,
  isPartVisibilityMode
} from "../../../../lib/ViewerEngine/viewer/Display";

type CollapseToggleEvent = CustomEvent<{
  itemKey: ConfigControlSectionId;
  open: boolean;
}>;

export function ConfigPanel({
  onMaterialPresetChange,
  onMaterialTintChange,
  onViewerConfigChange,
  onViewerNumberConfigChange,
  onViewerOptionConfigChange,
  onViewerScreenshot,
  viewerConfig
}: ConfigPanelProps) {
  const collapseRef = useRef<HTMLElement | null>(null);
  const [activeSectionId, setActiveSectionId] =
    useState<ConfigControlSectionId | "">(DEFAULT_ACTIVE_CONFIG_SECTION_ID);

  useEffect(() => {
    const collapseElement = collapseRef.current;

    if (!collapseElement) {
      return;
    }

    const handleCollapseToggle = (event: Event) => {
      const { itemKey, open } = (event as CollapseToggleEvent).detail;

      setActiveSectionId(open ? itemKey : "");
    };

    collapseElement.addEventListener(
      "ds-collapse-toggle",
      handleCollapseToggle
    );

    return () => {
      collapseElement.removeEventListener(
        "ds-collapse-toggle",
        handleCollapseToggle
      );
    };
  }, []);

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

    if (control.type === "number") {
      return (
        <SliderControl
          label={control.label}
          max={control.max}
          min={control.min}
          onChange={(nextValue) =>
            onViewerNumberConfigChange(control.key, nextValue)
          }
          step={control.step}
          value={viewerConfig[control.key]}
        />
      );
    }

    if (control.type === "preset") {
      return (
        <SelectControl
          label={control.label}
          onChange={(nextValue) => {
            if (isMaterialPresetValue(nextValue)) {
              onMaterialPresetChange(nextValue);
            }
          }}
          options={[...materialPresetOptions]}
          value={viewerConfig.materialPreset}
        />
      );
    }

    if (control.type === "option") {
      return (
        <SelectControl
          label={control.label}
          onChange={(nextValue) => {
            if (control.key === "cameraPreset" && isCameraPresetId(nextValue)) {
              onViewerOptionConfigChange(control.key, nextValue);
            }

            if (
              control.key === "partVisibilityMode" &&
              isPartVisibilityMode(nextValue)
            ) {
              onViewerOptionConfigChange(control.key, nextValue);
            }
          }}
          options={[...control.options]}
          value={viewerConfig[control.key]}
        />
      );
    }

    if (control.type === "action") {
      return (
        <ActionControl
          icon={control.icon}
          label={control.label}
          onClick={onViewerScreenshot}
        />
      );
    }

    return <PendingControl />;
  };

  return (
    <section className={styles.tabPanel}>
      <ds-collapse
        accordion="true"
        active-key={activeSectionId}
        className={styles.sectionCollapse}
        default-active-key={DEFAULT_ACTIVE_CONFIG_SECTION_ID}
        ref={collapseRef}
        size="small"
      >
        {configControlSections.map((section) => (
          <ds-collapse-item
            heading-level="3"
            item-key={section.id}
            key={section.id}
            label={section.title}
          >
            <div className={styles.sectionBody}>
              <ds-typography
                className={styles.sectionDescription}
                color="#69737d"
                display="block"
                text-overflow="break"
                typo-name="UI/Footnote/4/Normal"
              >
                {section.description}
              </ds-typography>
              <ds-divider className={styles.sectionDivider} size="small" />
              <div className={styles.controlList}>
                {section.controls.map((control) => (
                  <ControlRow
                    description={control.description}
                    key={`${section.id}-${control.label}`}
                    label={control.label}
                    layout="stacked"
                  >
                    {renderControlInput(control)}
                  </ControlRow>
                ))}
              </div>
            </div>
          </ds-collapse-item>
        ))}
      </ds-collapse>
    </section>
  );
}

function isMaterialPresetValue(
  value: string
): value is MaterialPresetOption["value"] {
  return materialPresetOptions.some((option) => option.value === value);
}
