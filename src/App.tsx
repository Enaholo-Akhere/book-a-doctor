import { Suspense, useEffect } from 'react';
import Layout from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import { useGeolocation } from './Hook/useGeoLocation';
import { useAuthStore } from './store/authStore';

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

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout />
      </Suspense>
    </BrowserRouter>
  );
};
export default App;
