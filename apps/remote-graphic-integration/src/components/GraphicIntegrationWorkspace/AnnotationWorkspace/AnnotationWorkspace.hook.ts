import { useEffect, useState } from "react";

import type {
  AnnotationSavePayload,
  AnnotationStylePayload
} from "../../../lib/ViewerEngine/viewer/Annotation";
import type {
  AnnotationConfig,
  AnnotationSaveEntry,
  ViewerControlConfig
} from "../GraphicIntegrationWorkspace.types";
import { useAnnotationSaves } from "./AnnotationWorkspaceSaves.hook";
import { DEFAULT_ANNOTATION_CONFIG } from "./AnnotationWorkspace.utils";

export function useAnnotationWorkspace(
  isAnnotationMode: boolean,
  viewerConfig: ViewerControlConfig
) {
  const [annotationConfig, setAnnotationConfig] = useState<AnnotationConfig>(
    DEFAULT_ANNOTATION_CONFIG
  );
  const [clearSignal, setClearSignal] = useState(0);
  const [saveSignal, setSaveSignal] = useState(0);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const {
    addSave,
    deleteSave,
    restoreSave,
    restoreSignal,
    restoreTarget,
    saves
  } = useAnnotationSaves(viewerConfig);
  const isDrawingMode = isAnnotationMode && !isCameraMode;

  useEffect(() => {
    if (!isAnnotationMode) {
      setIsCameraMode(false);
    }
  }, [isAnnotationMode]);

  const handleToolChange = (tool: AnnotationConfig["tool"]) => {
    setIsCameraMode(false);
    setAnnotationConfig((currentConfig) => ({
      ...currentConfig,
      tool
    }));
  };
  const handleStrokeColorChange = (strokeColor: string) => {
    setAnnotationConfig((currentConfig) => ({
      ...currentConfig,
      strokeColor
    }));
  };
  const handleStrokeWidthChange = (strokeWidth: number) => {
    setAnnotationConfig((currentConfig) => ({
      ...currentConfig,
      strokeWidth
    }));
  };
  const handleSelectionStyleChange = ({
    strokeColor,
    strokeWidth
  }: AnnotationStylePayload) => {
    setAnnotationConfig((currentConfig) => ({
      ...currentConfig,
      strokeColor,
      strokeWidth
    }));
  };
  const handleClear = () => {
    setClearSignal((signal) => signal + 1);
  };
  const handleSaveRequest = () => {
    setSaveSignal((signal) => signal + 1);
  };
  const handleSave = (payload: AnnotationSavePayload) => {
    addSave(payload);
  };
  const handleRestore = (save: AnnotationSaveEntry) => {
    setIsCameraMode(false);
    setAnnotationConfig((currentConfig) => ({
      ...currentConfig,
      tool: "select"
    }));
    restoreSave(save);
  };
  const handleDelete = (saveId: string) => {
    deleteSave(saveId);
  };
  const toggleCameraMode = () => {
    setIsCameraMode((cameraMode) => !cameraMode);
  };

  return {
    annotationConfig,
    clearSignal,
    handleClear,
    handleDelete,
    handleSave,
    handleSaveRequest,
    handleRestore,
    handleSelectionStyleChange,
    handleStrokeColorChange,
    handleStrokeWidthChange,
    handleToolChange,
    isCameraMode,
    isDrawingMode,
    saveSignal,
    restoreSignal,
    restoreTarget,
    saves,
    toggleCameraMode
  };
}
