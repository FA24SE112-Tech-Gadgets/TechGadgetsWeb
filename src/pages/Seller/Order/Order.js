import React, { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";

import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import { toast, ToastContainer } from "react-toastify";
import OrderTableSeller from "./OrderTable";

const OrderHistorySeller = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (pageNumber = 1, statusFilter = status) => {
    try {
      const response = await AxiosInterceptor.get(`/api/seller-orders`, {
        params: { Page: pageNumber, PageSize: 100, Status: statusFilter },
      });

      const { items, totalCount } = response.data;
      console.log("data seller", response.data);

      setOrders(items);
      setTotalPages(Math.ceil(totalCount / 10));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.reasons) {
        const reasons = error.response.data.reasons;
        if (reasons.length > 0) {
          const reasonMessage = reasons[0].message;
          toast.error(reasonMessage);
        } else {
          toast.error("Có lỗi xảy ra vui lòng thử lại ");
        }
      }
    }
  };

  useEffect(() => {
    fetchOrders(page, status);
  }, [page, status]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
    fetchOrders(1, newStatus);
  };

  const handleOrderStatus = (orderId) => {
    // Update orders and filteredOrders state to remove the cancelled order
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    setFilteredOrders((prevFilteredOrders) => prevFilteredOrders.filter((order) => order.id !== orderId));
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex space-x-4 mb-6 justify-end">
        <button
          onClick={() => handleStatusChange("Pending")}
          className={`px-4 py-2 rounded ${status === "Pending" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          <ShoppingCart className="inline-block mr-2" /> Đang chờ
        </button>
        <button
          onClick={() => handleStatusChange("Success")}
          className={`px-4 py-2 rounded ${status === "Success" ? "bg-green-500 text-white" : "bg-gray-100"}`}
        >
          <CheckCircle className="inline-block mr-2" /> Thành công
        </button>
        <button
          onClick={() => handleStatusChange("Cancelled")}
          className={`px-4 py-2 rounded ${status === "Cancelled" ? "bg-red-500 text-white" : "bg-gray-100"}`}
        >
          <XCircle className="inline-block mr-2" /> Dã hủy
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
      ) : (
        <OrderTableSeller orders={filteredOrders} onOrderStatusChanged={handleOrderStatus} />
      )}
    </div>
  );
};

export default OrderHistorySeller;
