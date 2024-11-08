import React, { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle } from "lucide-react";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import { toast, ToastContainer } from "react-toastify";
import ReviewSellerTable from "./ReviewSellerTable";

const ReviewSeller = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("NotReply");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByDate, setSortByDate] = useState('DESC');

  const fetchOrders = async (pageNumber = 1, statusFilter = status) => {
    try {
      const response = await AxiosInterceptor.get(`/api/reviews/seller-order-items?FilterBy=${statusFilter}&SortByDate=${sortByDate}`, {
        params: { Page: pageNumber, PageSize: 100 },
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
  }, [page, status, sortByDate]);

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
    setOrders((prevOrders) => prevOrders.filter((order) => order.review.id !== orderId));
    setFilteredOrders((prevFilteredOrders) => prevFilteredOrders.filter((order) => order.review.id !== orderId));
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-indigo-900 dark:text-white ">
          Đánh giá của bạn
      </h1>
      <div className="flex justify-between items-center mb-6">
        <div className="mb-4">
          <label htmlFor="sort-by-date" className="text-sm font-medium text-gray-700 mr-3">Sắp xếp theo ngày</label>
          <select
            id="sort-by-date"
            value={sortByDate}
            onChange={(e) => {
              setSortByDate(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-[180px] px-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
          >
            <option value="DESC">Mới nhất</option>
            <option value="ASC">Cũ nhất</option>
          </select>
        </div>
        <div className="flex space-x-4 mb-6 justify-end">
          <button
            onClick={() => handleStatusChange("NotReply")}
            className={`px-4 py-2 rounded ${status === "NotReply" ? "bg-primary/80 text-white" : "bg-gray-100"}`}
          >
            <ShoppingCart className="inline-block mr-2" /> Chưa trả lời
          </button>
          <button
            onClick={() => handleStatusChange("Replied")}
            className={`px-4 py-2 rounded ${status === "Replied" ? "bg-green-500 text-white" : "bg-gray-100"}`}
          >
            <CheckCircle className="inline-block mr-2" /> Đã trả lời
          </button>
        </div>
      </div>
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
      ) : (
        <ReviewSellerTable orders={filteredOrders} onOrderStatusChanged={handleOrderStatus} />
      )}
    </div>
  );
};

export default ReviewSeller;