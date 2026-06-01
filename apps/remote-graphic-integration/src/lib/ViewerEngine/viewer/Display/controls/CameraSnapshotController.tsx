import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Camera, Quaternion, Vector3 } from "three";

import type { AnnotationCameraSnapshot } from "../../Annotation";

type OrbitControlApi = {
  target: Vector3;
  update: () => void;
};

type CameraSnapshotControllerProps = {
  cameraSnapshot: AnnotationCameraSnapshot | null;
  restoreSignal: number;
};

export function CameraSnapshotController({
  cameraSnapshot,
  restoreSignal
}: CameraSnapshotControllerProps) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => getOrbitControlsApi(state.controls));
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    if (!cameraSnapshot || restoreSignal < 1) {
      return;
    }

    camera.position.set(...cameraSnapshot.position);
    camera.quaternion.copy(new Quaternion(...cameraSnapshot.quaternion));
    updateProjectionCamera(camera, cameraSnapshot);

    if (controls && cameraSnapshot.target) {
      controls.target.set(...cameraSnapshot.target);
      controls.update();
    }

    invalidate();
  }, [camera, cameraSnapshot, controls, invalidate, restoreSignal]);

  return null;
}

function getOrbitControlsApi(controls: unknown) {
  if (!controls || typeof controls !== "object") {
    return undefined;
  }

  const candidate = controls as Partial<OrbitControlApi>;

  if (
    candidate.target instanceof Vector3 &&
    typeof candidate.update === "function"
  ) {
    return candidate as OrbitControlApi;
  }

  return undefined;
}

function updateProjectionCamera(
  camera: Camera,
  cameraSnapshot: AnnotationCameraSnapshot
) {
  const projectionCamera = camera as Camera & {
    far?: number;
    fov?: number;
    near?: number;
    updateProjectionMatrix?: unknown;
    zoom?: number;
  };

  if (typeof cameraSnapshot.fov === "number") {
    projectionCamera.fov = cameraSnapshot.fov;
  }

  if (typeof cameraSnapshot.near === "number") {
    projectionCamera.near = cameraSnapshot.near;
  }

  if (typeof cameraSnapshot.far === "number") {
    projectionCamera.far = cameraSnapshot.far;
  }

  projectionCamera.zoom = cameraSnapshot.zoom;

  if (typeof projectionCamera.updateProjectionMatrix === "function") {
    projectionCamera.updateProjectionMatrix();
  }
}
