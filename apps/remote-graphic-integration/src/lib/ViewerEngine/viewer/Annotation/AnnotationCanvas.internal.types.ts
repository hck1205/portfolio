import type { RefObject } from "react";
import type { FabricObject, Line, Point, Triangle } from "fabric";

import type { AnnotationTool } from "./Annotation.types";

export type DrawingObject = FabricObject | null;

export type ActiveShape = {
  line?: Line;
  object: DrawingObject;
  start: Point;
  triangle?: Triangle;
};

export type AnnotationInteractionState = {
  active: boolean;
  tool: AnnotationTool;
};

export type InteractionStateRef = RefObject<AnnotationInteractionState>;
