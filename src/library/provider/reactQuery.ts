import { isServer, QueryClient } from '@tanstack/react-query'

const makeQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                retry: 2,
                refetchOnWindowFocus: false,
            },
        },
    });

/**
 * The browser's query cache. Import it only from browser code (event
 * handlers, effects, stores), never to read data while rendering.
 */
export const queryClient = makeQueryClient();

/**
 * The client for <QueryClientProvider>: the shared one in the browser, but a
 * fresh one for every server render. A module-level client on the server is
 * shared by all requests and never refetches, so pages were rendered with
 * stale data (causing hydration mismatches) and one request's cache could
 * reach another's.
 */
export const getQueryClient = () => (isServer ? makeQueryClient() : queryClient);
