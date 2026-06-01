import { useState } from "react";

import type { AnnotationPanelProps, AnnotationSaveEntry } from "./AnnotationPanel.types";

export function useAnnotationPanel(
  onAnnotationSaveDelete: AnnotationPanelProps["onAnnotationSaveDelete"]
) {
  const [deleteTarget, setDeleteTarget] = useState<AnnotationSaveEntry | null>(
    null
  );

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    onAnnotationSaveDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return {
    closeDeleteModal,
    confirmDelete,
    deleteTarget,
    setDeleteTarget
  };
}
