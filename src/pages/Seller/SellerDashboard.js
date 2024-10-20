import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { FileText, Clock } from 'lucide-react';
import SellerApplication from './SellerApplication';
import HistorySellerApplication from './HistorySellerApplication';

const SellerDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Mục Lục</h2>
        </div>
        <nav className="mt-4">
          <NavLink
            to="/seller-application"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 ${
                isActive ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`
            }
            end
          >
            <FileText className="mr-3 h-5 w-5" />
            Mục đăng ký đơn
          </NavLink>
          <NavLink
            to="/history-seller-application"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 ${
                isActive ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`
            }
          >
            <Clock className="mr-3 h-5 w-5" />
            Lịch sử đăng ký đơn
          </NavLink>
        </nav>
      </div>

    </div>
  );
};

export default SellerDashboard;