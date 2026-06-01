import {
  Canvas as FabricCanvas,
  Group,
  Line,
  Rect,
  Textbox,
  Triangle,
  type FabricObject,
  type Point,
  type TPointerEvent
} from "fabric";

import {
  MIN_RENDERABLE_SHAPE_SIZE,
  TEXTBOX_PADDING,
  TEXTBOX_WIDTH
} from "./AnnotationCanvas.constants";
import type {
  ActiveShape,
  InteractionStateRef
} from "./AnnotationCanvas.internal.types";
import type {
  AnnotationSnapshotObject,
  AnnotationSnapshotPayload,
  AnnotationStylePayload,
  AnnotationTool
} from "./Annotation.types";

type ConfiguredTextbox = Textbox & {
  __annotationTextboxConfigured?: boolean;
};

export function createShape(
  tool: AnnotationTool,
  start: Point,
  strokeColor: string,
  strokeWidth: number
): ActiveShape | null {
  if (tool === "line") {
    return {
      object: new Line([start.x, start.y, start.x, start.y], {
        evented: false,
        selectable: false,
        stroke: strokeColor,
        strokeLineCap: "round",
        strokeWidth
      }),
      start
    };
  }

  if (tool === "arrow") {
    return {
      line: new Line([start.x, start.y, start.x, start.y], {
        evented: false,
        selectable: false,
        stroke: strokeColor,
        strokeLineCap: "round",
        strokeWidth
      }),
      object: null,
      start,
      triangle: new Triangle({
        evented: false,
        fill: strokeColor,
        height: Math.max(10, strokeWidth * 4),
        left: start.x,
        originX: "center",
        originY: "center",
        selectable: false,
        top: start.y,
        width: Math.max(10, strokeWidth * 4)
      })
    };
  }

  if (tool === "rect") {
    return {
      object: new Rect({
        evented: false,
        fill: "transparent",
        height: 0,
        left: start.x,
        originX: "left",
        originY: "top",
        selectable: false,
        stroke: strokeColor,
        strokeWidth,
        top: start.y,
        width: 0
      }),
      start
    };
  }

  return null;
}

export function createTextbox(
  start: Point,
  strokeColor: string,
  fabricCanvas: FabricCanvas,
  interactionStateRef: InteractionStateRef
) {
  const text = new Textbox("Text", {
    editable: true,
    evented: true,
    fill: strokeColor,
    fontSize: 18,
    left: start.x,
    selectable: true,
    top: start.y,
    width: TEXTBOX_WIDTH
  });

  configureTextboxSelection(text, fabricCanvas, interactionStateRef);

  return text;
}

export function addShape(fabricCanvas: FabricCanvas, shape: ActiveShape) {
  if (shape.object) {
    fabricCanvas.add(shape.object);
  }

  if (shape.line) {
    fabricCanvas.add(shape.line);
  }

  if (shape.triangle) {
    fabricCanvas.add(shape.triangle);
  }

  fabricCanvas.requestRenderAll();
}

export function repositionCanvasObjects(
  fabricCanvas: FabricCanvas,
  scaleX: number,
  scaleY: number
) {
  fabricCanvas.getObjects().forEach((object) => {
    object.set({
      left: (object.left ?? 0) * scaleX,
      top: (object.top ?? 0) * scaleY
    });
    object.setCoords();
  });
}

export function updateShape(
  shape: ActiveShape,
  pointer: Point,
  tool: AnnotationTool
) {
  if (tool === "line" && shape.object instanceof Line) {
    shape.object.set({
      x2: pointer.x,
      y2: pointer.y
    });
    shape.object.setCoords();
    return;
  }

  if (tool === "arrow" && shape.line && shape.triangle) {
    const angle =
      (Math.atan2(pointer.y - shape.start.y, pointer.x - shape.start.x) * 180) /
      Math.PI +
      90;

    shape.line.set({
      x2: pointer.x,
      y2: pointer.y
    });
    shape.triangle.set({
      angle,
      left: pointer.x,
      top: pointer.y
    });
    shape.line.setCoords();
    shape.triangle.setCoords();
    return;
  }

  if (tool === "rect" && shape.object instanceof Rect) {
    shape.object.set({
      height: Math.abs(pointer.y - shape.start.y),
      left: Math.min(pointer.x, shape.start.x),
      top: Math.min(pointer.y, shape.start.y),
      width: Math.abs(pointer.x - shape.start.x)
    });
    shape.object.setCoords();
  }
}

export function finishShape(
  fabricCanvas: FabricCanvas,
  shape: ActiveShape,
  tool: AnnotationTool
) {
  if (tool === "arrow" && shape.line && shape.triangle) {
    finishArrowShape(fabricCanvas, shape.line, shape.triangle);
    return;
  }

  const objects = [shape.object, shape.line, shape.triangle].filter(
    (object): object is FabricObject => Boolean(object)
  );

  if (!isShapeRenderable(shape, tool)) {
    fabricCanvas.remove(...objects);
    return;
  }

  objects.forEach((object) => {
    object.set({
      evented: false,
      selectable: false
    });
    object.setCoords();
  });
}

export function getCanvasPointer(
  fabricCanvas: FabricCanvas,
  event: PointerEvent
) {
  return fabricCanvas.getScenePoint(event as unknown as TPointerEvent);
}

export function getCursorForTool(tool: AnnotationTool) {
  if (tool === "select") {
    return "default";
  }

  if (tool === "text") {
    return "text";
  }

  return "crosshair";
}

export function applyStyleToSelectedObjects(
  fabricCanvas: FabricCanvas,
  strokeColor: string,
  strokeWidth: number
) {
  fabricCanvas.getActiveObjects().forEach((object) => {
    applyStyleToObject(object, strokeColor, strokeWidth);
  });
}

export function getAnnotationObjectStyle(
  object: FabricObject
): AnnotationStylePayload | null {
  if (object instanceof Group) {
    const childStyle = object
      .getObjects()
      .map(getAnnotationObjectStyle)
      .find((style): style is AnnotationStylePayload => Boolean(style));

    return childStyle ?? null;
  }

  if (object instanceof Textbox) {
    return {
      strokeColor: getColorValue(object.fill),
      strokeWidth: object.strokeWidth ?? 1
    };
  }

  if (object instanceof Triangle) {
    return {
      strokeColor: getColorValue(object.fill ?? object.stroke),
      strokeWidth: object.strokeWidth ?? 1
    };
  }

  return {
    strokeColor: getColorValue(object.stroke),
    strokeWidth: object.strokeWidth ?? 1
  };
}

export function createAnnotationSnapshot(
  fabricCanvas: FabricCanvas
): AnnotationSnapshotPayload {
  const objects = fabricCanvas.getObjects();

  return {
    fabricJson: fabricCanvas.toJSON(),
    height: fabricCanvas.height,
    objectCount: objects.length,
    objects: objects.map(createAnnotationSnapshotObject),
    width: fabricCanvas.width
  };
}

export function configureTextboxSelection(
  text: Textbox,
  fabricCanvas: FabricCanvas,
  interactionStateRef: InteractionStateRef
) {
  const configuredText = text as ConfiguredTextbox;

  text.set({
    padding: TEXTBOX_PADDING,
    perPixelTargetFind: false
  });

  if (configuredText.__annotationTextboxConfigured) {
    return;
  }

  const syncTextboxSelection = () => {
    const { active, tool } = interactionStateRef.current;
    const selectable = active && tool === "select";

    text.set({
      evented: selectable,
      padding: TEXTBOX_PADDING,
      perPixelTargetFind: false,
      selectable
    });
    text.setCoords();
    fabricCanvas.requestRenderAll();
  };

  text.on("changed", syncTextboxSelection);
  text.on("editing:exited", syncTextboxSelection);
  text.on("modified", syncTextboxSelection);
  configuredText.__annotationTextboxConfigured = true;
}

export function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function finishArrowShape(
  fabricCanvas: FabricCanvas,
  line: Line,
  triangle: Triangle
) {
  if (getLineDistance(line) < MIN_RENDERABLE_SHAPE_SIZE) {
    fabricCanvas.remove(line, triangle);
    return;
  }

  line.setCoords();
  triangle.setCoords();
  fabricCanvas.remove(line, triangle);

  const arrowGroup = new Group([line, triangle], {
    evented: false,
    selectable: false,
    subTargetCheck: false
  });

  arrowGroup.setCoords();
  fabricCanvas.add(arrowGroup);
}

function isShapeRenderable(shape: ActiveShape, tool: AnnotationTool) {
  if (tool === "rect" && shape.object instanceof Rect) {
    return (
      shape.object.width >= MIN_RENDERABLE_SHAPE_SIZE &&
      shape.object.height >= MIN_RENDERABLE_SHAPE_SIZE
    );
  }

  if (tool === "line" && shape.object instanceof Line) {
    return getLineDistance(shape.object) >= MIN_RENDERABLE_SHAPE_SIZE;
  }

  if (tool === "arrow" && shape.line) {
    return getLineDistance(shape.line) >= MIN_RENDERABLE_SHAPE_SIZE;
  }

  return true;
}

function getLineDistance(line: Line) {
  const x1 = line.x1 ?? 0;
  const x2 = line.x2 ?? x1;
  const y1 = line.y1 ?? 0;
  const y2 = line.y2 ?? y1;

  return Math.hypot(x2 - x1, y2 - y1);
}

function applyStyleToObject(
  object: FabricObject,
  strokeColor: string,
  strokeWidth: number
) {
  if (object instanceof Group) {
    object.getObjects().forEach((childObject) => {
      applyStyleToObject(childObject, strokeColor, strokeWidth);
    });
    object.set({ dirty: true });
    return;
  }

  if (object instanceof Textbox) {
    object.set({
      fill: strokeColor
    });
    return;
  }

  if (object instanceof Triangle) {
    object.set({
      fill: strokeColor,
      stroke: strokeColor,
      strokeWidth
    });
    return;
  }

  object.set({
    stroke: strokeColor,
    strokeWidth
  });
}

function getColorValue(value: unknown) {
  return typeof value === "string" && value ? value : "#e11d48";
}

function getOptionalColorValue(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

function createAnnotationSnapshotObject(
  object: FabricObject
): AnnotationSnapshotObject {
  const bounds = object.getBoundingRect();
  const style = getAnnotationObjectStyle(object);

  return {
    fillColor: getOptionalColorValue(object.fill),
    height: normalizeSnapshotNumber(bounds.height),
    left: normalizeSnapshotNumber(bounds.left),
    strokeColor: style?.strokeColor ?? "#e11d48",
    strokeWidth: style?.strokeWidth ?? 1,
    top: normalizeSnapshotNumber(bounds.top),
    type: getAnnotationObjectType(object),
    width: normalizeSnapshotNumber(bounds.width)
  };
}

function getAnnotationObjectType(object: FabricObject) {
  if (object instanceof Group) {
    return "arrow";
  }

  if (object instanceof Textbox) {
    return "text";
  }

  if (object instanceof Rect) {
    return "rect";
  }

  if (object instanceof Line) {
    return "line";
  }

  if (object instanceof Triangle) {
    return "triangle";
  }

  return object.type ?? "annotation";
}

function normalizeSnapshotNumber(value: number | undefined) {
  return Number.isFinite(value) ? Math.round((value ?? 0) * 100) / 100 : 0;
}
