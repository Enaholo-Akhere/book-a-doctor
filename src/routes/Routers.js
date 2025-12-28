import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Contact = lazy(() => import('@/pages/Contact'));
const Services = lazy(() => import('@/pages/Services'));
const Doctor = lazy(() => import('@/pages/doctors/Doctors'));
const DoctorDetails = lazy(() => import('@/pages/doctors/DoctorDetails'));
const Routers = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: '/', element: _jsx(Home, {}) }), _jsx(Route, { path: '/login', element: _jsx(Login, {}) }), _jsx(Route, { path: '/signup', element: _jsx(Signup, {}) }), _jsx(Route, { path: '/contact', element: _jsx(Contact, {}) }), _jsx(Route, { path: '/services', element: _jsx(Services, {}) }), _jsx(Route, { path: '/doctors', element: _jsx(Doctor, {}) }), _jsx(Route, { path: '/doctors/:id', element: _jsx(DoctorDetails, {}) }), _jsx(Route, { path: '*', element: _jsx(NotFound, {}) })] }));
};
export default Routers;
