import { useEffect, useMemo } from "react";
import { Box3, Box3Helper, Color, Object3D } from "three";

type BoundingBoxOverlayProps = {
  scene: Object3D;
};

export function BoundingBoxOverlay({ scene }: BoundingBoxOverlayProps) {
  const helper = useMemo(() => {
    scene.updateMatrixWorld(true);

    return new Box3Helper(
      new Box3().setFromObject(scene),
      new Color("#00a3ff")
    );
  }, [scene]);

  useEffect(() => {
    return () => {
      helper.geometry.dispose();

      if (Array.isArray(helper.material)) {
        helper.material.forEach((material) => material.dispose());
        return;
      }

      helper.material.dispose();
    };
  }, [helper]);

  return <primitive object={helper} />;
}
