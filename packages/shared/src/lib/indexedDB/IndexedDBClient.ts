import type {
  IndexedDBClientConfig,
  IndexedDBObjectStoreCallback,
  IndexedDBSchema,
  IndexedDBStoreKey,
  IndexedDBStoreName,
  IndexedDBStoreValue,
  IndexedDBTransactionMode
} from "./IndexedDBClient.types";
import { IndexedDBTransactionError } from "./IndexedDBClient.errors";
import { getIndexedDBFactory } from "./helpers/assertIndexedDB";
import { requestToPromise } from "./helpers/request";
import { waitForTransaction } from "./helpers/transaction";

/**
 * Small Promise-based IndexedDB client for app-level browser storage.
 *
 * The class owns opening, upgrading, and closing one database. Individual apps
 * can define their own typed schema while sharing the same CRUD and transaction
 * behavior from `@portfolio/shared`.
 */
export class IndexedDBClient<TSchema extends IndexedDBSchema> {
  private database: IDBDatabase | null = null;

  constructor(private readonly config: IndexedDBClientConfig<TSchema>) {}

  /**
   * Opens the configured database and creates missing stores or indexes during
   * version upgrades.
   */
  async open() {
    if (this.database) {
      return this.database;
    }

    const indexedDBFactory = getIndexedDBFactory();
    const request = indexedDBFactory.open(
      this.config.databaseName,
      this.config.version
    );

    request.onupgradeneeded = (event) => {
      const database = request.result;
      const transaction = request.transaction;

      this.syncStores(database, transaction);
      this.config.onUpgrade?.({
        database,
        event,
        transaction,
        stores: this.config.stores
      });
    };

    const database = await requestToPromise(request);

    database.onversionchange = () => {
      this.close();
    };

    this.database = database;
    return database;
  }

  /**
   * Closes the active connection, if one exists.
   */
  close() {
    this.database?.close();
    this.database = null;
  }

  /**
   * Reads one record by key from a store.
   */
  async get<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName,
    key: IndexedDBStoreKey<TSchema, TStoreName>
  ) {
    return this.withStore(storeName, "readonly", (store) =>
      requestToPromise(store.get(key))
    ) as Promise<IndexedDBStoreValue<TSchema, TStoreName> | undefined>;
  }

  /**
   * Reads every record from a store.
   */
  async getAll<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName
  ) {
    return this.withStore(storeName, "readonly", (store) =>
      requestToPromise(store.getAll())
    ) as Promise<IndexedDBStoreValue<TSchema, TStoreName>[]>;
  }

  /**
   * Reads records through an index.
   */
  async getAllByIndex<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName,
    indexName: string,
    query?: IDBValidKey | IDBKeyRange | null
  ) {
    return this.withStore(storeName, "readonly", (store) =>
      requestToPromise(store.index(indexName).getAll(query))
    ) as Promise<IndexedDBStoreValue<TSchema, TStoreName>[]>;
  }

  /**
   * Adds a new record. The browser rejects the request when the key already
   * exists.
   */
  async add<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName,
    value: IndexedDBStoreValue<TSchema, TStoreName>,
    key?: IndexedDBStoreKey<TSchema, TStoreName>
  ) {
    return this.write(storeName, (store) => store.add(value, key));
  }

  /**
   * Inserts or replaces a record.
   */
  async put<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName,
    value: IndexedDBStoreValue<TSchema, TStoreName>,
    key?: IndexedDBStoreKey<TSchema, TStoreName>
  ) {
    return this.write(storeName, (store) => store.put(value, key));
  }

  /**
   * Deletes one record by key.
   */
  async delete<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName,
    key: IndexedDBStoreKey<TSchema, TStoreName>
  ) {
    await this.withStore(storeName, "readwrite", (store) =>
      requestToPromise(store.delete(key))
    );
  }

  /**
   * Removes every record from a store.
   */
  async clear<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName
  ) {
    await this.withStore(storeName, "readwrite", (store) =>
      requestToPromise(store.clear())
    );
  }

  /**
   * Counts records in a store, optionally constrained by a key or key range.
   */
  async count<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName,
    query?: IDBValidKey | IDBKeyRange
  ) {
    return this.withStore(storeName, "readonly", (store) =>
      requestToPromise(store.count(query))
    );
  }

  /**
   * Runs custom logic against one object store inside a managed transaction.
   */
  async withStore<TStoreName extends IndexedDBStoreName<TSchema>, TResult>(
    storeName: TStoreName,
    mode: IndexedDBTransactionMode,
    callback: IndexedDBObjectStoreCallback<TResult>
  ) {
    const database = await this.open();
    const transaction = database.transaction(storeName, mode);
    const transactionComplete = waitForTransaction(transaction);
    const store = transaction.objectStore(storeName);

    try {
      const result = await callback(store, transaction);

      await transactionComplete;
      return result;
    } catch (error) {
      await transactionComplete.catch(() => undefined);
      throw error;
    }
  }

  private async write<TStoreName extends IndexedDBStoreName<TSchema>>(
    storeName: TStoreName,
    createRequest: (store: IDBObjectStore) => IDBRequest<IDBValidKey>
  ) {
    return this.withStore(storeName, "readwrite", (store) =>
      requestToPromise(createRequest(store))
    );
  }

  private syncStores(
    database: IDBDatabase,
    transaction: IDBTransaction | null
  ) {
    for (const storeDefinition of this.config.stores) {
      const store = database.objectStoreNames.contains(storeDefinition.name)
        ? transaction?.objectStore(storeDefinition.name)
        : database.createObjectStore(storeDefinition.name, {
            autoIncrement: storeDefinition.autoIncrement,
            keyPath: storeDefinition.keyPath
          });

      if (!store) {
        throw new IndexedDBTransactionError(
          `Could not access object store "${storeDefinition.name}" during upgrade.`
        );
      }

      this.syncIndexes(store, storeDefinition.indexes ?? []);
    }
  }

  private syncIndexes(
    store: IDBObjectStore,
    indexes: NonNullable<
      IndexedDBClientConfig<TSchema>["stores"][number]["indexes"]
    >
  ) {
    for (const indexDefinition of indexes) {
      if (store.indexNames.contains(indexDefinition.name)) {
        continue;
      }

      store.createIndex(
        indexDefinition.name,
        indexDefinition.keyPath,
        indexDefinition.options
      );
    }
  }
}

export function createIndexedDBClient<TSchema extends IndexedDBSchema>(
  config: IndexedDBClientConfig<TSchema>
) {
  return new IndexedDBClient(config);
}
