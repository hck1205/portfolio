import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";

import { RESIZE_RENDER_DELAY_MS } from "./AnnotationCanvas.constants";
import { repositionCanvasObjects } from "./AnnotationCanvas.fabric";

type UseAnnotationFabricCanvasOptions = {
  onCanvasElementChange?: (canvasElement: HTMLCanvasElement | null) => void;
};

export function useAnnotationFabricCanvas({
  onCanvasElementChange
}: UseAnnotationFabricCanvasOptions) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const canvasElement = canvasElementRef.current;
    const layerElement = layerRef.current;

    if (!canvasElement || !layerElement) {
      return;
    }

    onCanvasElementChange?.(canvasElement);

    const fabricCanvas = new FabricCanvas(canvasElement, {
      backgroundColor: "transparent",
      preserveObjectStacking: true,
      selection: false
    });
    let resizeTimeoutId: number | undefined;

    fabricCanvasRef.current = fabricCanvas;

    const resizeCanvas = () => {
      const { height, width } = layerElement.getBoundingClientRect();
      const nextHeight = Math.max(1, Math.floor(height));
      const nextWidth = Math.max(1, Math.floor(width));
      const previousHeight = fabricCanvas.height;
      const previousWidth = fabricCanvas.width;
      const shouldRepositionAnnotations =
        previousHeight > 1 &&
        previousWidth > 1 &&
        (previousHeight !== nextHeight || previousWidth !== nextWidth);

      fabricCanvas.setDimensions({
        height: nextHeight,
        width: nextWidth
      });

      if (shouldRepositionAnnotations) {
        repositionCanvasObjects(
          fabricCanvas,
          nextWidth / previousWidth,
          nextHeight / previousHeight
        );
      }

      fabricCanvas.requestRenderAll();
      setIsResizing(false);
    };
    const scheduleResizeCanvas = () => {
      setIsResizing(true);
      window.clearTimeout(resizeTimeoutId);
      resizeTimeoutId = window.setTimeout(
        resizeCanvas,
        RESIZE_RENDER_DELAY_MS
      );
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(scheduleResizeCanvas);
    resizeObserver.observe(layerElement);

    return () => {
      window.clearTimeout(resizeTimeoutId);
      resizeObserver.disconnect();
      onCanvasElementChange?.(null);
      fabricCanvasRef.current = null;
      void fabricCanvas.dispose();
    };
  }, [onCanvasElementChange]);

  return {
    canvasElementRef,
    fabricCanvasRef,
    isResizing,
    layerRef
  };
}
