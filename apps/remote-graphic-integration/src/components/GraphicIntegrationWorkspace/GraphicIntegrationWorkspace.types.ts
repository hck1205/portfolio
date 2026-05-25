import type {
  CameraPresetId,
  PartVisibilityMode
} from "../../lib/ViewerEngine/viewer/Display/Display.types";

export type GraphicIntegrationWorkspaceProps = {
  modelUrl: string;
};

export type MaterialPresetId = "leather" | "suede" | "nylon" | "rubber";

export type ViewerControlConfig = {
  autoRotate: boolean;
  canZoom: boolean;
  cameraPreset: CameraPresetId;
  directionalLightIntensity: number;
  environmentIntensity: number;
  exposure: number;
  materialMetalness: number;
  materialOpacity: number;
  materialPreset: MaterialPresetId;
  materialRoughness: number;
  materialTint: string;
  partVisibilityMode: PartVisibilityMode;
  showBoundingBox: boolean;
  showEnvironment: boolean;
  showGrid: boolean;
  showLogoDecal: boolean;
  showPatternOverlay: boolean;
  textureNormalIntensity: number;
  textureRepeat: number;
  useDamping: boolean;
};

export type ViewerControlKey = keyof ViewerControlConfig;

export type ViewerBooleanControlKey = {
  [Key in ViewerControlKey]: ViewerControlConfig[Key] extends boolean
    ? Key
    : never;
}[ViewerControlKey];

export type ViewerNumberControlKey = {
  [Key in ViewerControlKey]: ViewerControlConfig[Key] extends number
    ? Key
    : never;
}[ViewerControlKey];

export type ViewerOptionControlKey = "cameraPreset" | "partVisibilityMode";

export type ViewerControlChangeHandler = (
  key: ViewerBooleanControlKey,
  value: boolean
) => void;

export type ViewerNumberControlChangeHandler = (
  key: ViewerNumberControlKey,
  value: number
) => void;

export type ViewerOptionControlChangeHandler = <
  Key extends ViewerOptionControlKey
>(
  key: Key,
  value: ViewerControlConfig[Key]
) => void;

export type ViewerMaterialTintChangeHandler = (value: string) => void;

export type ViewerMaterialPresetChangeHandler = (
  value: MaterialPresetId
) => void;
