import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Scene } from "three";

type SceneWithEnvironmentIntensity = Scene & {
  environmentIntensity?: number;
};

type SceneEnvironmentIntensityProps = {
  intensity: number;
};

export function SceneEnvironmentIntensity({
  intensity
}: SceneEnvironmentIntensityProps) {
  const scene = useThree((state) => state.scene) as SceneWithEnvironmentIntensity;

  useEffect(() => {
    const previousIntensity = scene.environmentIntensity;

    scene.environmentIntensity = intensity;

    return () => {
      scene.environmentIntensity = previousIntensity;
    };
  }, [intensity, scene]);

  return null;
}
