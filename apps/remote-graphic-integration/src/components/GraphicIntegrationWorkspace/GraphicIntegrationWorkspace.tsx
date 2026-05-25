import { lazy, Suspense, useRef, useState } from "react";

import type { ViewerScreenshotHandle } from "../../lib/ViewerEngine/viewer/Screenshot";
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

const LazyControlPanel = lazy(() =>
  import("../ControlPanel").then((module) => ({
    default: module.ControlPanel
  }))
);

const LazyViewer = lazy(() =>
  import("../../lib/ViewerEngine/viewer").then((module) => ({
    default: module.Viewer
  }))
);

function preloadControlPanel() {
  void import("../ControlPanel");
}

export function GraphicIntegrationWorkspace({
  modelUrl
}: GraphicIntegrationWorkspaceProps) {
  const viewerRef = useRef<ViewerScreenshotHandle | null>(null);
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(true);
  const [hasOpenedControlPanel, setHasOpenedControlPanel] = useState(false);
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
  const handleViewerScreenshot = async () => {
    const dataUrl = viewerRef.current?.captureScreenshot() ?? null;

    if (dataUrl) {
      const { downloadScreenshot } = await import(
        "../../lib/ViewerEngine/viewer/Screenshot"
      );

      downloadScreenshot(dataUrl);
    }
  };
  const handleControlPanelToggle = () => {
    setHasOpenedControlPanel(true);
    setIsControlPanelCollapsed((collapsed) => !collapsed);
  };

  return (
    <ds-layout className={styles.workspace} has-sider="">
      <ds-layout-content className={styles.viewerRegion}>
        <Suspense fallback={<div className={styles.viewerLoadingSurface} />}>
          <LazyViewer
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
            ref={viewerRef}
            showBoundingBox={viewerConfig.showBoundingBox}
            showEnvironment={viewerConfig.showEnvironment}
            showGrid={viewerConfig.showGrid}
            showLogoDecal={viewerConfig.showLogoDecal}
            showPatternOverlay={viewerConfig.showPatternOverlay}
            textureNormalIntensity={viewerConfig.textureNormalIntensity}
            textureRepeat={viewerConfig.textureRepeat}
            useDamping={viewerConfig.useDamping}
          />
        </Suspense>
      </ds-layout-content>
      <ds-button
        aria-label={
          isControlPanelCollapsed
            ? "Open model control panel"
            : "Close model control panel"
        }
        className={toggleClassName}
        onFocus={preloadControlPanel}
        onClick={handleControlPanelToggle}
        onPointerEnter={preloadControlPanel}
        shape="circle"
        size="middle"
        type="text"
      >
        <ds-icon icon="settings" size="18" />
      </ds-button>
      {hasOpenedControlPanel ? (
        <Suspense fallback={null}>
          <LazyControlPanel
            collapsed={isControlPanelCollapsed}
            onMaterialPresetChange={handleMaterialPresetChange}
            onMaterialTintChange={handleMaterialTintChange}
            onViewerConfigChange={handleViewerConfigChange}
            onViewerNumberConfigChange={handleViewerNumberConfigChange}
            onViewerOptionConfigChange={handleViewerOptionConfigChange}
            onViewerScreenshot={handleViewerScreenshot}
            viewerConfig={viewerConfig}
          />
        </Suspense>
      ) : null}
    </ds-layout>
  );
}
