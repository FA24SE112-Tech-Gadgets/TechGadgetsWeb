import { HomeOutlined, PhoneOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import slugify from "~/ultis/config";

const OrderTable = ({ orders, onOrderCancelled }) => {
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Function to open the modal and set the selected order ID
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };
  const navigate = useNavigate();
  // Function to handle the cancel request
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error("Vui lòng điền lý do hủy!!")
      return;
    }
    try {
      await AxiosInterceptor.put(`/api/seller-order/${selectedOrderId}/cancel`, {
        reason: cancelReason,
      });
      setShowModal(false);
      setCancelReason("");
      toast.success("Bạn đã hủy đơn thành công!!")

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
    if (!showModal) {
      setCancelReason(""); // Clear reason when modal is closed
    }
  }, [showModal]);
  // Group orders by seller
  const ordersBySeller = orders.reduce((acc, order) => {
    const { shopName } = order.sellerInfo;
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push(order);
    return acc;
  }, {});

  const hasPendingOrders = orders.some(order => order.status === "Pending");

  const translateStatus = (status) => {
    switch (status) {
      case "Success":
        return "Thành công";
      case "Cancelled":
        return "Thất bại";
      case "Pending":
        return "Đang chờ";
      default:
        return status;
    }
  };
  return (
    <div className="overflow-x-auto">
      {Object.keys(ordersBySeller).map((shopName) => (
        <div key={shopName} className="mb-8 border border-gray-200 p-4 rounded-lg">
          {/* Seller Info Header */}
          <div className="mb-4">
            <h2 className="text-lg font-bold">{shopName}</h2>
            <div className="flex items-center mt-2">
              <HomeOutlined />
              <p className="text-gray-600 ml-2">Địa chỉ: {ordersBySeller[shopName][0].sellerInfo.shopAddress}</p>
            </div>
            <div className="flex items-center mt-2">
              <PhoneOutlined />
              <p className="ml-2 text-gray-600">SĐT: {ordersBySeller[shopName][0].sellerInfo.phoneNumber}</p>
            </div>
          </div>

          {/* Orders Table for each seller */}
          <table className="min-w-full bg-white border border-gray-200 table-fixed">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b w-1/4">Sản phẩm</th>
                <th className="py-2 px-4 border-b w-1/4">Tổng giá tiền</th>
                <th className="py-2 px-4 border-b w-1/4">Trạng thái</th>
                <th className="py-2 px-4 border-b w-1/4">Ngày đặt</th>
                {hasPendingOrders && <th className="py-2 px-4 border-b w-1/4">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {ordersBySeller[shopName].map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50"
                  onClick={(e) => {
                    if (!e.target.closest('button')) {
                      navigate(`/gadget/detail/${slugify(order.gadgets[0].name)}`, {
                        state: { productId: order.gadgets[0].gadgetId },
                      });
                    }
                  }}
                >
                  {/* Products Column */}
                  <td className="py-2 px-4 border-b">
                    {order.gadgets.map((gadget) => (
                      <div key={gadget.sellerOrderItemId} className="flex items-center space-x-4 py-2">
                        <img
                          src={gadget.thumbnailUrl}
                          alt={gadget.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{gadget.name}</p>
                          <p className="text-gray-600">
                            {gadget.quantity} x {gadget.price.toLocaleString()}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </td>

                  {/* Total Amount Column */}
                  <td className="py-2 px-4 border-b text-center">{order.amount.toLocaleString()}₫</td>

                  {/* Status Column */}
                  <td className="py-2 px-4 border-b text-center">{translateStatus(order.status)}</td>


                  {/* Order Date Column */}
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>

                  {/* Actions Column */}
                  {hasPendingOrders && (
                    <td className="py-2 px-4 border-b text-center">
                      {order.status === "Pending" && (
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => openCancelModal(order.id)}
                        >
                          Hủy
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}

      {/* Cancel Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Hủy đơn hàng</h2>
            <p className="text-gray-700 mb-4">Vui lòng nhập lý do hủy :</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows="4"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do ở đây..."
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleCancelOrder}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
