import { useGLTF } from "@react-three/drei";

import type { ModelProps } from "./Model.types";

export function Model({ modelUrl }: ModelProps) {
  const gltf = useGLTF(modelUrl);

  return <primitive object={gltf.scene} />;
}
