import type {
  CameraPresetId,
  PartVisibilityMode
} from "./Display/Display.types";

export type ViewerProps = {
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
};
