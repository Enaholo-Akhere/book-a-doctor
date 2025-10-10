import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from 'react';
import Layout from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
const App = () => {
    return (_jsx(BrowserRouter, { children: _jsx(Suspense, { fallback: _jsx("div", { children: "Loading..." }), children: _jsx(Layout, {}) }) }));
};
export default App;
