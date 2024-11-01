import React, { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import OrderTable from "./OrderTable";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [page, setPage] = useState(1);           // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  // Fetch orders based on page and status
  const fetchOrders = async (pageNumber = 1, statusFilter = status) => {
    try {
      const response = await AxiosInterceptor.get(`/api/seller-orders`, {
        params: { Page: pageNumber, PageSize: 10, Status: statusFilter },
      });

      const { items, totalCount } = response.data;

      setOrders(items);
      setTotalPages(Math.ceil(totalCount / 10)); // Assuming PageSize is 10
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(page, status);
  }, [page, status]);

  useEffect(() => {
    // Filter orders by the selected status
    setFilteredOrders(orders);
  }, [orders]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to the first page on status change
    fetchOrders(1, newStatus); // Fetch first page of new status
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleStatusChange("Pending")}
          className={`px-4 py-2 rounded ${status === "Pending" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          <ShoppingCart className="inline-block mr-1" /> Pending
        </button>
        <button
          onClick={() => handleStatusChange("Cancelled")}
          className={`px-4 py-2 rounded ${status === "Cancelled" ? "bg-red-500 text-white" : "bg-gray-100"}`}
        >
          <XCircle className="inline-block mr-1" /> Cancelled
        </button>
        <button
          onClick={() => handleStatusChange("Success")}
          className={`px-4 py-2 rounded ${status === "Success" ? "bg-green-500 text-white" : "bg-gray-100"}`}
        >
          <CheckCircle className="inline-block mr-1" /> Success
        </button>
      </div>

      {/* Order Table */}
      <OrderTable orders={filteredOrders} />

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded ${page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
