import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerDashboard from '~/pages/Seller/SellerDashboard';
import SellerHeader from '~/pages/Seller/SellerHeader';

const SellerApplicationLayout = () => {
    return (

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
           
            <div style={{ display: 'flex', flex: 1 }}>
                <SellerDashboard />
                <div style={{ flex: 1, padding: '20px' }}>
                    <Outlet />
                </div>
                </div>
            </div>
          

    );
};

export default SellerApplicationLayout;
