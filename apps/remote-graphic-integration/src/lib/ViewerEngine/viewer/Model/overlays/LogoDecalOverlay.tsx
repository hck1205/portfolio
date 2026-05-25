import { useEffect, useMemo } from "react";
import { Object3D } from "three";

import { createLogoDecalTexture } from "./logoDecalTexture";
import { getDefaultLogoDecalPlacement } from "./logoPlacement";

type LogoDecalOverlayProps = {
  scene: Object3D;
};

export function LogoDecalOverlay({ scene }: LogoDecalOverlayProps) {
  const logoDecalTexture = useMemo(createLogoDecalTexture, []);
  const decalPlacement = useMemo(
    () => getDefaultLogoDecalPlacement(scene),
    [scene]
  );

  useEffect(() => {
    return () => {
      logoDecalTexture.dispose();
    };
  }, [logoDecalTexture]);

  if (!decalPlacement) {
    return null;
  }

  return (
    <group
      position={decalPlacement.position}
      quaternion={decalPlacement.quaternion}
    >
      <mesh raycast={() => null}>
        <planeGeometry args={decalPlacement.size} />
        <meshBasicMaterial
          depthTest={false}
          map={logoDecalTexture}
          transparent
        />
      </mesh>
    </group>
  );
}
