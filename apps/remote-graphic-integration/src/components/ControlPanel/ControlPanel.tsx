import { ControlPanelTabs } from "./ControlPanelTabs";
import styles from "./ControlPanel.module.css";
import type { ControlPanelProps } from "./ControlPanel.types";

export function ControlPanel({
  activeTabId,
  annotationSaves,
  collapsed,
  onActiveTabChange,
  onAnnotationSaveDelete,
  onAnnotationSaveSelect,
  onMaterialPresetChange,
  onMaterialTintChange,
  onViewerConfigChange,
  onViewerNumberConfigChange,
  onViewerOptionConfigChange,
  onViewerScreenshot,
  viewerConfig
}: ControlPanelProps) {
  return (
    <ds-layout-sider
      aria-label="Model control panel"
      className={styles.controlPanel}
      collapsed={collapsed}
      collapsed-width="0"
      reverse-arrow=""
      theme="light"
      trigger="none"
      width="340"
    >
      <div className={styles.controlPanelShell}>
        <header className={styles.header}>
          <ds-typography
            className={styles.eyebrow}
            color="#69737d"
            typo-name="UI/Footnote/4/Normal"
          >
            3D Viewer
          </ds-typography>
          <ds-typography
            className={styles.title}
            display="block"
            typo-name="UI/Label/5/Bold"
          >
            Leather Coat
          </ds-typography>
        </header>
        <div className={styles.tabWrapper}>
          <ControlPanelTabs
            activeTabId={activeTabId}
            annotationSaves={annotationSaves}
            onActiveTabChange={onActiveTabChange}
            onAnnotationSaveDelete={onAnnotationSaveDelete}
            onAnnotationSaveSelect={onAnnotationSaveSelect}
            onMaterialPresetChange={onMaterialPresetChange}
            onMaterialTintChange={onMaterialTintChange}
            onViewerConfigChange={onViewerConfigChange}
            onViewerNumberConfigChange={onViewerNumberConfigChange}
            onViewerOptionConfigChange={onViewerOptionConfigChange}
            onViewerScreenshot={onViewerScreenshot}
            viewerConfig={viewerConfig}
          />
        </div>
      </div>
    </ds-layout-sider>
  );
}
