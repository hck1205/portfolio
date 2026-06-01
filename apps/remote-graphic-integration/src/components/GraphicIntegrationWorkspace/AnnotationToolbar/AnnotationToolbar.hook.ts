import { useEffect, useRef, useState } from "react";

export function useAnnotationStrokeController() {
  const strokeControlRef = useRef<HTMLDivElement | null>(null);
  const [isStrokeControllerOpen, setIsStrokeControllerOpen] = useState(false);

  const closeStrokeController = () => {
    setIsStrokeControllerOpen(false);
  };

  const toggleStrokeController = () => {
    setIsStrokeControllerOpen((isControllerOpen) => !isControllerOpen);
  };

  useEffect(() => {
    if (!isStrokeControllerOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const strokeControlElement = strokeControlRef.current;

      if (
        strokeControlElement &&
        event.target instanceof Node &&
        strokeControlElement.contains(event.target)
      ) {
        return;
      }

      closeStrokeController();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isStrokeControllerOpen]);

  return {
    closeStrokeController,
    isStrokeControllerOpen,
    strokeControlRef,
    toggleStrokeController
  };
}
