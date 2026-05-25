export type GraphicIntegrationWorkspaceProps = {
  modelUrl: string;
};

export type MaterialPresetId = "leather" | "suede" | "nylon" | "rubber";

export type ViewerControlConfig = {
  autoRotate: boolean;
  canZoom: boolean;
  materialMetalness: number;
  materialOpacity: number;
  materialPreset: MaterialPresetId;
  materialRoughness: number;
  materialTint: string;
  showEnvironment: boolean;
  showGrid: boolean;
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

export type ViewerControlChangeHandler = (
  key: ViewerBooleanControlKey,
  value: boolean
) => void;

export type ViewerNumberControlChangeHandler = (
  key: ViewerNumberControlKey,
  value: number
) => void;

export type ViewerMaterialTintChangeHandler = (value: string) => void;

export type ViewerMaterialPresetChangeHandler = (
  value: MaterialPresetId
) => void;
