import type {
  MaterialPresetId,
  ViewerControlConfig
} from "./GraphicIntegrationWorkspace.types";

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
  materialMetalness: MATERIAL_PRESETS.leather.materialMetalness,
  materialOpacity: MATERIAL_PRESETS.leather.materialOpacity,
  materialPreset: "leather",
  materialRoughness: MATERIAL_PRESETS.leather.materialRoughness,
  materialTint: "#ffffff",
  showEnvironment: true,
  showGrid: true,
  useDamping: true
};
