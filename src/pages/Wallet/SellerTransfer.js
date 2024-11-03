import React, { useState, useEffect } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export default function SellerTransfer() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10); 
  const [sortByDate, setSortByDate] = useState('DESC'); 

  const fetchDeposits = async () => {
    try {
      const response = await AxiosInterceptor.get(`/api/wallet-trackings?SortByDate=${sortByDate}&Page=${currentPage}&PageSize=${pageSize}`);
      console.log('day ne', response.data);
      
      
      setDeposits(Array.isArray(response.data.items) ? response.data.items : []);
      setTotalItems(response.data.totalItems || 0); 
      setLoading(false);
    } catch (err) {
      setError('Không thể lấy lịch sử nạp tiền');
      setLoading(false);
      toast.error('Không thể lấy lịch sử nạp tiền');
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [currentPage, sortByDate]); 

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage); 
  };

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

  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  const totalPages = Math.ceil(totalItems / pageSize); 

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lịch Sử Giao Dịch</h2>

      </div>
      {/* Thêm dropdown để sắp xếp */}
      <div className="mb-4">
        <label htmlFor="sort-by-date" className="text-sm font-medium text-gray-700 mr-3">Sắp xếp theo ngày</label>
        <select
          id="sort-by-date"
          value={sortByDate}
          onChange={(e) => {
            setSortByDate(e.target.value);
            setCurrentPage(1); 
          }}
          className="w-full sm:w-[180px] px-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
        >
          <option value="DESC">Mới nhất</option>
          <option value="ASC">Cũ nhất</option>
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {deposits.length === 0 ? ( // Kiểm tra length của deposits
          <div className="text-center p-6">
            <p className="text-gray-500">Bạn chưa có lịch sử giao dịch nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[ 'Số tiền', 'Trạng thái', 'Ngày tạo giao dịch'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(deposit.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        deposit.status === 'Success' ? 'bg-green-100 text-green-800' :
                        deposit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        deposit.status === 'Expired' ? 'bg-red-100 text-red-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {deposit.status === 'Success' ? 'Thành công' :
                         deposit.status === 'Pending' ? 'Đang chờ' :
                         deposit.status === 'Expired' ? 'Đã hết hạn' :
                         deposit.status === 'Cancelled' ? 'Đã hủy' :
                         deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      {formatDate(deposit.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <nav className="flex items-center space-x-2">
          {Array.from({ length: Math.ceil(totalItems / pageSize) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleChangePage(i + 1)}
              className={`px-4 py-2 rounded-md ${i + 1 === currentPage ? 'bg-primary/70 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>

      <ToastContainer />
    </div>
  );
}