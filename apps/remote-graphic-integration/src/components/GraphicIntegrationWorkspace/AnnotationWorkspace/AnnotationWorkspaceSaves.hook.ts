import { useEffect, useState } from "react";

import type { AnnotationSavePayload } from "../../../lib/ViewerEngine/viewer/Annotation";
import type {
  AnnotationSaveEntry,
  ViewerControlConfig
} from "../GraphicIntegrationWorkspace.types";
import { createAnnotationSaveEntry } from "./AnnotationWorkspace.utils";
import {
  deleteAnnotationSaveEntry,
  loadAnnotationSaveEntries,
  persistAnnotationSaveEntry
} from "../../../storage/graphicIntegrationIndexedDB";

export function useAnnotationSaves(viewerConfig: ViewerControlConfig) {
  const [saves, setSaves] = useState<AnnotationSaveEntry[]>([]);
  const [restoreSignal, setRestoreSignal] = useState(0);
  const [restoreTarget, setRestoreTarget] = useState<AnnotationSaveEntry | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    void loadAnnotationSaveEntries()
      .then((storedSaves) => {
        if (isMounted) {
          setSaves(storedSaves);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const addSave = (payload: AnnotationSavePayload) => {
    const nextSave = createAnnotationSaveEntry(payload, viewerConfig);

    setSaves((currentSaves) => [nextSave, ...currentSaves]);
    void persistAnnotationSaveEntry(nextSave).catch(() => undefined);
  };

  const restoreSave = (save: AnnotationSaveEntry) => {
    setRestoreTarget(save);
    setRestoreSignal((signal) => signal + 1);
  };

  const deleteSave = (saveId: string) => {
    setSaves((currentSaves) =>
      currentSaves.filter((save) => save.id !== saveId)
    );
    setRestoreTarget((currentTarget) =>
      currentTarget?.id === saveId ? null : currentTarget
    );
    void deleteAnnotationSaveEntry(saveId).catch(() => undefined);
  };

  return {
    addSave,
    deleteSave,
    restoreSave,
    restoreSignal,
    restoreTarget,
    saves
  };
}
