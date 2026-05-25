import { useRef, useState } from "react";

import { ControlPanel } from "../ControlPanel";
import { Viewer } from "../../lib/ViewerEngine/viewer";
import {
  downloadScreenshot,
  type ViewerScreenshotHandle
} from "../../lib/ViewerEngine/viewer/Screenshot";
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
  ViewerMaterialTintChangeHandler,
  ViewerOptionControlChangeHandler
} from "./GraphicIntegrationWorkspace.types";

export function GraphicIntegrationWorkspace({
  modelUrl
}: GraphicIntegrationWorkspaceProps) {
  const viewerRef = useRef<ViewerScreenshotHandle | null>(null);
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
  const handleViewerOptionConfigChange: ViewerOptionControlChangeHandler = (
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
  const handleViewerScreenshot = () => {
    const dataUrl = viewerRef.current?.captureScreenshot() ?? null;

    if (dataUrl) {
      downloadScreenshot(dataUrl);
    }
  };

  return (
    <ds-layout className={styles.workspace} has-sider="">
      <ds-layout-content className={styles.viewerRegion}>
        <Viewer
          autoRotate={viewerConfig.autoRotate}
          canZoom={viewerConfig.canZoom}
          cameraPreset={viewerConfig.cameraPreset}
          className={viewerClassName}
          directionalLightIntensity={viewerConfig.directionalLightIntensity}
          environmentIntensity={viewerConfig.environmentIntensity}
          exposure={viewerConfig.exposure}
          materialMetalness={viewerConfig.materialMetalness}
          materialOpacity={viewerConfig.materialOpacity}
          materialRoughness={viewerConfig.materialRoughness}
          materialTint={viewerConfig.materialTint}
          modelUrl={modelUrl}
          partVisibilityMode={viewerConfig.partVisibilityMode}
          showBoundingBox={viewerConfig.showBoundingBox}
          showEnvironment={viewerConfig.showEnvironment}
          showGrid={viewerConfig.showGrid}
          showLogoDecal={viewerConfig.showLogoDecal}
          showPatternOverlay={viewerConfig.showPatternOverlay}
          textureNormalIntensity={viewerConfig.textureNormalIntensity}
          textureRepeat={viewerConfig.textureRepeat}
          useDamping={viewerConfig.useDamping}
          ref={viewerRef}
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
        onViewerOptionConfigChange={handleViewerOptionConfigChange}
        onViewerScreenshot={handleViewerScreenshot}
        viewerConfig={viewerConfig}
      />
    </ds-layout>
  );
}
