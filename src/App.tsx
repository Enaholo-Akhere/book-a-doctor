import { Suspense } from 'react';
import Layout from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout />
      </Suspense>
    </BrowserRouter>
  );
};
export default App;
