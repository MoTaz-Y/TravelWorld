import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TourDetails from '../pages/TourDetails';
import Tours from '../pages/Tours';
import SearchResult from '../pages/SearchResult';
import ThankYou from '../pages/ThankYou';
import Profile from '../pages/Profile';
import OTPVerification from '../pages/OTPVerification';
import Dashboard from '../pages/Dashboard';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/tours' element={<Tours />} />
      <Route path='/tours/:id' element={<TourDetails />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/verify-otp' element={<OTPVerification />} />
      <Route path='/thank-you' element={<ThankYou />} />
      <Route path='/search' element={<SearchResult />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );
};

export default Router;
