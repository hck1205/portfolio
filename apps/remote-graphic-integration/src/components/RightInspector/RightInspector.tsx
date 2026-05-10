import { InspectorTabs } from "./InspectorTabs";
import styles from "./RightInspector.module.css";
import type { RightInspectorProps } from "./RightInspector.types";

export function RightInspector({
  collapsed,
  onMaterialTintChange,
  onViewerConfigChange,
  viewerConfig
}: RightInspectorProps) {
  return (
    <ds-layout-sider
      aria-label="Model inspector"
      className={styles.inspector}
      collapsed={collapsed}
      collapsed-width="0"
      reverse-arrow=""
      theme="light"
      trigger="none"
      width="340"
    >
      <div className={styles.inspectorShell}>
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
            <InspectorTabs
              onMaterialTintChange={onMaterialTintChange}
              onViewerConfigChange={onViewerConfigChange}
              viewerConfig={viewerConfig}
            />
          </div>
        </div>
      </ds-layout-sider>
  );
}
