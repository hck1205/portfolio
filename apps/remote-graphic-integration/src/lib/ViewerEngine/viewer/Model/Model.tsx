import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Color, Material, Mesh, Object3D } from "three";

import type { ModelProps } from "./Model.types";

type TintableMaterial = Material & {
  color: Color;
};

const baseMaterialColors = new WeakMap<TintableMaterial, Color>();

export function Model({ materialTint, modelUrl }: ModelProps) {
  const gltf = useGLTF(modelUrl);

  useEffect(() => {
    const tintColor = new Color(materialTint);

    gltf.scene.traverse((object) => {
      if (!isMesh(object)) {
        return;
      }

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (!isTintableMaterial(material)) {
          return;
        }

        if (!baseMaterialColors.has(material)) {
          baseMaterialColors.set(material, material.color.clone());
        }

        const baseColor = baseMaterialColors.get(material);

        if (baseColor) {
          material.color.copy(baseColor).multiply(tintColor);
          material.needsUpdate = true;
        }
      });
    });
  }, [gltf.scene, materialTint]);

  return <primitive object={gltf.scene} />;
}

function isMesh(object: Object3D): object is Mesh {
  return object instanceof Mesh;
}

function isTintableMaterial(material: Material): material is TintableMaterial {
  return "color" in material && material.color instanceof Color;
}
