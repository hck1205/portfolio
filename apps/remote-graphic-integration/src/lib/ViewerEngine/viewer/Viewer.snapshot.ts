import type { RootState } from "@react-three/fiber";
import type { Camera } from "three";

import type { AnnotationCameraSnapshot } from "./Annotation";
import { isPngDataUrl } from "./Screenshot";

export type RendererSnapshotState = Pick<RootState, "camera" | "gl" | "scene">;

export type OrbitControlsSnapshot = {
  target?: {
    x: number;
    y: number;
    z: number;
  };
};

export function captureViewerScreenshot(
  rendererState: RendererSnapshotState,
  annotationCanvasElement: HTMLCanvasElement | null
) {
  rendererState.gl.render(rendererState.scene, rendererState.camera);

  const rendererCanvas = rendererState.gl.domElement;

  if (!annotationCanvasElement) {
    const dataUrl = rendererCanvas.toDataURL("image/png");

    return isPngDataUrl(dataUrl) ? dataUrl : null;
  }

  const screenshotCanvas = document.createElement("canvas");
  const width = rendererCanvas.width;
  const height = rendererCanvas.height;

  if (width < 1 || height < 1) {
    return null;
  }

  screenshotCanvas.width = width;
  screenshotCanvas.height = height;

  const context = screenshotCanvas.getContext("2d");

  if (!context) {
    const dataUrl = rendererCanvas.toDataURL("image/png");

    return isPngDataUrl(dataUrl) ? dataUrl : null;
  }

  context.drawImage(rendererCanvas, 0, 0, width, height);
  context.drawImage(annotationCanvasElement, 0, 0, width, height);

  const dataUrl = screenshotCanvas.toDataURL("image/png");

  return isPngDataUrl(dataUrl) ? dataUrl : null;
}

export function captureCameraSnapshot(
  camera: Camera,
  controls: OrbitControlsSnapshot | null
): AnnotationCameraSnapshot {
  const projectionCamera = camera as Camera & {
    far?: number;
    fov?: number;
    near?: number;
    zoom?: number;
  };

  return {
    far: projectionCamera.far,
    fov: projectionCamera.fov,
    near: projectionCamera.near,
    position: [
      normalizeSnapshotNumber(camera.position.x),
      normalizeSnapshotNumber(camera.position.y),
      normalizeSnapshotNumber(camera.position.z)
    ],
    quaternion: [
      normalizeSnapshotNumber(camera.quaternion.x),
      normalizeSnapshotNumber(camera.quaternion.y),
      normalizeSnapshotNumber(camera.quaternion.z),
      normalizeSnapshotNumber(camera.quaternion.w)
    ],
    rotation: [
      normalizeSnapshotNumber(camera.rotation.x),
      normalizeSnapshotNumber(camera.rotation.y),
      normalizeSnapshotNumber(camera.rotation.z)
    ],
    target: controls?.target
      ? [
          normalizeSnapshotNumber(controls.target.x),
          normalizeSnapshotNumber(controls.target.y),
          normalizeSnapshotNumber(controls.target.z)
        ]
      : undefined,
    zoom: projectionCamera.zoom ?? 1
  };
}

function normalizeSnapshotNumber(value: number) {
  return Number.isFinite(value) ? Math.round(value * 1000) / 1000 : 0;
}
