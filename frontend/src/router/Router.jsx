import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Tours from '../pages/Tours';
import TourDetails from '../pages/TourDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SearchResult from '../pages/SearchResult';
import ThankYou from '../pages/ThankYou';
import Profile from '../pages/Profile';

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='tours' element={<Tours />} />
      <Route path='tours/:id' element={<TourDetails />} />
      <Route path='/thank-you' element={<ThankYou />} />
      <Route path='tours/search' element={<SearchResult />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='*' element={<Navigate to='/home' />} />
    </Routes>
  );
};

export default Routers;
