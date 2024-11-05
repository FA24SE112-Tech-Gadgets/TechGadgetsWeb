import React, { useState } from 'react';
import { Eye, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import StarRatings from 'react-star-ratings';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { AliwangwangOutlined, ArrowRightOutlined, SendOutlined } from '@ant-design/icons';

const ReviewTable = ({ orders, onOrderStatusChanged }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ratings, setRatings] = useState({});
  const [contents, setContents] = useState({});

  const handleOpenModal = (order, isEdit = false) => {
    setCurrentOrder(order);
    setRatings((prev) => ({
      ...prev,
      [order.id]: order.review ? order.review.rating : 0,
    }));
    setContents((prev) => (prev[order.id] ? prev : {
      ...prev,
      [order.id]: order.review ? order.review.content : '',
    }));
    setIsEditing(isEdit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentOrder(null);
    setIsEditing(false);
  };

  const handleRatingChange = (orderId, newRating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [orderId]: newRating,
    }));
  };

  const handleContentChange = (orderId, newContent) => {
    setContents((prevContents) => ({
      ...prevContents,
      [orderId]: newContent,
    }));
  };

  const handleSubmitReview = async (order) => {
    const rating = ratings[order.sellerOrderItemId] || 0;
    const content = contents[order.sellerOrderItemId] || '';

    if (rating < 0 || rating > 5 || content.trim() === '') {
      toast.error('Rating phải từ 0 đến 5 và nội dung không được để trống.');
      return;
    }

    try {
      await AxiosInterceptor.post(`/api/review/seller-order-item/${order.sellerOrderItemId}`, {
        Rating: rating,
        Content: content,
      });
      toast.success('Đánh giá đã được gửi.');
      onOrderStatusChanged(order.sellerOrderItemId);
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
    if (ratings[currentOrder.id] < 0 || ratings[currentOrder.id] > 5 || contents[currentOrder.id].trim() === '') {
      toast.error('Rating phải từ 0 đến 5 và nội dung không được để trống.');
      return;
    }

    try {
      await AxiosInterceptor.patch(`/api/review/${currentOrder.review.id}`, {
        Rating: ratings[currentOrder.id],
        Content: contents[currentOrder.id],
      });
      toast.success('Đánh giá đã được cập nhật.');
      handleCloseModal();
      onOrderStatusChanged(currentOrder.sellerOrderItemId);
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

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex relative">
          <img src={order.thumbnailUrl} alt={order.name} className="w-24 h-24 object-contain rounded mr-4" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{order.name}</h3>
            {order.review === null ? (
              <div>
                <StarRatings
                  rating={ratings[order.sellerOrderItemId] || 0}
                  starRatedColor="#ffd700"
                  changeRating={(newRating) => handleRatingChange(order.sellerOrderItemId, newRating)}
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="2px"
                />
                <div className="flex items-start">
                <AliwangwangOutlined />
                  <div className="relative w-full h-10">
                    <textarea
                      value={contents[order.sellerOrderItemId] || ''}
                      onChange={(e) => handleContentChange(order.sellerOrderItemId, e.target.value)}
                      className="w-full h-8 overflow-hidden px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-primary mt-2 resize-none"
                      rows={4} // Adjust number of rows as needed
                      placeholder="Enter your review..."
                    />
                    <button
                      onClick={() => handleSubmitReview(order)}
                      className="absolute top-4 right-3 text-primary bg-transparent hover:text-secondary/80"
                    >
                      <SendOutlined  className="text-lg" />
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div>
                <StarRatings
                  rating={order.review.rating}
                  starRatedColor="#ffd700"
                  numberOfStars={5}
                  starDimension="24px"
                  starSpacing="2px"
                />
                <p className="mt-2 text-gray-700">{order.review.content}</p>
                <p className="mt-2 text-gray-500 text-sm">{formatDate(order.review.createdAt)}</p>
                <button onClick={() => handleOpenModal(order, true)} className="text-primary/70 hover:text-secondary/80 mt-2">
                  <Edit className="h-5 w-5 absolute top-4 right-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Cập nhật đánh giá</h2>
            <div className="mb-4">
              <StarRatings
                rating={ratings[currentOrder.id] || 0}
                starRatedColor="#ffd700"
                changeRating={(newRating) => handleRatingChange(currentOrder.id, newRating)}
                numberOfStars={5}
                starDimension="24px"
                starSpacing="2px"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                value={contents[currentOrder.id] || ''}
                onChange={(e) => handleContentChange(currentOrder.id, e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
              <button onClick={handleUpdateReview} className="px-4 py-2 bg-primary/80 text-white rounded hover:bg-primary/50">Cập nhật</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
