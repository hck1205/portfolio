export {
  normalizeSvgAttributes,
  type SvgAttributes,
  type SvgAttributeValue
} from "./utils/images";

export {
  createIndexedDBClient,
  IndexedDBClient,
  IndexedDBTransactionError,
  IndexedDBUnavailableError,
  type IndexedDBClientConfig,
  type IndexedDBIndexDefinition,
  type IndexedDBObjectStoreCallback,
  type IndexedDBSchema,
  type IndexedDBStoreDefinition,
  type IndexedDBStoreKey,
  type IndexedDBStoreName,
  type IndexedDBStoreValue,
  type IndexedDBTransactionMode,
  type IndexedDBUpgradeContext
} from "./lib/indexedDB";
