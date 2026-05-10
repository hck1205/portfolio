import { IndexedDBUnavailableError } from "../IndexedDBClient.errors";

/**
 * Returns the current runtime's IndexedDB factory.
 *
 * IndexedDB only exists in browser-like environments. Keeping this lookup behind
 * a helper lets Next.js and other SSR runtimes import the package safely.
 */
export function getIndexedDBFactory() {
  if (typeof globalThis.indexedDB === "undefined") {
    throw new IndexedDBUnavailableError();
  }

  return globalThis.indexedDB;
}
