import { Environment } from "@react-three/drei";

import {
  AMBIENT_LIGHT_BASE_INTENSITY,
  AMBIENT_LIGHT_ENVIRONMENT_RATIO,
  FILL_LIGHT_POSITION,
  FILL_LIGHT_RATIO,
  KEY_LIGHT_POSITION
} from "./Lighting.constants";
import { SceneEnvironmentIntensity } from "./SceneEnvironmentIntensity";
import { ToneMappingExposure } from "./ToneMappingExposure";
import type { SceneLightingProps } from "./Lighting.types";

export function SceneLighting({
  directionalLightIntensity,
  environmentIntensity,
  exposure,
  showEnvironment
}: SceneLightingProps) {
  const ambientLightIntensity =
    AMBIENT_LIGHT_BASE_INTENSITY +
    (showEnvironment ? environmentIntensity * AMBIENT_LIGHT_ENVIRONMENT_RATIO : 0);

  return (
    <>
      <ToneMappingExposure exposure={exposure} />
      <ambientLight intensity={ambientLightIntensity} />
      <directionalLight
        intensity={directionalLightIntensity}
        position={KEY_LIGHT_POSITION}
      />
      <directionalLight
        color="#d8e7ff"
        intensity={directionalLightIntensity * FILL_LIGHT_RATIO}
        position={FILL_LIGHT_POSITION}
      />
      {showEnvironment ? (
        <>
          <Environment preset="city" />
          <SceneEnvironmentIntensity intensity={environmentIntensity} />
        </>
      ) : null}
    </>
  );
}
