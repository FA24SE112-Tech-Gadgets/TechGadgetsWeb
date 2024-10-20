import React, { useState, useEffect } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { Eye } from 'lucide-react';
import DetailApplication from './DetailApplication';
import { toast } from "react-toastify";

const HistorySellerApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === "development"
          ? `${process.env.REACT_APP_DEV_API}/api/seller-applications`
          : `${process.env.REACT_APP_PRO_API}/api/seller-applications`;

        const response = await AxiosInterceptor.get(baseUrl);
        setApplications(response.data.items);
        setLoading(false);
      } catch (err) {
        setError('Không thể lấy danh sách đơn đăng ký');
        setLoading(false);
        toast.error('Không thể lấy danh sách đơn đăng ký');
      }
    };

    fetchApplications();
  }, []);

  const handleViewDetails = async (id) => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/seller-applications`
        : `${process.env.REACT_APP_PRO_API}/api/seller-applications`;

      const response = await AxiosInterceptor.get(`${baseUrl}/${id}`);
      setSelectedApplication(response.data);
      setIsPopupOpen(true);
    } catch (err) {
      console.error('Không thể lấy chi tiết đơn đăng ký', err);
      toast.error('Không thể lấy chi tiết đơn đăng ký');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="w-7 h-7 bg-gradient-to-tr from-indigo-600 to-pink-600 rounded-full flex items-center justify-center animate-spin">
      <div className="h-4 w-4 bg-white rounded-full"></div>
    </div>
    <span className="ml-2 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
      Loading...
    </span>
  </div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Lịch Sử Đơn Đăng Ký</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {applications.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-gray-500">Bạn chưa có đơn nào chờ xét duyệt</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Cửa Hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Hình Kinh Doanh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{app.shopName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.businessModel === 'BusinessHousehold' ? 'Hộ Kinh Doanh' :
                      app.businessModel === 'Personal' ? 'Cá Nhân' :
                        app.businessModel === 'Company' ? 'Công Ty' : app.businessModel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {app.status === 'Pending' ? 'Đang Chờ' : app.status === 'Approved' ? 'Đã Duyệt' : 'Bị Từ Chối'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(app.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center items-center">
                    <button
                      onClick={() => handleViewDetails(app.id)}
                      className="text-primary/70 hover:text-secondary/80"
                    >
                      <Eye className="h-5 w-5 items-center" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isPopupOpen && selectedApplication && (
        <DetailApplication
          application={selectedApplication}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default HistorySellerApplication;
