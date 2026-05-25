import type { SceneLightingConfig } from "./Lighting.types";

export const DEFAULT_SCENE_LIGHTING_CONFIG: SceneLightingConfig = {
  directionalLightIntensity: 2,
  environmentIntensity: 1,
  exposure: 1
};

export const FILL_LIGHT_RATIO = 0.28;
export const KEY_LIGHT_POSITION = [4, 6, 5] as const;
export const FILL_LIGHT_POSITION = [-3.5, 2.5, -4] as const;
export const AMBIENT_LIGHT_BASE_INTENSITY = 0.45;
export const AMBIENT_LIGHT_ENVIRONMENT_RATIO = 0.35;
