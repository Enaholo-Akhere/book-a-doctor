import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * false during server render and the hydration pass, true afterwards.
 * Use it to gate UI that depends on browser-only state (the persisted auth
 * store lives in localStorage), so server and client HTML match.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
