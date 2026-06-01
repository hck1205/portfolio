import {
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls } from "@react-three/drei";
import { MOUSE } from "three";

import {
  DEFAULT_SCENE_DISPLAY_CONFIG
} from "./Display/Display.constants";
import { CameraPresetController } from "./Display/controls/CameraPresetController";
import { CameraSnapshotController } from "./Display/controls/CameraSnapshotController";
import { GridFloor } from "./Display/overlays/GridFloor";
import { EmptyModel } from "./EmptyModel";
import { DEFAULT_SCENE_LIGHTING_CONFIG } from "./Lighting/Lighting.constants";
import { SceneLighting } from "./Lighting/SceneLighting";
import { Loader } from "./Loader";
import { Model } from "./Model";
import type { ViewerScreenshotHandle } from "./Screenshot";
import styles from "./Viewer.module.css";
import type { AnnotationSnapshotPayload } from "./Annotation";
import {
  captureCameraSnapshot,
  captureViewerScreenshot,
  type OrbitControlsSnapshot,
  type RendererSnapshotState
} from "./Viewer.snapshot";
import type { ViewerProps } from "./Viewer.types";

const LazyAnnotationCanvas = lazy(() =>
  import("./Annotation").then((module) => ({
    default: module.AnnotationCanvas
  }))
);

export const Viewer = forwardRef<ViewerScreenshotHandle, ViewerProps>(
  function Viewer(
    {
      annotationClearSignal = 0,
      annotationMode = false,
      annotationRestoreSignal = 0,
      annotationRestoreSnapshot = null,
      annotationSaveSignal = 0,
      annotationStrokeColor = "#e11d48",
      annotationStrokeWidth = 4,
      annotationTool = "pen",
      autoRotate = false,
      canZoom = true,
      cameraRestoreSnapshot = null,
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
      onAnnotationSave,
      onAnnotationSelectionStyleChange,
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
    const annotationCanvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const orbitControlsRef = useRef<OrbitControlsSnapshot | null>(null);
    const rendererStateRef = useRef<RendererSnapshotState | null>(null);
    const [hasLoadedAnnotationCanvas, setHasLoadedAnnotationCanvas] =
      useState(annotationMode);
    const rootClassName = className
      ? `${styles.viewer} ${className}`
      : styles.viewer;
    const handleAnnotationCanvasElementChange = useCallback(
      (canvasElement: HTMLCanvasElement | null) => {
        annotationCanvasElementRef.current = canvasElement;
      },
      []
    );
    const handleAnnotationSave = useCallback(
      (annotationSnapshot: AnnotationSnapshotPayload) => {
        const rendererState = rendererStateRef.current;
        const thumbnailDataUrl = rendererState
          ? captureViewerScreenshot(
              rendererState,
              annotationCanvasElementRef.current
            )
          : null;
        const camera = rendererState
          ? captureCameraSnapshot(rendererState.camera, orbitControlsRef.current)
          : null;

        onAnnotationSave?.({
          ...annotationSnapshot,
          camera,
          thumbnailDataUrl
        });
      },
      [onAnnotationSave]
    );

    useEffect(() => {
      if (annotationMode) {
        setHasLoadedAnnotationCanvas(true);
      }
    }, [annotationMode]);

    useImperativeHandle(
      ref,
      () => ({
        captureScreenshot() {
          const rendererState = rendererStateRef.current;

          if (!rendererState) {
            return null;
          }

          return captureViewerScreenshot(
            rendererState,
            annotationCanvasElementRef.current
          );
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
              <Bounds fit margin={1.2}>
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
            autoRotate={annotationMode ? false : autoRotate}
            dampingFactor={0.08}
            enablePan={!annotationMode}
            enableRotate={!annotationMode}
            enableZoom={!annotationMode && canZoom}
            enableDamping={!annotationMode && useDamping}
            mouseButtons={{
              LEFT: MOUSE.PAN,
              MIDDLE: MOUSE.DOLLY,
              RIGHT: MOUSE.ROTATE
            }}
            ref={(controls) => {
              orbitControlsRef.current = controls;
            }}
          />
          <CameraPresetController cameraPreset={cameraPreset} />
          <CameraSnapshotController
            cameraSnapshot={cameraRestoreSnapshot}
            restoreSignal={annotationRestoreSignal}
          />
        </Canvas>
        {hasLoadedAnnotationCanvas ? (
          <Suspense fallback={null}>
            <LazyAnnotationCanvas
              active={annotationMode}
              clearSignal={annotationClearSignal}
              onCanvasElementChange={handleAnnotationCanvasElementChange}
              onSave={handleAnnotationSave}
              onSelectionStyleChange={onAnnotationSelectionStyleChange}
              restoreSignal={annotationRestoreSignal}
              restoreSnapshot={annotationRestoreSnapshot}
              saveSignal={annotationSaveSignal}
              strokeColor={annotationStrokeColor}
              strokeWidth={annotationStrokeWidth}
              tool={annotationTool}
            />
          </Suspense>
        ) : null}
      </section>
    );
  }
);
