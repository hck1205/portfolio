import { lazy, Suspense } from "react";
import { useGLTF } from "@react-three/drei";

import { usePartVisibilityMode } from "../Display/parts/usePartVisibilityMode";
import { useModelMaterialControls } from "./material";
import type { ModelProps } from "./Model.types";

const LazyBoundingBoxOverlay = lazy(() =>
  import("../Display/overlays/BoundingBoxOverlay").then((module) => ({
    default: module.BoundingBoxOverlay
  }))
);

const LazyLogoDecalOverlay = lazy(() =>
  import("./overlays/LogoDecalOverlay").then((module) => ({
    default: module.LogoDecalOverlay
  }))
);

const LazyPatternOverlay = lazy(() =>
  import("./overlays/PatternOverlay").then((module) => ({
    default: module.PatternOverlay
  }))
);

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
      <Suspense fallback={null}>
        {showBoundingBox ? (
          <LazyBoundingBoxOverlay scene={gltf.scene} />
        ) : null}
        {showPatternOverlay && shouldRenderSurfaceOverlays ? (
          <LazyPatternOverlay
            scene={gltf.scene}
            textureRepeat={textureRepeat}
          />
        ) : null}
        {showLogoDecal && shouldRenderSurfaceOverlays ? (
          <LazyLogoDecalOverlay scene={gltf.scene} />
        ) : null}
      </Suspense>
    </>
  );
}
