import { useState } from "react";

import { ControlPanel } from "../ControlPanel";
import { Viewer } from "../../lib/ViewerEngine/viewer";
import {
  DEFAULT_VIEWER_CONTROL_CONFIG,
  MATERIAL_PRESETS
} from "./GraphicIntegrationWorkspace.constants";
import styles from "./GraphicIntegrationWorkspace.module.css";
import type {
  GraphicIntegrationWorkspaceProps,
  ViewerControlChangeHandler,
  ViewerControlConfig,
  ViewerMaterialPresetChangeHandler,
  ViewerNumberControlChangeHandler,
  ViewerMaterialTintChangeHandler
} from "./GraphicIntegrationWorkspace.types";

export function GraphicIntegrationWorkspace({
  modelUrl
}: GraphicIntegrationWorkspaceProps) {
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(true);
  const [viewerConfig, setViewerConfig] = useState<ViewerControlConfig>(
    DEFAULT_VIEWER_CONTROL_CONFIG
  );
  const viewerClassName = `${styles.viewerSurface} ${
    isControlPanelCollapsed ? "" : styles.viewerSurfaceControlPanelOpen
  }`;
  const toggleClassName = `${styles.controlPanelToggle} ${
    isControlPanelCollapsed ? styles.controlPanelToggleCollapsed : ""
  }`;
  const handleViewerConfigChange: ViewerControlChangeHandler = (key, value) => {
    setViewerConfig((currentConfig) => ({
      ...currentConfig,
      [key]: value
    }));
  };
  const handleViewerNumberConfigChange: ViewerNumberControlChangeHandler = (
    key,
    value
  ) => {
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
  const handleMaterialPresetChange: ViewerMaterialPresetChangeHandler = (
    value
  ) => {
    setViewerConfig((currentConfig) => ({
      ...currentConfig,
      ...MATERIAL_PRESETS[value],
      materialPreset: value
    }));
  };

  return (
    <ds-layout className={styles.workspace} has-sider="">
      <ds-layout-content className={styles.viewerRegion}>
        <Viewer
          autoRotate={viewerConfig.autoRotate}
          canZoom={viewerConfig.canZoom}
          className={viewerClassName}
          materialMetalness={viewerConfig.materialMetalness}
          materialOpacity={viewerConfig.materialOpacity}
          materialRoughness={viewerConfig.materialRoughness}
          materialTint={viewerConfig.materialTint}
          modelUrl={modelUrl}
          showEnvironment={viewerConfig.showEnvironment}
          showGrid={viewerConfig.showGrid}
          useDamping={viewerConfig.useDamping}
        />
      </ds-layout-content>
      <ds-button
        aria-label={
          isControlPanelCollapsed
            ? "Open model control panel"
            : "Close model control panel"
        }
        className={toggleClassName}
        onClick={() => setIsControlPanelCollapsed((collapsed) => !collapsed)}
        shape="circle"
        size="middle"
        type="text"
      >
        <ds-icon icon="settings" size="18" />
      </ds-button>
      <ControlPanel
        collapsed={isControlPanelCollapsed}
        onMaterialPresetChange={handleMaterialPresetChange}
        onMaterialTintChange={handleMaterialTintChange}
        onViewerConfigChange={handleViewerConfigChange}
        onViewerNumberConfigChange={handleViewerNumberConfigChange}
        viewerConfig={viewerConfig}
      />
    </ds-layout>
  );
}
