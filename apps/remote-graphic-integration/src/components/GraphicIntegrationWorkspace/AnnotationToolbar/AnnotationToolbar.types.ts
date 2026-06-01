import type { AnnotationTool } from "../../../lib/ViewerEngine/viewer/Annotation";

export type AnnotationToolbarItem = {
  icon: string;
  label: string;
  tool: AnnotationTool;
};

export type AnnotationToolbarProps = {
  activeStrokeColor: string;
  activeStrokeWidth: number;
  activeTool: AnnotationTool;
  onClear: () => void;
  onSave: () => void;
  onStrokeColorChange: (value: string) => void;
  onStrokeWidthChange: (value: number) => void;
  onToolChange: (tool: AnnotationTool) => void;
};
