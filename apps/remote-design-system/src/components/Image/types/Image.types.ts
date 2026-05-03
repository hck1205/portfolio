export type ImagePreviewOpenChangeDetail = {
  open: boolean;
};

export type ImageTransformAction = "zoomIn" | "zoomOut" | "rotateLeft" | "rotateRight" | "reset";

export type ImageTransformDetail = {
  action: ImageTransformAction;
  rotate: number;
  scale: number;
};
