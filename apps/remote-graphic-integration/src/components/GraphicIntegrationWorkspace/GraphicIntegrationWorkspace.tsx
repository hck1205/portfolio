import { useState } from "react";

import { RightInspector } from "../RightInspector";
import { Viewer } from "../../lib/ViewerEngine/viewer";
import { DEFAULT_VIEWER_CONTROL_CONFIG } from "./GraphicIntegrationWorkspace.constants";
import styles from "./GraphicIntegrationWorkspace.module.css";
import type {
  GraphicIntegrationWorkspaceProps,
  ViewerControlChangeHandler,
  ViewerControlConfig,
  ViewerMaterialTintChangeHandler
} from "./GraphicIntegrationWorkspace.types";

export function GraphicIntegrationWorkspace({
  modelUrl
}: GraphicIntegrationWorkspaceProps) {
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(true);
  const [viewerConfig, setViewerConfig] = useState<ViewerControlConfig>(
    DEFAULT_VIEWER_CONTROL_CONFIG
  );
  const viewerClassName = `${styles.viewerSurface} ${
    isInspectorCollapsed ? "" : styles.viewerSurfaceInspectorOpen
  }`;
  const toggleClassName = `${styles.inspectorToggle} ${
    isInspectorCollapsed ? styles.inspectorToggleCollapsed : ""
  }`;
  const handleViewerConfigChange: ViewerControlChangeHandler = (key, value) => {
    setViewerConfig((currentConfig) => ({
      ...currentConfig,
      [key]: value
    }));
  };
  const handleMaterialTintChange: ViewerMaterialTintChangeHandler = (value) => {
    setViewerConfig((currentConfig) => ({
      ...currentConfig,
      materialTint: value
    }));
  };

  return (
    <ds-layout className={styles.workspace} has-sider="">
      <ds-layout-content className={styles.viewerRegion}>
        <Viewer
          autoRotate={viewerConfig.autoRotate}
          canZoom={viewerConfig.canZoom}
          className={viewerClassName}
          materialTint={viewerConfig.materialTint}
          modelUrl={modelUrl}
          showEnvironment={viewerConfig.showEnvironment}
          showGrid={viewerConfig.showGrid}
          useDamping={viewerConfig.useDamping}
        />
      </ds-layout-content>
      <ds-button
        aria-label={
          isInspectorCollapsed ? "Open model inspector" : "Close model inspector"
        }
        className={toggleClassName}
        onClick={() => setIsInspectorCollapsed((collapsed) => !collapsed)}
        shape="circle"
        size="middle"
        type="text"
      >
        <ds-icon icon="settings" size="18" />
      </ds-button>
      <RightInspector
        collapsed={isInspectorCollapsed}
        onMaterialTintChange={handleMaterialTintChange}
        onViewerConfigChange={handleViewerConfigChange}
        viewerConfig={viewerConfig}
      />
    </ds-layout>
  );
}
