import React, { useState } from 'react';
import { Eye, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import StarRatings from 'react-star-ratings';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { AliwangwangOutlined, ArrowRightOutlined, SendOutlined } from '@ant-design/icons';

const ReviewSellerTable = ({ orders, onOrderStatusChanged }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contents, setContents] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleOpenModal = (order, isEdit = false) => {
    setCurrentOrder(order);
    setContents((prev) => ({
      ...prev,
      [order.review.sellerReply.id]: order.review.sellerReply ? order.review.sellerReply.content : '',
    }));
    setIsEditing(isEdit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentOrder(null);
    setIsEditing(false);
  };

  const handleContentChange = (orderId, newContent) => {
    setContents((prevContents) => ({
      ...prevContents,
      [orderId]: newContent,
    }));
  };

  const handleSubmitReview = async (order) => {
    const content = contents[order.review.id] || '';

    try {
      await AxiosInterceptor.post(`/api/seller-reply/review/${order.review.id}`, {
        Content: content,
      });
      toast.success('Đánh giá đã được gửi.');
      onOrderStatusChanged(order.review.id);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.reasons) {
        const reasons = error.response.data.reasons;
        if (reasons.length > 0) {
          const reasonMessage = reasons[0].message;
          toast.error(reasonMessage);
        } else {
          toast.error("Thay đổi trạng thái thất bại, vui lòng thử lại");
        }
      }
    }
  };

  const handleUpdateReview = async () => {
    try {
      await AxiosInterceptor.patch(`/api/seller-reply/${currentOrder.review.sellerReply.id}`, {
        Content: contents[currentOrder.review.sellerReply.id],
      });
      toast.success('Đánh giá đã được cập nhật.');
      handleCloseModal();
      onOrderStatusChanged(currentOrder.review.sellerReply.id);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.reasons) {
        const reasons = error.response.data.reasons;
        if (reasons.length > 0) {
          const reasonMessage = reasons[0].message;
          toast.error(reasonMessage);
        } else {
          toast.error("Thay đổi trạng thái thất bại, vui lòng thử lại");
        }
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const isWithinTenMinutes = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - createdAt) / 1000 / 60;
    return diffInMinutes <= 10;
  };
  return (
    <div className="flex flex-col gap-4">
      {currentOrders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex relative">
          <img src={order.thumbnailUrl} alt={order.name} className="w-24 h-24 object-contain rounded mr-4" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{order.name}</h3>
            
            {/* Buyer Review Section */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center ml-4 mb-2">
                <img src={order.review.customer.avatarUrl} alt={order.review.customer.fullName} className="w-10 h-10 rounded-full mr-2" />
                <div>
                  <p className="text-sm font-semibold">{order.review.customer.fullName}</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <StarRatings
                  rating={order.review ? order.review.rating : 0}
                  starRatedColor="gold"
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="2px"
                />
              </div>
              <p className="text-gray-700">{order.review ? order.review.content : 'No review content'}</p>
              <p className="text-gray-500 text-sm">{order.review ? formatDate(order.review.createdAt) : ''}</p>
              
            </div>

        {/* Seller Reply Section */}
        {order.review && (order.review.sellerReply || isWithinTenMinutes(order.review.createdAt)) && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-primary mb-2">Phản hồi từ người bán</h4>
                {order.review.sellerReply === null ? (
                  <div>
                    <textarea
                      value={contents[order.review.id] || ''}
                      onChange={(e) => handleContentChange(order.review.id, e.target.value)}
                      className="w-full h-20 overflow-hidden px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-primary mt-2 resize-none"
                      rows={4}
                      placeholder="Nhập phản hồi của bạn..."
                    />
                    <button
                      onClick={() => handleSubmitReview(order)}
                      className="mt-2 px-4 py-2 bg-primary/80 text-white rounded hover:bg-primary-600"
                    >
                      Gửi phản hồi
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700">{order.review.sellerReply.content}</p>
                    <p className="text-gray-500 text-sm">{formatDate(order.review.sellerReply.createdAt)}</p>
                    <button onClick={() => handleOpenModal(order, true)} className="text-primary/70 hover:text-secondary/80 mt-2 flex items-center">
                      <Edit className="h-5 w-5 absolute top-100 right-4" /> 
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <nav className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Cập nhật phản hồi</h2>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                value={contents[currentOrder.review.sellerReply.id] || ''}
                onChange={(e) => handleContentChange(currentOrder.review.sellerReply.id, e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
              <button onClick={handleUpdateReview} className="px-4 py-2 bg-primary/80 text-white rounded hover:bg-primary-600">Cập nhật</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSellerTable;