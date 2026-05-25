import { Color, Material, RepeatWrapping, Texture } from "three";

import {
  MATERIAL_TEXTURE_KEYS,
  isMetalnessMaterial,
  isNormalScaleMaterial,
  isOpacityMaterial,
  isRoughnessMaterial,
  isTintableMaterial
} from "./materialGuards";
import type {
  TexturedMaterial,
  TintableMaterial
} from "./materialGuards";
import type { ModelMaterialControls } from "./materialControls.types";

const baseMaterialColors = new WeakMap<TintableMaterial, Color>();

type MaterialAppearanceControls = Omit<
  ModelMaterialControls,
  "materialTint" | "textureRepeat"
>;

export function applyMaterialAppearance(
  material: Material,
  controls: MaterialAppearanceControls,
  tintColor: Color
) {
  if (isTintableMaterial(material)) {
    if (!baseMaterialColors.has(material)) {
      baseMaterialColors.set(material, material.color.clone());
    }

    const baseColor = baseMaterialColors.get(material);

    if (baseColor) {
      material.color.copy(baseColor).multiply(tintColor);
    }
  }

  if (isRoughnessMaterial(material)) {
    material.roughness = controls.materialRoughness;
  }

  if (isMetalnessMaterial(material)) {
    material.metalness = controls.materialMetalness;
  }

  if (isOpacityMaterial(material)) {
    material.opacity = controls.materialOpacity;
    material.transparent = controls.materialOpacity < 1;
  }

  if (isNormalScaleMaterial(material)) {
    material.normalScale.setScalar(controls.textureNormalIntensity);
  }

  material.needsUpdate = true;
}

export function applyTextureRepeat(
  material: Material,
  textureRepeat: number
) {
  const texturedMaterial = material as TexturedMaterial;

  MATERIAL_TEXTURE_KEYS.forEach((key) => {
    const texture = texturedMaterial[key];

    if (!(texture instanceof Texture)) {
      return;
    }

    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.setScalar(textureRepeat);
    texture.needsUpdate = true;
  });
}
