import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '~/pages/Admin/Sidebar';
import RoleBaseRoute from '../auth/RoleBaseRoute';
const AdminLayout = () => {
  return (
    <RoleBaseRoute accessibleRoles={['Admin']}>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Outlet /> 
        </div>
      </div>
    </RoleBaseRoute>
  );
};

export default AdminLayout;
