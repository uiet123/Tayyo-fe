/**
 * Simple pub/sub so independent widgets (credit pill, tables, cards) refetch
 * after a mutation. The data itself now lives in the backend — this file only
 * broadcasts "something changed".
 */
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyStoreChanged() {
  listeners.forEach((listener) => listener());
}
