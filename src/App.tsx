'use client';
import { ReactNode, Suspense, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import Layout from './layout/Layout';
import { queryClient } from './library/provider/reactQuery';
import { useGeolocation } from './Hook/useGeoLocation';
import { useAuthStore } from './store/authStore';
import SocketProvider from './library/socket/SocketProvider';
import CallProvider from './components/Call/CallProvider';
import CallAlertsSetup from './components/Call/CallAlertsSetup';
import ChatRoom from './components/ChatRooms';
import AiChat from './components/AiChat';
import ClientOnly from './components/ClientOnly';
import { useChatRealtimeSync } from './Hook/useChat';

/** Keeps chat caches in sync with socket events, app-wide. */
const ChatRealtimeSync = () => {
  useChatRealtimeSync();
  return null;
};

const AppShell = ({ children }: { children: ReactNode }) => {
  const { setGeolocation } = useAuthStore();
  const { data, isLoading, isError } = useGeolocation();

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
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>{children}</Layout>
        </Suspense>
        <ClientOnly>
          <ChatRoom />
          <AiChat />
        </ClientOnly>
      </CallProvider>
    </SocketProvider>
  );
};

const App = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <AppShell>{children}</AppShell>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
