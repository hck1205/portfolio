export type SceneLightingConfig = {
  directionalLightIntensity: number;
  environmentIntensity: number;
  exposure: number;
};

export type SceneLightingProps = SceneLightingConfig & {
  showEnvironment: boolean;
};
