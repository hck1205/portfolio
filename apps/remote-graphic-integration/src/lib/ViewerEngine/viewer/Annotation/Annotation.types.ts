export type AnnotationTool = "select" | "pen" | "line" | "arrow" | "rect" | "text";

export type AnnotationSnapshotObject = {
  fillColor: string | null;
  height: number;
  left: number;
  strokeColor: string;
  strokeWidth: number;
  top: number;
  type: string;
  width: number;
};

export type AnnotationFabricJson = Record<string, any>;

export type AnnotationSnapshotPayload = {
  fabricJson: AnnotationFabricJson;
  height: number;
  objectCount: number;
  objects: AnnotationSnapshotObject[];
  width: number;
};

export type AnnotationCameraSnapshot = {
  far?: number;
  fov?: number;
  near?: number;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  rotation: [number, number, number];
  target?: [number, number, number];
  zoom: number;
};

export type AnnotationSavePayload = AnnotationSnapshotPayload & {
  camera: AnnotationCameraSnapshot | null;
  thumbnailDataUrl: string | null;
};

export type AnnotationStylePayload = {
  strokeColor: string;
  strokeWidth: number;
};

export type AnnotationCanvasProps = {
  active: boolean;
  clearSignal: number;
  onCanvasElementChange?: (canvasElement: HTMLCanvasElement | null) => void;
  onSelectionStyleChange?: (payload: AnnotationStylePayload) => void;
  onSave?: (payload: AnnotationSnapshotPayload) => void;
  restoreSignal?: number;
  restoreSnapshot?: AnnotationSnapshotPayload | null;
  saveSignal: number;
  strokeColor: string;
  strokeWidth: number;
  tool: AnnotationTool;
};
