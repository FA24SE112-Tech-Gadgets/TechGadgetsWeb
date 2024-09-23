import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '~/pages/Admin/Sidebar';


const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
   <Sidebar/>
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
