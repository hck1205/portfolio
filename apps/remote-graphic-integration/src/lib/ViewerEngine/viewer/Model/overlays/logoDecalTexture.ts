import { CanvasTexture } from "three";

const LOGO_TEXTURE_SIZE = 256;

export function createLogoDecalTexture() {
  const canvas = document.createElement("canvas");
  const center = LOGO_TEXTURE_SIZE / 2;
  const radius = 92;
  const context = canvas.getContext("2d");

  canvas.width = LOGO_TEXTURE_SIZE;
  canvas.height = LOGO_TEXTURE_SIZE;

  if (!context) {
    return new CanvasTexture(canvas);
  }

  context.clearRect(0, 0, LOGO_TEXTURE_SIZE, LOGO_TEXTURE_SIZE);
  context.fillStyle = "rgba(17, 24, 39, 0.9)";
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "rgba(255, 255, 255, 0.9)";
  context.lineWidth = 10;
  context.beginPath();
  context.arc(center, center, radius - 18, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = "#ffffff";
  context.font = "700 74px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GI", center, center + 4);

  const texture = new CanvasTexture(canvas);

  texture.needsUpdate = true;

  return texture;
}
