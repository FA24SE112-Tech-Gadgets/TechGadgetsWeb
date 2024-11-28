// orderId = sellerorderId 
import { HomeOutlined, PhoneOutlined } from "@ant-design/icons";
import { Eye, Store } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import slugify from "~/ultis/config";

const OrderTable = ({ 
  orders, 
  onOrderCancelled, 
  currentPage, 
  setCurrentPage, 
  totalItems, 
  pageSize 
}) => {
  // Remove local pagination states and logic
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const [copiedStates, setCopiedStates] = useState({});

  // Function to open the cancel modal and set the selected order ID
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  // Function to handle the cancel request
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error("Vui lòng điền lý do hủy!!");
      return;
    }
    try {
      await AxiosInterceptor.put(`/api/seller-order/${selectedOrderId}/cancel`, {
        reason: cancelReason,
      });
      setShowCancelModal(false);
      setCancelReason("");
      toast.success("Bạn đã hủy đơn thành công!!");

      // Thêm phần này để update trạng thái của order
      if (onOrderCancelled) {
        onOrderCancelled(selectedOrderId);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.reasons) {
        const reasons = error.response.data.reasons;

        // Display the message from the first reason
        if (reasons.length > 0) {
          const reasonMessage = reasons[0].message;
          toast.error(reasonMessage);
        } else {
          toast.error("Thay đổi trạng thái thất bại, vui lòng thử lại");
        }
      }
    }
  };

  useEffect(() => {
    if (!showCancelModal) {
      setCancelReason(""); // Clear reason when modal is closed
    }
  }, [showCancelModal]);

  const handleOrderClick = (orderId) => {
    navigate(`/order/detail/${orderId}`);
  };

  const hasPendingOrders = orders.some((order) => order.status === "Pending");
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id).then(() => {
      setCopiedStates((prev) => ({
        ...prev,
        [id]: true, // Đánh dấu giao dịch cụ thể là đã sao chép
      }));
      setTimeout(() => {
        setCopiedStates((prev) => ({
          ...prev,
          [id]: false, // Reset trạng thái sau 2 giây
        }));
      }, 2000);
    });
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-6 mx-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            {/* Order Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <p>Mã đơn hàng:</p>
                  <span className="font-medium text-gray-800">{order.id}</span>
                  <button
                      onClick={(e) => handleCopy(order.id, e)}
                      className="ml-2 px-2 py-1 text-sm text-primary/50 hover:text-secondary/80 hover:underline focus:outline-none"
                    >
                      {copiedStates[order.id] ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full 
                    ${order.status === "Success" ? "bg-green-100 text-green-800"
                      : order.status === "Pending" ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"}`}
                >
                  {order.status === "Success" ? "Thành công"
                    : order.status === "Pending" ? "Đang chờ"
                      : order.status === "Cancelled" ? "Đã hủy"
                        : order.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Ngày đặt: {formatDate(order.createdAt)}
              </div>
            </div>

            {/* Products List */}
            <div className="p-4">
              {order.gadgets.map((gadget) => (
                <div
                  key={gadget.sellerOrderItemId}
                  onClick={() => navigate(`/gadget/detail/${slugify(gadget.name)}`, {
                    state: { productId: gadget.gadgetId }
                  })}
                  className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2"
                >
                  <div className="relative w-16 h-16">
                    <img
                      src={gadget.thumbnailUrl}
                      alt={gadget.name}
                      className="w-full h-full object-contain rounded"
                    />
                    <span className="absolute bottom-0 right-0 bg-gray-800/75 text-white px-1.5 py-0.5 text-xs rounded-tl">
                      x{gadget.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{gadget.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>Được cung cấp bởi: </span>
                          <Store className="h-4 w-4" />
                          <span>{order.sellerInfo.shopName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {gadget.discountPercentage > 0 ? (
                          <div className="flex flex-col items-end gap-1">
                            
                            <div className="flex items-center gap-2">
                           
                              <span className="text-red-500 font-medium">
                                {gadget.discountPrice.toLocaleString()}₫
                              </span>
                              <span className="line-through text-gray-400 text-sm">
                                {gadget.price.toLocaleString()}₫
                              </span>
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                              -{gadget.discountPercentage}%
                            </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-gray-700">
                              {gadget.price.toLocaleString()}₫
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex flex-col items-end gap-2">
                <div className="text-gray-700">
                  Tổng tiền: <span className="font-semibold text-lg">{order.amount.toLocaleString()}₫</span>
                </div>
                <button
                  onClick={() => handleOrderClick(order.id)}
                  className="flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-200"
                >
                  <Eye className="h-5 w-5" />
                  <span>Chi tiết</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Updated Pagination Controls */}
      <div className="mt-4">
        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-2">
            {(() => {
              const maxVisiblePages = 5;
              const totalPages = Math.ceil(totalItems / pageSize);
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }

              return Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(number => number >= startPage && number <= endPage)
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-4 py-2 rounded-md ${
                      number === currentPage 
                        ? "bg-primary/70 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                ));
            })()}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;