import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function OrderConfirmation({ selectedItems, cartItemsBySeller, totalPrice, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
    
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Đặt hàng thành công!");
      navigate('/'); 
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Xác nhận đơn hàng</h2>
      
      {Object.entries(selectedItems).map(([sellerId, productIds]) => (
        <div key={sellerId} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            {cartItemsBySeller[sellerId][0]?.seller?.shopName}
          </h3>
          {productIds.map(productId => {
            const item = cartItemsBySeller[sellerId].find(item => item.gadget.id === productId);
            return (
              <div key={productId} className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{item.gadget.name} x {item.quantity}</span>
                <span className="font-medium text-gray-800">
                  ₫{((item.gadget.discountPercentage > 0 ? item.gadget.discountPrice : item.gadget.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      ))}
      
      <div className="flex justify-between items-center text-xl font-bold mb-6">
        <span>Tổng cộng:</span>
        <span className="text-red-600">₫{totalPrice.toLocaleString()}</span>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Hủy
        </button>
        <button
          onClick={handleConfirmOrder}
          disabled={isProcessing}
          className={`px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;
