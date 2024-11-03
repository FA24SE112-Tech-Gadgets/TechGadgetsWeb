import { HomeOutlined, InfoCircleOutlined, MoneyCollectOutlined, NumberOutlined, PhoneOutlined, UserOutlined, WalletOutlined } from "@ant-design/icons";
import { DateRangeOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { Eye, EyeIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import slugify from "~/ultis/config";

const OrderTableSeller = ({ orders: initialOrders = [], onOrderStatusChanged }) => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState(initialOrders);
    const [orderInfo, setOrderInfo] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);


    useEffect(() => {
        setOrders(initialOrders);
        setTotalOrders(initialOrders.length);
        // Reset to first page when orders change
        setCurrentPage(1);
    }, [initialOrders]);


    // Calculate pagination values
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await AxiosInterceptor.get(`/api/seller-order/${orderId}/items`);
            setOrderDetails(prev => ({
                ...prev,
                [orderId]: response.data.items
            }));
        } catch (error) {
            console.error(`Error fetching details for order ${orderId}:`, error);
            toast.error("Không thể tải thông tin đơn hàng");
        }
    };

    const handleOpenDetails = async (orderId) => {
        setSelectedOrderId(orderId);
        if (!orderDetails[orderId]) {
            await fetchOrderDetails(orderId);
        }
        setShowDetailsModal(true);
    };
    useEffect(() => {
        if (!showDetailsModal) {
            setCancelReason("");
        }
    }, [showDetailsModal]);

    useEffect(() => {
        const fetchOrderInfo = async () => {
            if (selectedOrderId) {
                try {
                    const response = await AxiosInterceptor.get(`/api/seller-orders/${selectedOrderId}`);
                    setOrderInfo(response.data);
                } catch (error) {
                    console.error('Error fetching order info:', error);
                }
            }
        };

        fetchOrderInfo();
    }, [selectedOrderId]);
    const handleConfirmOrder = async (orderId) => {
        try {
            setIsLoading(true);
            await AxiosInterceptor.put(`/api/seller-order/${orderId}/confirm`);

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: "Success" }
                        : order
                )
            );

            toast.success("Xác nhận đơn hàng thành công");

            if (onOrderStatusChanged) {
                onOrderStatusChanged(orderId, "Success");
            }

            setShowDetailsModal(false);
        } catch (error) {
            const errorMessage = error.response?.data?.reasons?.[0]?.message ||
                "Xác nhận đơn hàng thất bại, vui lòng thử lại";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const openCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            toast.error("Vui lòng điền lý do hủy");
            return;
        }

        try {
            setIsLoading(true);
            await AxiosInterceptor.put(`/api/seller-order/${selectedOrderId}/cancel`, {
                reason: cancelReason.trim(),
            });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === selectedOrderId
                        ? { ...order, status: "Cancelled" }
                        : order
                )
            );

            setShowCancelModal(false);
            setShowDetailsModal(false);
            setCancelReason("");

            toast.success("Hủy đơn hàng thành công");

            if (onOrderStatusChanged) {
                onOrderStatusChanged(selectedOrderId, "Cancelled");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.reasons?.[0]?.message ||
                "Hủy đơn hàng thất bại, vui lòng thử lại";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const translateStatus = (status) => {
        const statusMap = {
            "Success": "Thành công",
            "Cancelled": "Đã hủy",
            "Pending": "Đang chờ",
        };
        return statusMap[status] || status;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination component
    const Pagination = () => {
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return (
            <div className="mt-4">
                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <nav className="flex items-center space-x-2">

                        {/* Page Numbers */}
                        {Array.from({ length: Math.ceil(totalPages) }, (_, index) => index + 1)
                            .filter(number => number >= startPage && number <= endPage) // Ensure the buttons are displayed within the calculated range
                            .map((number) => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`px-4 py-2 rounded-md ${number === currentPage ? 'bg-primary/70 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {number}
                                </button>
                            ))}


                    </nav>
                </div>

            </div>
        );
    };
    if (isLoading) return (
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

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-2 border-gray-200  table-fixed">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-sm">Mã đơn hàng</th>
                        <th className="py-2 px-4 border-b text-sm">Tổng giá tiền</th>
                        <th className="py-2 px-4 border-b text-sm">Trạng thái</th>
                        <th className="py-2 px-4 border-b text-sm">Ngày đặt</th>
                        <th className="py-2 px-4 border-b text-sm"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.length > 0 ? (
                        currentOrders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 cursor-pointer"

                            >
                                <td className="py-2 px-4 border-b text-center text-sm">{order.id}</td>
                                <td className="py-2 px-4 border-b text-center text-sm">
                                    {order.amount?.toLocaleString()}đ
                                </td>
                                <td className="py-2 px-4 border-b text-center text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
        ${order.status === 'Success' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {order.status === 'Success' ? 'Thành công' :
                                            order.status === 'Pending' ? 'Đang chờ' :
                                                order.status === 'Cancelled' ? 'Đã hủy' :
                                                    order.status}
                                    </span>
                                </td>

                                <td className="py-2 px-4 border-b text-center text-sm">
                                    {order.createdAt && new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleOpenDetails(order.id)}
                                        className="text-primary/70 hover:text-secondary/80"
                                    >
                                        <Eye className="h-5 w-5 items-center" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="py-2 text-center">
                                Không có đơn hàng nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Show pagination only if there are more orders than ordersPerPage */}
            {orders.length > ordersPerPage && <Pagination />}

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto" onClick={() => setShowDetailsModal(false)}>
                    <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl m-4">
                        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Chi tiết đơn hàng #{selectedOrderId}
                            </h2>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto h-[calc(250px-60px)] p-6">
                            {orderDetails[selectedOrderId]?.map((item) => (
                                <div key={item.sellerOrderItemId} className="border dark:border-gray-700 rounded-lg overflow-hidden mb-4 transition-all duration-200 ease-in-out">
                                    <div className="flex items-center space-x-4 p-4">
                                        <img
                                            src={item.thumbnailUrl}
                                            alt={item.name}
                                            className="w-24 h-20 object-contain rounded-md"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {item.quantity} x {item.price.toLocaleString()}đ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {orderInfo && (
                         <div className="p-6 flex border-t border-gray-200 dark:border-gray-700">
                         {/* Customer Info Section */}
                         <div className="flex-grow pr-6">
                             <h3 className="font-semibold flex items-center text-lg mb-4">
                                 Thông tin khách hàng
                                 <UserOutlined className="mr-2 text-xl text-primary/80" />
                             </h3>
                             <div className="flex items-center mb-2">
                                 <InfoCircleOutlined className="mr-2 text-primary/80" />
                                 <p className="text-gray-700 dark:text-gray-300">Tên: {orderInfo.customerInfo.fullName}</p>
                             </div>
                             <div className="flex items-center mb-2">
                                 <HomeOutlined className="mr-2 text-primary/80" />
                                 <p className="text-gray-700 dark:text-gray-300">Địa chỉ: {orderInfo.customerInfo.address}</p>
                             </div>
                             <div className="flex items-center mb-2">
                                 <PhoneOutlined className="mr-2 text-primary/80" />
                                 <p className="text-gray-700 dark:text-gray-300">Số điện thoại: {orderInfo.customerInfo.phoneNumber}</p>
                             </div>
                         </div>
                     
                         {/* Order Info Section */}
                         <div className="flex-grow">
                             <h3 className="font-semibold flex items-center text-lg mb-4">
                                 Thông tin đơn hàng
                                 <ShoppingCartOutlined className="mr-2 text-xl text-primary/80" />
                             </h3>
                             <div className="flex items-center mb-2">
                                 <NumberOutlined className="mr-2 text-primary/80" />
                                 <p className="text-gray-700 dark:text-gray-300">Tổng số lượng: {orderInfo.totalQuantity}</p>
                             </div>
                             <div className="flex items-center mb-2">
                                 <MoneyCollectOutlined className="mr-2 text-primary/80" />
                                 <p className="text-gray-700 dark:text-gray-300">Tổng số tiền: {orderInfo.totalAmount.toLocaleString()}đ</p>
                             </div>
                             <div className="flex items-center mb-2">
                                 <WalletOutlined className="mr-2 text-primary/80" />
                                 <p className="text-gray-700 dark:text-gray-300">Phương thức thanh toán: {orderInfo.paymentMethod}</p>
                             </div>
                             <div className="flex items-center mb-2">
                             <DateRangeOutlined className="mr-2 text-primary/80 text-sm" />


                                 <p className="text-gray-700 dark:text-gray-300">Ngày tạo đơn hàng: {new Date(orderInfo.sellerOrderCreatedAt).toLocaleString()}</p>
                             </div>
                         </div>
                     </div>
                     
                        )}

                        {orders.find(o => o.id === selectedOrderId)?.status === "Pending" && (
                            <div onClick={e => e.stopPropagation()} className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfirmOrder(selectedOrderId);
                                    }}
                                    className="bg-blue-500 text-white rounded px-4 py-2 mr-2 hover:bg-blue-600 transition"
                                    disabled={isLoading}
                                >
                                    Xác nhận đơn hàng
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openCancelModal(selectedOrderId);
                                    }}
                                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
                                >
                                    Hủy đơn hàng
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            )}

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-[400px] m-4">
                        <div className="p-6 border-b dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Hủy đơn hàng #{selectedOrderId}
                            </h2>
                        </div>
                        <div className="p-6">
                            <textarea
                                placeholder="Lý do hủy"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full h-24 border rounded p-2 dark:border-gray-700"
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleCancelOrder}
                                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                                    disabled={isLoading}
                                >
                                    Xác nhận hủy
                                </button>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="ml-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTableSeller;
