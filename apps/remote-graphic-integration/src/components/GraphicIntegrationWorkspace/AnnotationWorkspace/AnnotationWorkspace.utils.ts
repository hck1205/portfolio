import type { AnnotationSavePayload } from "../../../lib/ViewerEngine/viewer/Annotation";
import type {
  AnnotationConfig,
  AnnotationSaveEntry,
  ViewerControlConfig
} from "../GraphicIntegrationWorkspace.types";

export const DEFAULT_ANNOTATION_CONFIG: AnnotationConfig = {
  strokeColor: "#e11d48",
  strokeWidth: 4,
  tool: "pen"
};

export function createAnnotationSaveEntry(
  payload: AnnotationSavePayload,
  viewerConfig: ViewerControlConfig
): AnnotationSaveEntry {
  const createdAt = new Date();
  const createdAtIso = createdAt.toISOString();

  return {
    annotationSnapshot: payload,
    camera: payload.camera,
    createdAt: createdAtIso,
    createdAtIso,
    createdAtTimeZone: getCurrentTimeZone(),
    id: createAnnotationSaveId(createdAt),
    thumbnailDataUrl: payload.thumbnailDataUrl,
    viewerState: { ...viewerConfig }
  };
}

function createAnnotationSaveId(createdAt: Date) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${createdAt.getTime()}-${Math.random().toString(36).slice(2)}`;
}

function getCurrentTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
}
