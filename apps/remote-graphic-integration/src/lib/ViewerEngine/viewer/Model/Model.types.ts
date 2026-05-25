import type { PartVisibilityMode } from "../Display/Display.types";

export type ModelProps = {
  materialMetalness: number;
  materialOpacity: number;
  materialRoughness: number;
  materialTint: string;
  modelUrl: string;
  partVisibilityMode: PartVisibilityMode;
  showBoundingBox: boolean;
  showLogoDecal: boolean;
  showPatternOverlay: boolean;
  textureNormalIntensity: number;
  textureRepeat: number;
};
