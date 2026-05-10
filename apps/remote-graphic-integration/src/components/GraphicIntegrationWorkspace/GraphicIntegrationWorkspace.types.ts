export type GraphicIntegrationWorkspaceProps = {
  modelUrl: string;
};

export type ViewerControlConfig = {
  autoRotate: boolean;
  canZoom: boolean;
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

export type ViewerControlChangeHandler = (
  key: ViewerBooleanControlKey,
  value: boolean
) => void;

export type ViewerMaterialTintChangeHandler = (value: string) => void;
