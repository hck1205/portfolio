import { Box3, Matrix3, Object3D, Quaternion, Vector3 } from "three";

import { isMesh } from "../utils";

const LOGO_PLANE_NORMAL = new Vector3(0, 0, 1);
const LOGO_SURFACE_OFFSET = 0.0008;

type LogoSurfacePlacement = {
  normal: Vector3;
  position: Vector3;
};

export function getDefaultLogoDecalPlacement(scene: Object3D) {
  const boundingBox = new Box3().setFromObject(scene);

  if (boundingBox.isEmpty()) {
    return null;
  }

  const center = boundingBox.getCenter(new Vector3());
  const size = boundingBox.getSize(new Vector3());
  const logoSize = Math.max(size.x, size.y, size.z) * 0.058;
  const targetX = center.x + size.x * 0.28;
  const targetY = center.y + size.y * 0.5;
  const surface = findLogoSurfacePlacement(scene, targetX, targetY, size) ?? {
    normal: LOGO_PLANE_NORMAL.clone(),
    position: new Vector3(targetX, targetY, boundingBox.max.z)
  };
  const position = surface.position
    .clone()
    .addScaledVector(surface.normal, LOGO_SURFACE_OFFSET);

  return {
    position: [position.x, position.y, position.z] as [number, number, number],
    quaternion: new Quaternion().setFromUnitVectors(
      LOGO_PLANE_NORMAL,
      surface.normal
    ),
    size: [logoSize, logoSize] as [number, number]
  };
}

function findLogoSurfacePlacement(
  scene: Object3D,
  targetX: number,
  targetY: number,
  modelSize: Vector3
) {
  const searchRadiusX = modelSize.x * 0.12;
  const searchRadiusY = modelSize.y * 0.08;
  let closestDistance = Number.POSITIVE_INFINITY;
  let closestPlacement: LogoSurfacePlacement | null = null;
  let frontPlacement: LogoSurfacePlacement | null = null;

  scene.updateMatrixWorld(true);
  scene.traverse((object) => {
    if (!isMesh(object)) {
      return;
    }

    const positionAttribute = object.geometry.attributes.position;
    const normalAttribute = object.geometry.attributes.normal;

    if (!positionAttribute || !normalAttribute) {
      return;
    }

    const normalMatrix = new Matrix3().getNormalMatrix(object.matrixWorld);
    const vertex = new Vector3();
    const vertexNormal = new Vector3();

    for (let index = 0; index < positionAttribute.count; index += 1) {
      vertex.fromBufferAttribute(positionAttribute, index);
      vertexNormal
        .fromBufferAttribute(normalAttribute, index)
        .applyNormalMatrix(normalMatrix)
        .normalize();

      object.localToWorld(vertex);

      const distanceX = Math.abs(vertex.x - targetX);
      const distanceY = Math.abs(vertex.y - targetY);
      const distance = distanceX * distanceX + distanceY * distanceY;

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlacement = {
          normal: vertexNormal.clone(),
          position: vertex.clone()
        };
      }

      if (distanceX <= searchRadiusX && distanceY <= searchRadiusY) {
        if (!frontPlacement || vertex.z > frontPlacement.position.z) {
          frontPlacement = {
            normal: vertexNormal.clone(),
            position: vertex.clone()
          };
        }
      }
    }
  });

  return frontPlacement ?? closestPlacement;
}
