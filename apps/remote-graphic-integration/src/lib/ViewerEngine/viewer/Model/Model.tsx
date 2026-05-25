import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Color, Material, Mesh, Object3D } from "three";

import type { ModelProps } from "./Model.types";

type TintableMaterial = Material & {
  color: Color;
};

type RoughnessMaterial = Material & {
  roughness: number;
};

type MetalnessMaterial = Material & {
  metalness: number;
};

type OpacityMaterial = Material & {
  opacity: number;
  transparent: boolean;
};

const baseMaterialColors = new WeakMap<TintableMaterial, Color>();

export function Model({
  materialMetalness,
  materialOpacity,
  materialRoughness,
  materialTint,
  modelUrl
}: ModelProps) {
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
          if (isRoughnessMaterial(material)) {
            material.roughness = materialRoughness;
          }

          if (isMetalnessMaterial(material)) {
            material.metalness = materialMetalness;
          }

          if (isOpacityMaterial(material)) {
            applyMaterialOpacity(material, materialOpacity);
          }

          material.needsUpdate = true;
          return;
        }

        if (!baseMaterialColors.has(material)) {
          baseMaterialColors.set(material, material.color.clone());
        }

        const baseColor = baseMaterialColors.get(material);

        if (baseColor) {
          material.color.copy(baseColor).multiply(tintColor);
        }

        if (isRoughnessMaterial(material)) {
          material.roughness = materialRoughness;
        }

        if (isMetalnessMaterial(material)) {
          material.metalness = materialMetalness;
        }

        if (isOpacityMaterial(material)) {
          applyMaterialOpacity(material, materialOpacity);
        }

        material.needsUpdate = true;
      });
    });
  }, [
    gltf.scene,
    materialMetalness,
    materialOpacity,
    materialRoughness,
    materialTint
  ]);

  return <primitive object={gltf.scene} />;
}

function isMesh(object: Object3D): object is Mesh {
  return object instanceof Mesh;
}

function isTintableMaterial(material: Material): material is TintableMaterial {
  return "color" in material && material.color instanceof Color;
}

function isRoughnessMaterial(material: Material): material is RoughnessMaterial {
  return "roughness" in material && typeof material.roughness === "number";
}

function isMetalnessMaterial(material: Material): material is MetalnessMaterial {
  return "metalness" in material && typeof material.metalness === "number";
}

function isOpacityMaterial(material: Material): material is OpacityMaterial {
  return (
    "opacity" in material &&
    typeof material.opacity === "number" &&
    "transparent" in material &&
    typeof material.transparent === "boolean"
  );
}

function applyMaterialOpacity(
  material: OpacityMaterial,
  materialOpacity: number
) {
  material.opacity = materialOpacity;
  material.transparent = materialOpacity < 1;
}
