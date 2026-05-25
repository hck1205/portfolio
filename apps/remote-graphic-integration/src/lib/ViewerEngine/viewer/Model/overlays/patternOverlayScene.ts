import { Object3D, ShaderMaterial } from "three";

import { disableRaycast, traverseMeshes } from "../utils";

const PATTERN_VERTEX_SHADER = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const PATTERN_FRAGMENT_SHADER = `
  uniform float patternRepeat;

  varying vec3 vWorldPosition;

  float patternLine(float value, float width) {
    float wrapped = fract(value);
    float distanceToLine = min(wrapped, 1.0 - wrapped);

    return 1.0 - smoothstep(width, width + 0.018, distanceToLine);
  }

  void main() {
    vec3 scaledPosition = vWorldPosition * patternRepeat;
    float primaryLine = patternLine(
      scaledPosition.x + scaledPosition.y * 0.38,
      0.025
    );
    float accentLine = patternLine(
      scaledPosition.x * 0.42 - scaledPosition.z,
      0.018
    ) * 0.68;
    float alpha = max(primaryLine, accentLine) * 0.34;

    if (alpha < 0.015) {
      discard;
    }

    vec3 primaryColor = vec3(0.05, 0.07, 0.10);
    vec3 accentColor = vec3(0.02, 0.48, 0.44);
    vec3 color = mix(primaryColor, accentColor, accentLine);

    gl_FragColor = vec4(color, alpha);
  }
`;

export function createPatternOverlayScene(scene: Object3D) {
  const overlayScene = scene.clone(true);
  const material = new ShaderMaterial({
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    transparent: true,
    uniforms: {
      patternRepeat: { value: 3.5 }
    },
    vertexShader: PATTERN_VERTEX_SHADER,
    fragmentShader: PATTERN_FRAGMENT_SHADER
  });

  traverseMeshes(overlayScene, (mesh) => {
    disableRaycast(mesh);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.material = material;
    mesh.renderOrder = 2;
  });

  return {
    material,
    scene: overlayScene
  };
}
