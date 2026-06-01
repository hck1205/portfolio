import type {
  CameraPresetId,
  PartVisibilityMode
} from "./Display/Display.types";
import type {
  AnnotationCameraSnapshot,
  AnnotationSavePayload,
  AnnotationSnapshotPayload,
  AnnotationStylePayload,
  AnnotationTool
} from "./Annotation";

export type ViewerProps = {
  annotationClearSignal?: number;
  annotationMode?: boolean;
  annotationSaveSignal?: number;
  annotationStrokeColor?: string;
  annotationStrokeWidth?: number;
  annotationTool?: AnnotationTool;
  annotationRestoreSignal?: number;
  annotationRestoreSnapshot?: AnnotationSnapshotPayload | null;
  cameraRestoreSnapshot?: AnnotationCameraSnapshot | null;
  modelUrl?: string;
  className?: string;
  cameraPreset?: CameraPresetId;
  directionalLightIntensity?: number;
  environmentIntensity?: number;
  exposure?: number;
  materialMetalness?: number;
  materialOpacity?: number;
  materialRoughness?: number;
  autoRotate?: boolean;
  canZoom?: boolean;
  materialTint?: string;
  partVisibilityMode?: PartVisibilityMode;
  showBoundingBox?: boolean;
  showEnvironment?: boolean;
  showGrid?: boolean;
  showLogoDecal?: boolean;
  showPatternOverlay?: boolean;
  textureNormalIntensity?: number;
  textureRepeat?: number;
  useDamping?: boolean;
  onAnnotationSave?: (payload: AnnotationSavePayload) => void;
  onAnnotationSelectionStyleChange?: (payload: AnnotationStylePayload) => void;
};
