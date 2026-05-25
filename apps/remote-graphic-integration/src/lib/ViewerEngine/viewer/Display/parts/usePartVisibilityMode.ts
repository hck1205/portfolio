import { useEffect } from "react";
import { Material, Object3D } from "three";

import { getMeshMaterials, traverseMeshes } from "../../Model/utils";
import type { PartVisibilityMode } from "../Display.types";

type WireframeMaterial = Material & {
  wireframe: boolean;
};

function isWireframeMaterial(material: Material): material is WireframeMaterial {
  return (
    "wireframe" in material && typeof material.wireframe === "boolean"
  );
}

export function usePartVisibilityMode(
  scene: Object3D,
  partVisibilityMode: PartVisibilityMode
) {
  useEffect(() => {
    traverseMeshes(scene, (mesh) => {
      mesh.visible = partVisibilityMode !== "hidden";

      getMeshMaterials(mesh).forEach((material) => {
        if (isWireframeMaterial(material)) {
          material.wireframe = partVisibilityMode === "wireframe";
          material.needsUpdate = true;
        }
      });
    });

    return () => {
      traverseMeshes(scene, (mesh) => {
        mesh.visible = true;

        getMeshMaterials(mesh).forEach((material) => {
          if (isWireframeMaterial(material)) {
            material.wireframe = false;
            material.needsUpdate = true;
          }
        });
      });
    };
  }, [partVisibilityMode, scene]);
}
