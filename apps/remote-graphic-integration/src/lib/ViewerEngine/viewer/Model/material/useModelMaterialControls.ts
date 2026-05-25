import { useEffect } from "react";
import { Color, Object3D } from "three";

import { getMeshMaterials, traverseMeshes } from "../utils";
import {
  applyMaterialAppearance,
  applyTextureRepeat
} from "./applyMaterialControls";
import type { ModelMaterialControls } from "./materialControls.types";

export function useModelMaterialControls(
  scene: Object3D,
  controls: ModelMaterialControls
) {
  const {
    materialMetalness,
    materialOpacity,
    materialRoughness,
    materialTint,
    textureNormalIntensity,
    textureRepeat
  } = controls;

  useEffect(() => {
    const tintColor = new Color(materialTint);

    traverseMeshes(scene, (mesh) => {
      getMeshMaterials(mesh).forEach((material) => {
        applyMaterialAppearance(
          material,
          {
            materialMetalness,
            materialOpacity,
            materialRoughness,
            textureNormalIntensity
          },
          tintColor
        );
      });
    });
  }, [
    materialMetalness,
    materialOpacity,
    materialRoughness,
    materialTint,
    scene,
    textureNormalIntensity
  ]);

  useEffect(() => {
    traverseMeshes(scene, (mesh) => {
      getMeshMaterials(mesh).forEach((material) => {
        applyTextureRepeat(material, textureRepeat);
      });
    });
  }, [scene, textureRepeat]);
}
