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
const EmailVerification = lazy(() => import('@/pages/emailVerification'));
const DashboardProtectedRoutes = lazy(
  () => import('@/routes/protectedRoutes/dashboardProtecedRoutes')
);
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const AuthProtectedRoute = lazy(
  () => import('@/routes/protectedRoutes/authProtectedRoute')
);
const MyAccountUser = lazy(
  () => import('@/pages/Dashboard/userAccount/MyAccount')
);
const MyAccountDoctor = lazy(
  () => import('@/pages/Dashboard/doctorAccount/MyAccount')
);
const UserProtectedRoute = lazy(
  () => import('@/routes/protectedRoutes/userProtectedRoute')
);
const DoctorProtectedRoute = lazy(
  () => import('@/routes/protectedRoutes/doctorProtectedRoute')
);

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route element={<DashboardProtectedRoutes />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
      <Route element={<UserProtectedRoute isAllowed={['patient']} />}>
        <Route path='/users/profile/me' element={<MyAccountUser />} />
      </Route>
      <Route element={<DoctorProtectedRoute isAllowed={['doctor']} />}>
        <Route path='/doctors/profile/me' element={<MyAccountDoctor />} />
      </Route>
      <Route element={<AuthProtectedRoute />}>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Route>

      <Route path='/contact' element={<Contact />} />
      <Route path='/services' element={<Services />} />
      <Route path='/doctors' element={<Doctor />} />
      <Route path='/verify-email' element={<EmailVerification />} />
      <Route path='/doctors/:id' element={<DoctorDetails />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
