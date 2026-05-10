import { IndexedDBTransactionError } from "../IndexedDBClient.errors";

/**
 * Resolves when an IndexedDB transaction is fully committed.
 *
 * Request success means the operation finished, but transaction completion is
 * the point where the browser has accepted the whole unit of work.
 */
export function waitForTransaction(
  transaction: IDBTransaction
): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(
        transaction.error ??
          new IndexedDBTransactionError("IndexedDB transaction failed.")
      );
    };

    transaction.onabort = () => {
      reject(
        transaction.error ??
          new IndexedDBTransactionError("IndexedDB transaction was aborted.")
      );
    };
  });
}
