import { useGLTF } from "@react-three/drei";

import { BoundingBoxOverlay, usePartVisibilityMode } from "../Display";
import { useModelMaterialControls } from "./material";
import { LogoDecalOverlay, PatternOverlay } from "./overlays";
import type { ModelProps } from "./Model.types";

export function Model({
  materialMetalness,
  materialOpacity,
  materialRoughness,
  materialTint,
  modelUrl,
  partVisibilityMode,
  showBoundingBox,
  showLogoDecal,
  showPatternOverlay,
  textureNormalIntensity,
  textureRepeat
}: ModelProps) {
  const gltf = useGLTF(modelUrl);

  useModelMaterialControls(gltf.scene, {
    materialMetalness,
    materialOpacity,
    materialRoughness,
    materialTint,
    textureNormalIntensity,
    textureRepeat
  });
  usePartVisibilityMode(gltf.scene, partVisibilityMode);

  const shouldRenderSurfaceOverlays = partVisibilityMode !== "hidden";

  return (
    <>
      <primitive object={gltf.scene} />
      {showBoundingBox ? <BoundingBoxOverlay scene={gltf.scene} /> : null}
      {showPatternOverlay && shouldRenderSurfaceOverlays ? (
        <PatternOverlay scene={gltf.scene} textureRepeat={textureRepeat} />
      ) : null}
      {showLogoDecal && shouldRenderSurfaceOverlays ? (
        <LogoDecalOverlay scene={gltf.scene} />
      ) : null}
    </>
  );
}
