/**
 * Converts an IndexedDB request into a Promise.
 *
 * Native IndexedDB is event-based; this helper keeps the public client methods
 * small and gives each operation a consistent async shape.
 */
export function requestToPromise<TResult>(
  request: IDBRequest<TResult>
): Promise<TResult> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
