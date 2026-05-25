import { useEffect, useMemo } from "react";
import { Object3D } from "three";

import { createPatternOverlayScene } from "./patternOverlayScene";

type PatternOverlayProps = {
  scene: Object3D;
  textureRepeat: number;
};

export function PatternOverlay({ scene, textureRepeat }: PatternOverlayProps) {
  const patternOverlay = useMemo(
    () => createPatternOverlayScene(scene),
    [scene]
  );

  useEffect(() => {
    patternOverlay.material.uniforms.patternRepeat.value =
      Math.max(textureRepeat, 0.5) * 3.5;
  }, [patternOverlay, textureRepeat]);

  useEffect(() => {
    return () => {
      patternOverlay.material.dispose();
    };
  }, [patternOverlay]);

  return <primitive object={patternOverlay.scene} />;
}
