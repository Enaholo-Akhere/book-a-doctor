import { Suspense, useEffect } from 'react';
import Layout from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import { useGeolocation } from './Hook/useGeoLocation';
import { useAuthStore } from './store/authStore';
import AOS from 'aos';
import SocketProvider from './library/socket/SocketProvider';
import CallProvider from './components/Call/CallProvider';
import CallAlertsSetup from './components/Call/CallAlertsSetup';
import ChatRoom from './components/ChatRooms';
import AiChat from './components/AiChat';
import { useChatRealtimeSync } from './Hook/useChat';
import 'aos/dist/aos.css';

/** Keeps chat caches in sync with socket events, app-wide. */
const ChatRealtimeSync = () => {
  useChatRealtimeSync();
  return null;
};

const App = () => {
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

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <BrowserRouter>
      <SocketProvider>
        <CallProvider>
          <ChatRealtimeSync />
          <CallAlertsSetup />
          <Suspense fallback={<div>Loading...</div>}>
            <Layout />
          </Suspense>
          <ChatRoom />
          <AiChat />
        </CallProvider>
      </SocketProvider>
    </BrowserRouter>
  );
};
export default App;
