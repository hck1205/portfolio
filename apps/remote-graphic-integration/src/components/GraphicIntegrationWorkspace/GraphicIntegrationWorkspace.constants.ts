import type {
  MaterialPresetId,
  ViewerControlConfig
} from "./GraphicIntegrationWorkspace.types";
import { DEFAULT_SCENE_DISPLAY_CONFIG } from "../../lib/ViewerEngine/viewer/Display";
import { DEFAULT_SCENE_LIGHTING_CONFIG } from "../../lib/ViewerEngine/viewer/Lighting";

export const MATERIAL_PRESETS: Record<
  MaterialPresetId,
  Pick<
    ViewerControlConfig,
    "materialMetalness" | "materialOpacity" | "materialRoughness"
  >
> = {
  leather: {
    materialMetalness: 0.15,
    materialOpacity: 1,
    materialRoughness: 0.55
  },
  suede: {
    materialMetalness: 0.02,
    materialOpacity: 1,
    materialRoughness: 0.85
  },
  nylon: {
    materialMetalness: 0.05,
    materialOpacity: 0.92,
    materialRoughness: 0.35
  },
  rubber: {
    materialMetalness: 0.1,
    materialOpacity: 1,
    materialRoughness: 0.72
  }
};

export const DEFAULT_VIEWER_CONTROL_CONFIG: ViewerControlConfig = {
  autoRotate: false,
  canZoom: true,
  cameraPreset: DEFAULT_SCENE_DISPLAY_CONFIG.cameraPreset,
  directionalLightIntensity:
    DEFAULT_SCENE_LIGHTING_CONFIG.directionalLightIntensity,
  environmentIntensity: DEFAULT_SCENE_LIGHTING_CONFIG.environmentIntensity,
  exposure: DEFAULT_SCENE_LIGHTING_CONFIG.exposure,
  materialMetalness: MATERIAL_PRESETS.leather.materialMetalness,
  materialOpacity: MATERIAL_PRESETS.leather.materialOpacity,
  materialPreset: "leather",
  materialRoughness: MATERIAL_PRESETS.leather.materialRoughness,
  materialTint: "#ffffff",
  partVisibilityMode: DEFAULT_SCENE_DISPLAY_CONFIG.partVisibilityMode,
  showBoundingBox: DEFAULT_SCENE_DISPLAY_CONFIG.showBoundingBox,
  showEnvironment: true,
  showGrid: true,
  showLogoDecal: false,
  showPatternOverlay: false,
  textureNormalIntensity: 1,
  textureRepeat: 1,
  useDamping: true
};
