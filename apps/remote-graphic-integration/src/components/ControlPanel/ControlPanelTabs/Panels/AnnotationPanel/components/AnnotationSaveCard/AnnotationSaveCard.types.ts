import type { AnnotationSaveEntry } from "../../AnnotationPanel.types";

export type AnnotationSaveCardProps = {
  save: AnnotationSaveEntry;
  indexLabel: string;
  onDelete: (save: AnnotationSaveEntry) => void;
  onSelect: (save: AnnotationSaveEntry) => void;
};
