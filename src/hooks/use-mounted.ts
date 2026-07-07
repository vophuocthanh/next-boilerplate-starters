import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during server render and the first client render,
 * then `true` once hydrated. Use it to guard client-only UI without
 * triggering a setState-in-effect (SSR hydration-safe).
 */
export const useMounted = (): boolean =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
