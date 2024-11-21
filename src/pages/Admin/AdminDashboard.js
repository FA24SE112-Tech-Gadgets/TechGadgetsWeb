import React, { useState, useEffect } from "react";
import { Users, Store, UserCog } from 'lucide-react';
import AxiosInterceptor from "~/components/api/AxiosInterceptor";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    totalSellers: 0,
    totalManagers: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await AxiosInterceptor.get(`/api/users?Page=1&PageSize=100`);
      const users = response.data.items;

      const totalCustomers = users.filter((user) => user.role === "Customer").length;
      const totalSellers = users.filter((user) => user.role === "Seller").length;
      const totalManagers = users.filter((user) => user.role === "Manager").length;

      setStatistics({ totalCustomers, totalSellers, totalManagers });
    } catch (error) {
      console.error("Failed to fetch statistics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
        <div className="h-4 w-4 bg-white rounded-full"></div>
      </div>
      <span className="ml-2 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        Loading...
      </span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg mb-8 p-6">
        <h1 className="text-3xl font-bold mb-6  border-b">Thống kê người dùng</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customers Card */}
          <div className="bg-primary/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary/80">Khách hàng</h3>
              <Users className="w-8 h-8 text-primary/80" />
            </div>
            <p className="text-3xl font-bold text-primary/80">
              {statistics.totalCustomers}
            </p>
          </div>

          {/* Sellers Card */}
          <div className="bg-primary/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary/80">Người bán</h3>
              <Store className="w-8 h-8 text-primary/80" />
            </div>
            <p className="text-3xl font-bold text-primary/80">
              {statistics.totalSellers}
            </p>
          </div>

          {/* Managers Card */}
          <div className="bg-primary/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary/80">Quản lý</h3>
              <UserCog className="w-8 h-8 text-primary/80" />
            </div>
            <p className="text-3xl font-bold text-primary/80">
              {statistics.totalManagers}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
