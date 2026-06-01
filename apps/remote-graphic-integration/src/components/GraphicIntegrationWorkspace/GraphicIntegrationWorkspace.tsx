import { lazy, Suspense, useRef, useState } from "react";

import type { ViewerScreenshotHandle } from "../../lib/ViewerEngine/viewer/Screenshot";
import type { ControlPanelTabId } from "../ControlPanel/ControlPanelTabs/ControlPanelTabs.types";
import { AnnotationToolbar } from "./AnnotationToolbar";
import { useAnnotationWorkspace } from "./AnnotationWorkspace";
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
  const [activeControlPanelTabId, setActiveControlPanelTabId] =
    useState<ControlPanelTabId>("config");
  const [viewerConfig, setViewerConfig] = useState<ViewerControlConfig>(
    DEFAULT_VIEWER_CONTROL_CONFIG
  );
  const isAnnotationMode =
    !isControlPanelCollapsed && activeControlPanelTabId === "annotation";
  const {
    annotationConfig,
    clearSignal: annotationClearSignal,
    handleClear: handleAnnotationClear,
    handleDelete: handleAnnotationDelete,
    handleSave: handleAnnotationSave,
    handleSaveRequest: handleAnnotationSaveRequest,
    handleRestore: handleAnnotationRestore,
    handleSelectionStyleChange: handleAnnotationSelectionStyleChange,
    handleStrokeColorChange: handleAnnotationStrokeColorChange,
    handleStrokeWidthChange: handleAnnotationStrokeWidthChange,
    handleToolChange: handleAnnotationToolChange,
    isCameraMode: isAnnotationCameraMode,
    isDrawingMode: isAnnotationDrawingMode,
    restoreSignal: annotationRestoreSignal,
    restoreTarget: annotationRestoreTarget,
    saveSignal: annotationSaveSignal,
    saves: annotationSaves,
    toggleCameraMode: toggleAnnotationCameraMode
  } = useAnnotationWorkspace(isAnnotationMode, viewerConfig);
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
  const handleAnnotationSaveSelect = (
    save: (typeof annotationSaves)[number]
  ) => {
    setViewerConfig(save.viewerState);
    handleAnnotationRestore(save);
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
            annotationClearSignal={annotationClearSignal}
            annotationMode={isAnnotationDrawingMode}
            annotationRestoreSignal={annotationRestoreSignal}
            annotationRestoreSnapshot={
              annotationRestoreTarget?.annotationSnapshot ?? null
            }
            annotationSaveSignal={annotationSaveSignal}
            annotationStrokeColor={annotationConfig.strokeColor}
            annotationStrokeWidth={annotationConfig.strokeWidth}
            annotationTool={annotationConfig.tool}
            autoRotate={viewerConfig.autoRotate}
            canZoom={viewerConfig.canZoom}
            cameraRestoreSnapshot={annotationRestoreTarget?.camera ?? null}
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
            onAnnotationSave={handleAnnotationSave}
            onAnnotationSelectionStyleChange={
              handleAnnotationSelectionStyleChange
            }
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
      {isAnnotationMode ? (
        <>
          <button
            aria-label={
              isAnnotationCameraMode
                ? "Return to annotation drawing"
                : "Use camera controls"
            }
            aria-pressed={isAnnotationCameraMode}
            className={styles.annotationCameraToggle}
            onClick={toggleAnnotationCameraMode}
            title={
              isAnnotationCameraMode
                ? "Return to annotation drawing"
                : "Use camera controls"
            }
            type="button"
          >
            <ds-icon icon="rotate3-d" size="17" />
          </button>
          <AnnotationToolbar
            activeStrokeColor={annotationConfig.strokeColor}
            activeStrokeWidth={annotationConfig.strokeWidth}
            activeTool={annotationConfig.tool}
            onClear={handleAnnotationClear}
            onSave={handleAnnotationSaveRequest}
            onStrokeColorChange={handleAnnotationStrokeColorChange}
            onStrokeWidthChange={handleAnnotationStrokeWidthChange}
            onToolChange={handleAnnotationToolChange}
          />
        </>
      ) : null}
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
            activeTabId={activeControlPanelTabId}
            annotationSaves={annotationSaves}
            collapsed={isControlPanelCollapsed}
            onActiveTabChange={setActiveControlPanelTabId}
            onAnnotationSaveDelete={handleAnnotationDelete}
            onAnnotationSaveSelect={handleAnnotationSaveSelect}
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
