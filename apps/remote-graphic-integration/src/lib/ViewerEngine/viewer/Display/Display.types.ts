export type CameraPresetId = "studio" | "front" | "side" | "back" | "detail";

export type PartVisibilityMode = "all" | "wireframe" | "hidden";

export type SceneDisplayConfig = {
  cameraPreset: CameraPresetId;
  partVisibilityMode: PartVisibilityMode;
  showBoundingBox: boolean;
};
