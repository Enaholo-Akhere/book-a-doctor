'use client';
import { ReactNode, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion } from 'framer-motion';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import Layout from './layout/Layout';
import { getQueryClient } from './library/provider/reactQuery';
import { useGeolocation } from './Hook/useGeoLocation';
import { useAuthStore } from './store/authStore';
import SocketProvider from './library/socket/SocketProvider';
import CallProvider from './components/Call/CallProvider';
import CallAlertsSetup from './components/Call/CallAlertsSetup';
import dynamic from 'next/dynamic';
import ClientOnly from './components/ClientOnly';
import { useChatRealtimeSync } from './Hook/useChat';
import { usePathname } from 'next/navigation';

// Floating widgets that only render after hydration anyway: load their code as separate
// chunks once the page is up, instead of in the bundle every page waits for.
const ChatRoom = dynamic(() => import('./components/ChatRooms'), { ssr: false });
const AiChat = dynamic(() => import('./components/AiChat'), { ssr: false });

// Components use the lightweight `m` elements; the animation engine they need arrives in its
// own chunk instead of the bundle every page waits for.
const loadMotionFeatures = () => import('./library/motion/features').then((mod) => mod.default);

/** Keeps chat caches in sync with socket events, app-wide. */
const ChatRealtimeSync = () => {
  useChatRealtimeSync();
  return null;
};

const AppShell = ({ children }: { children: ReactNode }) => {
  const { setGeolocation } = useAuthStore();
  const { data, isLoading, isError } = useGeolocation();
  const isAdmin = usePathname()?.startsWith('/admin');

  useEffect(() => {
    if (!isLoading && !isError) {
      setGeolocation({
        provider: data.provider,
        currency: data.currency,
        countryCode: data.countryCode,
        exchangeRate: data.exchangeRate,
        ip: data.ip,
      });
    }
  }, [data, isError, isLoading, setGeolocation]);

  return (
    <SocketProvider>
      <CallProvider>
        <ChatRealtimeSync />
        <CallAlertsSetup />
        <Layout>{children}</Layout>
        {/* Patient/doctor widgets; they'd float over the admin sidebar. */}
        {!isAdmin && (
          <ClientOnly>
            <ChatRoom />
            <AiChat />
          </ClientOnly>
        )}
      </CallProvider>
    </SocketProvider>
  );
};

const App = ({ children }: { children: ReactNode }) => {
  // One client per server request; the shared client in the browser.
  const [queryClient] = useState(getQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <LazyMotion features={loadMotionFeatures}>
        <AppShell>{children}</AppShell>
      </LazyMotion>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
