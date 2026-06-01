import { useEffect, useRef } from "react";
import { PencilBrush, Textbox, type TPointerEvent } from "fabric";

import {
  addShape,
  applyStyleToSelectedObjects,
  configureTextboxSelection,
  createAnnotationSnapshot,
  createShape,
  createTextbox,
  finishShape,
  getAnnotationObjectStyle,
  getCanvasPointer,
  getCursorForTool,
  isEditableElement,
  updateShape
} from "./AnnotationCanvas.fabric";
import type { ActiveShape } from "./AnnotationCanvas.internal.types";
import styles from "./AnnotationCanvas.module.css";
import type { AnnotationCanvasProps } from "./Annotation.types";
import { useAnnotationFabricCanvas } from "./useAnnotationFabricCanvas";

export function AnnotationCanvas({
  active,
  clearSignal,
  onCanvasElementChange,
  onSelectionStyleChange,
  onSave,
  restoreSignal = 0,
  restoreSnapshot,
  saveSignal,
  strokeColor,
  strokeWidth,
  tool
}: AnnotationCanvasProps) {
  const activeShapeRef = useRef<ActiveShape | null>(null);
  const handledRestoreSignalRef = useRef(restoreSignal);
  const handledSaveSignalRef = useRef(saveSignal);
  const interactionStateRef = useRef({ active, tool });
  const { canvasElementRef, fabricCanvasRef, isResizing, layerRef } =
    useAnnotationFabricCanvas({ onCanvasElementChange });

  useEffect(() => {
    interactionStateRef.current = { active, tool };
  }, [active, tool]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;

    if (!fabricCanvas) {
      return;
    }

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "transparent";
    fabricCanvas.requestRenderAll();
  }, [clearSignal, fabricCanvasRef]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;

    if (
      !fabricCanvas ||
      !restoreSnapshot ||
      restoreSignal < 1 ||
      handledRestoreSignalRef.current === restoreSignal
    ) {
      return;
    }

    handledRestoreSignalRef.current = restoreSignal;
    fabricCanvas.discardActiveObject();
    void Promise.resolve(fabricCanvas.loadFromJSON(restoreSnapshot.fabricJson))
      .then(() => {
        fabricCanvas.backgroundColor = "transparent";
        fabricCanvas.getObjects().forEach((object) => {
          if (object instanceof Textbox) {
            configureTextboxSelection(
              object,
              fabricCanvas,
              interactionStateRef
            );
          }

          object.set({
            evented: active && tool === "select",
            selectable: active && tool === "select"
          });
          object.setCoords();
        });
        fabricCanvas.requestRenderAll();
      })
      .catch(() => {
        fabricCanvas.requestRenderAll();
      });
  }, [active, fabricCanvasRef, restoreSignal, restoreSnapshot, tool]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;

    if (
      !fabricCanvas ||
      saveSignal < 1 ||
      handledSaveSignalRef.current === saveSignal
    ) {
      return;
    }

    handledSaveSignalRef.current = saveSignal;
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    onSave?.(createAnnotationSnapshot(fabricCanvas));
  }, [fabricCanvasRef, onSave, saveSignal]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;

    if (!fabricCanvas) {
      return;
    }

    fabricCanvas.isDrawingMode = active && tool === "pen";
    fabricCanvas.selection = active && tool === "select";
    fabricCanvas.defaultCursor = active ? getCursorForTool(tool) : "default";

    if (active && tool === "pen") {
      const brush = new PencilBrush(fabricCanvas);

      brush.color = strokeColor;
      brush.width = strokeWidth;
      fabricCanvas.freeDrawingBrush = brush;
    }

    fabricCanvas.getObjects().forEach((object) => {
      if (object instanceof Textbox) {
        configureTextboxSelection(object, fabricCanvas, interactionStateRef);
      }

      object.set({
        evented: active && tool === "select",
        selectable: active && tool === "select"
      });
      object.setCoords();
    });

    if (active && tool === "select") {
      applyStyleToSelectedObjects(fabricCanvas, strokeColor, strokeWidth);
    }

    fabricCanvas.requestRenderAll();
  }, [active, fabricCanvasRef, strokeColor, strokeWidth, tool]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;

    if (!fabricCanvas || !active) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") {
        return;
      }

      if (isEditableElement(event.target)) {
        return;
      }

      const activeObjects = fabricCanvas.getActiveObjects();

      if (!activeObjects.length) {
        return;
      }

      event.preventDefault();
      activeObjects.forEach((object) => {
        fabricCanvas.remove(object);
      });
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, fabricCanvasRef]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;

    if (!fabricCanvas || !active || tool !== "select") {
      return undefined;
    }

    const handleSelectionChange = () => {
      const [targetObject] = fabricCanvas.getActiveObjects();

      if (!targetObject) {
        return;
      }

      const nextStyle = getAnnotationObjectStyle(targetObject);

      if (nextStyle) {
        onSelectionStyleChange?.(nextStyle);
      }
    };

    const removeSelectionCreated = fabricCanvas.on(
      "selection:created",
      handleSelectionChange
    );
    const removeSelectionUpdated = fabricCanvas.on(
      "selection:updated",
      handleSelectionChange
    );

    return () => {
      removeSelectionCreated();
      removeSelectionUpdated();
    };
  }, [active, fabricCanvasRef, onSelectionStyleChange, tool]);

  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;

    if (!fabricCanvas || !active || tool === "pen" || tool === "select") {
      return undefined;
    }

    if (tool === "text") {
      const handleMouseDown = (event: { e: TPointerEvent }) => {
        const text = createTextbox(
          fabricCanvas.getScenePoint(event.e),
          strokeColor,
          fabricCanvas,
          interactionStateRef
        );

        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        fabricCanvas.requestRenderAll();
      };

      const removeMouseDown = fabricCanvas.on("mouse:down", handleMouseDown);

      return () => {
        removeMouseDown();
        activeShapeRef.current = null;
      };
    }

    const upperCanvasElement = fabricCanvas.upperCanvasEl;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      upperCanvasElement.setPointerCapture(event.pointerId);

      activeShapeRef.current = createShape(
        tool,
        getCanvasPointer(fabricCanvas, event),
        strokeColor,
        strokeWidth
      );

      const shape = activeShapeRef.current;

      if (shape) {
        addShape(fabricCanvas, shape);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const shape = activeShapeRef.current;

      if (!shape) {
        return;
      }

      event.preventDefault();
      updateShape(shape, getCanvasPointer(fabricCanvas, event), tool);
      fabricCanvas.requestRenderAll();
    };

    const handlePointerUp = (event: PointerEvent) => {
      const shape = activeShapeRef.current;

      if (!shape) {
        return;
      }

      event.preventDefault();

      if (upperCanvasElement.hasPointerCapture(event.pointerId)) {
        upperCanvasElement.releasePointerCapture(event.pointerId);
      }

      finishShape(fabricCanvas, shape, tool);
      activeShapeRef.current = null;
      fabricCanvas.requestRenderAll();
    };

    upperCanvasElement.addEventListener("pointerdown", handlePointerDown);
    upperCanvasElement.addEventListener("pointermove", handlePointerMove);
    upperCanvasElement.addEventListener("pointerup", handlePointerUp);
    upperCanvasElement.addEventListener("pointercancel", handlePointerUp);

    return () => {
      upperCanvasElement.removeEventListener("pointerdown", handlePointerDown);
      upperCanvasElement.removeEventListener("pointermove", handlePointerMove);
      upperCanvasElement.removeEventListener("pointerup", handlePointerUp);
      upperCanvasElement.removeEventListener("pointercancel", handlePointerUp);
      activeShapeRef.current = null;
    };
  }, [active, fabricCanvasRef, strokeColor, strokeWidth, tool]);

  const layerClassName = active
    ? `${styles.annotationLayer} ${styles.annotationLayerActive} ${
        isResizing ? styles.annotationLayerResizing : ""
      }`
    : styles.annotationLayer;

  return (
    <div className={layerClassName} ref={layerRef}>
      <canvas
        aria-label="Annotation drawing layer"
        className={styles.annotationCanvas}
        ref={canvasElementRef}
      />
    </div>
  );
}
