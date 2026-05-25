import { Material, Mesh, Object3D } from "three";

export function isMesh(object: Object3D): object is Mesh {
  return object instanceof Mesh;
}

export function getMeshMaterials(mesh: Mesh): Material[] {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

export function traverseMeshes(
  root: Object3D,
  visitor: (mesh: Mesh) => void
) {
  root.traverse((object) => {
    if (isMesh(object)) {
      visitor(object);
    }
  });
}

export function disableRaycast(object: Object3D) {
  object.raycast = () => undefined;
}
