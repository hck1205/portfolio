import { forwardRef, Suspense, useImperativeHandle, useRef } from "react";
import { Canvas, type RootState } from "@react-three/fiber";
import { Bounds, OrbitControls } from "@react-three/drei";
import { MOUSE } from "three";

import {
  DEFAULT_SCENE_DISPLAY_CONFIG
} from "./Display/Display.constants";
import { CameraPresetController } from "./Display/controls/CameraPresetController";
import { GridFloor } from "./Display/overlays/GridFloor";
import { EmptyModel } from "./EmptyModel";
import { DEFAULT_SCENE_LIGHTING_CONFIG } from "./Lighting/Lighting.constants";
import { SceneLighting } from "./Lighting/SceneLighting";
import { Loader } from "./Loader";
import { Model } from "./Model";
import { isPngDataUrl, type ViewerScreenshotHandle } from "./Screenshot";
import styles from "./Viewer.module.css";
import type { ViewerProps } from "./Viewer.types";

type RendererSnapshotState = Pick<RootState, "camera" | "gl" | "scene">;

export const Viewer = forwardRef<ViewerScreenshotHandle, ViewerProps>(
  function Viewer(
    {
      autoRotate = false,
      canZoom = true,
      cameraPreset = DEFAULT_SCENE_DISPLAY_CONFIG.cameraPreset,
      className,
      directionalLightIntensity = DEFAULT_SCENE_LIGHTING_CONFIG.directionalLightIntensity,
      environmentIntensity = DEFAULT_SCENE_LIGHTING_CONFIG.environmentIntensity,
      exposure = DEFAULT_SCENE_LIGHTING_CONFIG.exposure,
      materialMetalness = 0.15,
      materialOpacity = 1,
      materialRoughness = 0.55,
      materialTint = "#ffffff",
      modelUrl,
      partVisibilityMode = DEFAULT_SCENE_DISPLAY_CONFIG.partVisibilityMode,
      showBoundingBox = DEFAULT_SCENE_DISPLAY_CONFIG.showBoundingBox,
      showEnvironment = true,
      showGrid = true,
      showLogoDecal = false,
      showPatternOverlay = false,
      textureNormalIntensity = 1,
      textureRepeat = 1,
      useDamping = true
    },
    ref
  ) {
    const rendererStateRef = useRef<RendererSnapshotState | null>(null);
    const rootClassName = className
      ? `${styles.viewer} ${className}`
      : styles.viewer;

    useImperativeHandle(
      ref,
      () => ({
        captureScreenshot() {
          const rendererState = rendererStateRef.current;

          if (!rendererState) {
            return null;
          }

          rendererState.gl.render(rendererState.scene, rendererState.camera);

          const dataUrl = rendererState.gl.domElement.toDataURL("image/png");

          return isPngDataUrl(dataUrl) ? dataUrl : null;
        }
      }),
      []
    );

    return (
      <section className={rootClassName}>
        <Canvas
          className={styles.canvas}
          camera={{ fov: 45, position: [3, 2, 4] }}
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
          onCreated={(rendererState) => {
            rendererStateRef.current = {
              camera: rendererState.camera,
              gl: rendererState.gl,
              scene: rendererState.scene
            };
          }}
        >
          <color args={["#f4f5f6"]} attach="background" />
          <SceneLighting
            directionalLightIntensity={directionalLightIntensity}
            environmentIntensity={environmentIntensity}
            exposure={exposure}
            showEnvironment={showEnvironment}
          />
          <Suspense fallback={<Loader />}>
            {modelUrl ? (
              <Bounds fit clip margin={1.2}>
                <Model
                  materialMetalness={materialMetalness}
                  materialOpacity={materialOpacity}
                  materialRoughness={materialRoughness}
                  materialTint={materialTint}
                  modelUrl={modelUrl}
                  partVisibilityMode={partVisibilityMode}
                  showBoundingBox={showBoundingBox}
                  showLogoDecal={showLogoDecal}
                  showPatternOverlay={showPatternOverlay}
                  textureNormalIntensity={textureNormalIntensity}
                  textureRepeat={textureRepeat}
                />
              </Bounds>
            ) : (
              <EmptyModel />
            )}
            {showGrid ? <GridFloor /> : null}
          </Suspense>
          <OrbitControls
            makeDefault
            autoRotate={autoRotate}
            dampingFactor={0.08}
            enableZoom={canZoom}
            enableDamping={useDamping}
            mouseButtons={{
              LEFT: MOUSE.PAN,
              MIDDLE: MOUSE.DOLLY,
              RIGHT: MOUSE.ROTATE
            }}
          />
          <CameraPresetController cameraPreset={cameraPreset} />
        </Canvas>
      </section>
    );
  }
);
