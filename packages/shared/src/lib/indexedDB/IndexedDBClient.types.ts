export type IndexedDBKey = IDBValidKey;

/**
 * Defines the key and value shape for one object store.
 */
export type IndexedDBStoreSchema = {
  key: IndexedDBKey;
  value: unknown;
};

/**
 * Maps object store names to their typed key and value shapes.
 */
export type IndexedDBSchema = Record<string, IndexedDBStoreSchema>;

export type IndexedDBStoreName<TSchema extends IndexedDBSchema> = Extract<
  keyof TSchema,
  string
>;

export type IndexedDBStoreKey<
  TSchema extends IndexedDBSchema,
  TStoreName extends IndexedDBStoreName<TSchema>
> = TSchema[TStoreName]["key"];

export type IndexedDBStoreValue<
  TSchema extends IndexedDBSchema,
  TStoreName extends IndexedDBStoreName<TSchema>
> = TSchema[TStoreName]["value"];

export type IndexedDBIndexDefinition = {
  name: string;
  keyPath: string | string[];
  options?: IDBIndexParameters;
};

/**
 * Describes an object store that should exist in the database.
 */
export type IndexedDBStoreDefinition<TStoreName extends string = string> = {
  name: TStoreName;
  keyPath?: string | string[];
  autoIncrement?: boolean;
  indexes?: IndexedDBIndexDefinition[];
};

export type IndexedDBUpgradeContext<TSchema extends IndexedDBSchema> = {
  database: IDBDatabase;
  event: IDBVersionChangeEvent;
  transaction: IDBTransaction | null;
  stores: IndexedDBStoreDefinition<IndexedDBStoreName<TSchema>>[];
};

export type IndexedDBClientConfig<TSchema extends IndexedDBSchema> = {
  databaseName: string;
  version: number;
  stores: IndexedDBStoreDefinition<IndexedDBStoreName<TSchema>>[];
  onUpgrade?: (context: IndexedDBUpgradeContext<TSchema>) => void;
};

export type IndexedDBTransactionMode = IDBTransactionMode;

export type IndexedDBObjectStoreCallback<TResult> = (
  store: IDBObjectStore,
  transaction: IDBTransaction
) => TResult | Promise<TResult>;
