import { createIndexedDBClient } from "@portfolio/shared/indexedDB";

import type { AnnotationSaveEntry } from "../components/GraphicIntegrationWorkspace/GraphicIntegrationWorkspace.types";

type GraphicIntegrationIndexedDBSchema = {
  annotationSaves: {
    key: string;
    value: AnnotationSaveEntry;
  };
};

const GRAPHIC_INTEGRATION_DATABASE_NAME = "portfolio:remote-graphic-integration";
const GRAPHIC_INTEGRATION_DATABASE_VERSION = 1;
const ANNOTATION_SAVES_STORE_NAME = "annotationSaves";

const graphicIntegrationStorage =
  createIndexedDBClient<GraphicIntegrationIndexedDBSchema>({
    databaseName: GRAPHIC_INTEGRATION_DATABASE_NAME,
    version: GRAPHIC_INTEGRATION_DATABASE_VERSION,
    stores: [
      {
        indexes: [
          {
            name: "createdAtIso",
            keyPath: "createdAtIso"
          }
        ],
        keyPath: "id",
        name: ANNOTATION_SAVES_STORE_NAME
      }
    ]
  });

export async function loadAnnotationSaveEntries() {
  const saves = await graphicIntegrationStorage.getAll(
    ANNOTATION_SAVES_STORE_NAME
  );

  return saves.sort((left, right) =>
    right.createdAtIso.localeCompare(left.createdAtIso)
  );
}

export async function persistAnnotationSaveEntry(save: AnnotationSaveEntry) {
  await graphicIntegrationStorage.put(ANNOTATION_SAVES_STORE_NAME, save);
}

export async function deleteAnnotationSaveEntry(saveId: string) {
  await graphicIntegrationStorage.delete(ANNOTATION_SAVES_STORE_NAME, saveId);
}
