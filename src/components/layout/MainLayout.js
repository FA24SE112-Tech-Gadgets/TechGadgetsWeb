import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import PublicRoute from '../auth/PublicRoute';

const MainLayout = () => {
  return (
    <PublicRoute>
    <div >
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
    </PublicRoute>
  );
};

export default MainLayout;
