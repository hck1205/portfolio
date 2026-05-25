import { Color, Material, Texture, Vector2 } from "three";

export type TintableMaterial = Material & {
  color: Color;
};

export type RoughnessMaterial = Material & {
  roughness: number;
};

export type MetalnessMaterial = Material & {
  metalness: number;
};

export type OpacityMaterial = Material & {
  opacity: number;
  transparent: boolean;
};

export type NormalScaleMaterial = Material & {
  normalScale: Vector2;
};

export type MaterialTextureKey =
  | "alphaMap"
  | "aoMap"
  | "bumpMap"
  | "displacementMap"
  | "emissiveMap"
  | "envMap"
  | "lightMap"
  | "map"
  | "metalnessMap"
  | "normalMap"
  | "roughnessMap";

export type TexturedMaterial = Material &
  Partial<Record<MaterialTextureKey, Texture>>;

export const MATERIAL_TEXTURE_KEYS: MaterialTextureKey[] = [
  "alphaMap",
  "aoMap",
  "bumpMap",
  "displacementMap",
  "emissiveMap",
  "envMap",
  "lightMap",
  "map",
  "metalnessMap",
  "normalMap",
  "roughnessMap"
];

export function isTintableMaterial(
  material: Material
): material is TintableMaterial {
  return "color" in material && material.color instanceof Color;
}

export function isRoughnessMaterial(
  material: Material
): material is RoughnessMaterial {
  return "roughness" in material && typeof material.roughness === "number";
}

export function isMetalnessMaterial(
  material: Material
): material is MetalnessMaterial {
  return "metalness" in material && typeof material.metalness === "number";
}

export function isOpacityMaterial(
  material: Material
): material is OpacityMaterial {
  return (
    "opacity" in material &&
    typeof material.opacity === "number" &&
    "transparent" in material &&
    typeof material.transparent === "boolean"
  );
}

export function isNormalScaleMaterial(
  material: Material
): material is NormalScaleMaterial {
  return "normalScale" in material && material.normalScale instanceof Vector2;
}
