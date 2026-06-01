import type { AnnotationToolbarItem } from "./AnnotationToolbar.types";

export const annotationToolbarItems: AnnotationToolbarItem[] = [
  {
    icon: "move",
    label: "Move",
    tool: "select"
  },
  {
    icon: "pencil",
    label: "Pen",
    tool: "pen"
  },
  {
    icon: "minus",
    label: "Line",
    tool: "line"
  },
  {
    icon: "arrow-up-right",
    label: "Arrow",
    tool: "arrow"
  },
  {
    icon: "square",
    label: "Rectangle",
    tool: "rect"
  },
  {
    icon: "type",
    label: "Text",
    tool: "text"
  }
];

export const ANNOTATION_STROKE_ICON_WIDTH_MAX = 4.5;
export const ANNOTATION_STROKE_ICON_WIDTH_MIN = 1.5;
export const ANNOTATION_STROKE_ICON_WIDTH_RATIO = 3;

export function getNormalizedAnnotationStrokeWidth(strokeWidth: number) {
  return Math.min(16, Math.max(1, strokeWidth));
}

export function getAnnotationStrokeIconWidth(strokeWidth: number) {
  return Math.min(
    ANNOTATION_STROKE_ICON_WIDTH_MAX,
    Math.max(
      ANNOTATION_STROKE_ICON_WIDTH_MIN,
      strokeWidth / ANNOTATION_STROKE_ICON_WIDTH_RATIO
    )
  );
}
