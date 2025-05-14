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
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/services' element={<Services />} />
      <Route path='/doctors' element={<Doctor />} />
      <Route path='/doctors/:id' element={<DoctorDetails />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
