import type {
  CameraPresetId,
  PartVisibilityMode,
  SceneDisplayConfig
} from "./Display.types";

export const DEFAULT_SCENE_DISPLAY_CONFIG: SceneDisplayConfig = {
  cameraPreset: "studio",
  partVisibilityMode: "all",
  showBoundingBox: false
};

export const cameraPresetOptions = [
  {
    label: "Studio",
    value: "studio"
  },
  {
    label: "Front",
    value: "front"
  },
  {
    label: "Side",
    value: "side"
  },
  {
    label: "Back",
    value: "back"
  },
  {
    label: "Detail",
    value: "detail"
  }
] as const satisfies Array<{ label: string; value: CameraPresetId }>;

export const partVisibilityModeOptions = [
  {
    label: "All parts",
    value: "all"
  },
  {
    label: "Wireframe",
    value: "wireframe"
  },
  {
    label: "Hidden",
    value: "hidden"
  }
] as const satisfies Array<{ label: string; value: PartVisibilityMode }>;

export function isCameraPresetId(value: string): value is CameraPresetId {
  return cameraPresetOptions.some((option) => option.value === value);
}

export function isPartVisibilityMode(
  value: string
): value is PartVisibilityMode {
  return partVisibilityModeOptions.some((option) => option.value === value);
}
