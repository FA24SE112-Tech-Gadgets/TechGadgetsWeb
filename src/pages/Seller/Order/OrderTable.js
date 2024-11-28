import { Eye, Copy, Check } from 'lucide-react';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderTableSeller = ({ 
  orders = [], 
  currentPage,
  totalItems,
  pageSize,
  onPageChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const navigate = useNavigate();

  const translateStatus = (status) => {
    const statusMap = {
      Success: "Thành công",
      Cancelled: "Đã hủy",
      Pending: "Đang chờ",
    };
    return statusMap[status] || status;
  };

  const handleCopy = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id).then(() => {
      setCopiedStates((prev) => ({
        ...prev,
        [id]: true,
      }));
      setTimeout(() => {
        setCopiedStates((prev) => ({
          ...prev,
          [id]: false,
        }));
      }, 2000);
    });
  };

  // Pagination component
  const Pagination = () => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex justify-center mt-4">
        <nav className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(number => number >= startPage && number <= endPage)
            .map((number) => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`px-4 py-2 rounded-md ${
                  number === currentPage 
                    ? "bg-primary/70 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {number}
              </button>
            ))}
        </nav>
      </div>
    );
  };

  if (isLoading)
    return (
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
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-2 border-gray-200 table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-sm font-semibold text-center">Mã đơn hàng</th>
            <th className="py-2 px-4 border-b text-sm font-semibold text-center">Tổng số lượng</th>
            <th className="py-2 px-4 border-b text-sm font-semibold text-center">Tổng giá tiền</th>
            <th className="py-2 px-4 border-b text-sm font-semibold text-center">Trạng thái</th>
            <th className="py-2 px-4 border-b text-sm font-semibold text-center">Ngày đặt</th>
            <th className="py-2 px-4 border-b text-sm font-semibold text-center">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="py-2 px-4 border-b text-sm text-center">
                  <div className="flex items-center justify-center bg-gray-50 rounded-md p-2 w-fit mx-auto">
                    <span className="font-medium text-sm mr-2">{order.id}</span>
                    <button
                      onClick={(e) => handleCopy(order.id, e)}
                      className={`p-1 rounded-md transition-colors duration-200 ${
                        copiedStates[order.id]
                          ? 'bg-green-500 text-white'
                          : 'bg-primary/75 text-white hover:bg-secondary/85'
                      }`}
                      aria-label={copiedStates[order.id] ? "Đã sao chép" : "Sao chép mã đơn hàng"}
                    >
                      {copiedStates[order.id] ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-center text-sm">{order.totalQuantity}</td>
                <td className="py-2 px-4 border-b text-center text-sm">
                  <div className="flex flex-col items-center">
                    {order.beforeAppliedDiscountAmount !== order.amount ? (
                      <>
                        <span className="line-through text-gray-500 text-xs">
                          {formatCurrency(order.beforeAppliedDiscountAmount)}
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(order.amount)}
                        </span>
                      </>
                    ) : (
                      <span>{formatCurrency(order.amount)}</span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-center text-sm">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {translateStatus(order.status)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-center text-sm">{formatDate(order.createdAt)}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => navigate(`/order/detail-seller/${order.id}`)}
                    className="text-primary/70 hover:text-secondary/80 transition-colors duration-200"
                  >
                    <Eye className="h-5 w-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                Không có đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalItems > pageSize && <Pagination />}
    </div>
  );
};

export default OrderTableSeller;

