import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Camera, Vector3 } from "three";

import type { CameraPresetId } from "../Display.types";

type OrbitControlApi = {
  target: Vector3;
  update: () => void;
};

type CameraPose = {
  position: [number, number, number];
  target: [number, number, number];
};

const CAMERA_PRESETS: Record<CameraPresetId, CameraPose> = {
  studio: {
    position: [3, 2, 4],
    target: [0, 0, 0]
  },
  front: {
    position: [0, 0.2, 4.8],
    target: [0, 0, 0]
  },
  side: {
    position: [4.8, 0.2, 0],
    target: [0, 0, 0]
  },
  back: {
    position: [0, 0.2, -4.8],
    target: [0, 0, 0]
  },
  detail: {
    position: [1.25, 0.55, 1.55],
    target: [0, 0.05, 0]
  }
};

type CameraPresetControllerProps = {
  cameraPreset: CameraPresetId;
};

export function CameraPresetController({
  cameraPreset
}: CameraPresetControllerProps) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => getOrbitControlsApi(state.controls));
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const preset = CAMERA_PRESETS[cameraPreset];
    const target = new Vector3(...preset.target);

    camera.position.set(...preset.position);
    camera.lookAt(target);
    updateCameraProjection(camera);

    if (controls) {
      controls.target.copy(target);
      controls.update();
    }

    invalidate();
  }, [camera, cameraPreset, controls, invalidate]);

  return null;
}

function getOrbitControlsApi(controls: unknown) {
  if (!controls || typeof controls !== "object") {
    return undefined;
  }

  const candidate = controls as Partial<OrbitControlApi>;

  if (candidate.target instanceof Vector3 && typeof candidate.update === "function") {
    return candidate as OrbitControlApi;
  }

  return undefined;
}

function updateCameraProjection(camera: Camera) {
  const projectionCamera = camera as Camera & {
    updateProjectionMatrix?: unknown;
  };

  if (typeof projectionCamera.updateProjectionMatrix === "function") {
    projectionCamera.updateProjectionMatrix();
  }
}
