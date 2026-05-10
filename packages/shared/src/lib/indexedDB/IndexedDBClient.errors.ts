/**
 * Raised when code tries to open IndexedDB outside a browser-like runtime.
 */
export class IndexedDBUnavailableError extends Error {
  constructor() {
    super("IndexedDB is not available in this runtime.");
    this.name = "IndexedDBUnavailableError";
  }
}

/**
 * Raised when the browser aborts or fails an IndexedDB transaction.
 */
export class IndexedDBTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IndexedDBTransactionError";
  }
}
