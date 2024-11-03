import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '~/context/auth/useAuth';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { toast, ToastContainer } from 'react-toastify';
import { Breadcrumb } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons';


const OrderConfirmation = ({ product, quantity, totalPrice, onCancel }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const navigate = useNavigate();
    const popupRef = useRef(null);

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            // If the click is outside the popup, call onCancel
            onCancel();
        }
    };

    useEffect(() => {
        // Add event listener for clicks
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleConfirmOrder = async () => {
        setIsProcessing(true);
        try {
            const response = await AxiosInterceptor.post("/api/order/now", {
                gadgetId: product.id,
                quantity,
            });
            setOrderSuccess(true);
            console.log("Buy success", response);
            // toast.success("Mua sản phẩm thành công");
        } catch (error) {
            console.error("Error placing order:", error);
            if (error.response && error.response.data && error.response.data.reasons) {
                const reasons = error.response.data.reasons;

                // Display the message from the first reason
                if (reasons.length > 0) {
                    const reasonMessage = reasons[0].message;
                    toast.error(reasonMessage);
                } else {
                    toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
                }
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div ref={popupRef} className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <CheckCircleOutlined className="text-green-500 text-8xl mb-6" />
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Đặt hàng thành công!</h2>
                    <p className="text-gray-600 mb-8">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full px-6 py-3 bg-primary/80 hover:bg-secondary/90 text-white rounded-lg transition duration-200 font-semibold"
                        >
                            Về trang Chủ
                        </button>
                        <button
                            onClick={() => navigate('/orderHistory')}
                            className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
                        >
                            Xem Lịch Sử Đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    <ShoppingCartOutlined className="text-5xl text-primary" /> Xác nhận đơn hàng
                </h2>

                <div className="mb-6 border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center flex-grow mr-4">
                            <img src={product.thumbnailUrl} alt={product.name} className="w-12 h-12 object-contain mr-2" />
                            <span className="text-gray-600">{product.name} x {quantity}</span>
                        </div>
                        <span className="font-medium text-gray-800 ml-4">
                            {totalPrice.toLocaleString()}₫
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center text-xl font-bold mb-6">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">{totalPrice.toLocaleString()}₫</span>
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
                        className={`px-6 py-2 bg-primary/80 hover:bg-secondary/90 text-white rounded-lg transition duration-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isProcessing ? <LoadingOutlined /> : 'Thanh toán'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const DetailGadgetPage = () => {
    const { isAuthenticated } = useAuth();
    const apiBase = process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_API + "/"
        : process.env.REACT_APP_PRO_API + "/";
    // const { id } = useParams();
    const location = useLocation();
    const { productId } = location.state || {};
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('specifications');
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    useEffect(() => {
        const apiClient = isAuthenticated ? AxiosInterceptor : axios;
        const fetchProduct = async () => {
            try {
                console.log("Fetching product with ID:", productId);
                const response = await apiClient(`${apiBase}api/gadgets/${productId}`);
                console.log("API Response:", response.data);
                setProduct(response.data);
                setPrice(response.price);
                console.log("giá", response.data.price);

            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("Failed to fetch product details.");
            }
        };

        fetchProduct();
    }, [productId, isAuthenticated, apiBase]);
    const imgRef = useRef(null); // Tạo ref để tham chiếu đến hình ảnh chính

    const handleImageClick = (imageUrl) => {
        if (imgRef.current) {
            imgRef.current.src = imageUrl; // Cập nhật src của hình ảnh chính
        }
    };
    if (error) return <div>{error}</div>;
    if (!product) return <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
    </div>;

    const handleQuantityChange = (type) => {
        setQuantity(prev => type === 'increment' ? prev + 1 : Math.max(1, prev - 1));
    };

    const handleAddToCart = async () => {
        const totalPrice = price * quantity;
        console.log("giá", price);
        console.log("số lượng", quantity)

        try {
            const response = await AxiosInterceptor.post("/api/cart", {
                gadgetId: productId,
                quantity,
            });




            console.log("Product added to cart", response);
            toast.success("Thêm sản phẩm thành công");
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Thêm sản phẩm thất bại");
        }
    };

    const handleBuyNow = () => {
        setShowConfirmation(true);
    };

    const handleCancelOrder = () => {
        setShowConfirmation(false);
    };

    const totalPrice = product.price * quantity;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb
                className="w-full"
                items={[
                    {
                        title: <p>{product.category?.name}</p>,
                    },
                    {
                        title: <p>{product.brand?.name}</p>,
                    },
                    {
                        title: <p>{product.name}</p>,
                    },
                ]}
            />

            <ToastContainer />
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left column */}
                <div className="lg:w-2/3">
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

                    <div className="mb-6 flex justify-center items-center">
                        <div className="mb-6 flex justify-center items-center">
                            <img
                                ref={imgRef}
                                src={product.thumbnailUrl}
                                alt={product.name}
                                className="w-full max-w-md h-90 object-contain rounded-lg border-none"
                            />
                        </div>

                    </div>

                    <div className="flex space-x-2 mb-6 overflow-x-auto">
                        {product.gadgetImages && product.gadgetImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.name} - Image ${index + 1}`}
                                width={100}
                                height={100}
                                className="rounded-md border border-gray-200 cursor-pointer"
                                onClick={() => handleImageClick(image)}
                            />
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                className={`w-64 px-4 py-2 rounded-lg font-semibold text-base border border-blue-300 ${activeTab === 'specifications' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-gray-600 border-gray-300'}`}
                                onClick={() => setActiveTab('specifications')}
                            >
                                Thông số kỹ thuật
                            </button>
                            <button
                                className={`w-64 px-4 py-2 rounded-lg font-semibold text-base border border-blue-300 ${activeTab === 'review' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-gray-600 border-gray-300'}`}
                                onClick={() => setActiveTab('review')}
                            >
                                Bài viết đánh giá
                            </button>
                        </div>
                        {activeTab === 'specifications' && (
                            <div className="space-y-4">
                                {product.specificationValues &&
                                    product.specificationValues
                                        .sort((a, b) => a.index - b.index)
                                        .map((spec) => (
                                            <div key={spec.id}
                                                className="flex items-start border-b border-gray-200 py-3 last:border-0"
                                            >
                                                <div className="w-1/3 text-gray-600">
                                                    {spec.specificationKey || 'N/A'}
                                                </div>
                                                <div className="w-2/3 font-medium text-gray-900">
                                                    {spec.value || 'N/A'}
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                        )}
                        {activeTab === 'review' && (
                            <div className="space-y-4">
                                {product.gadgetDescriptions &&
                                    product.gadgetDescriptions
                                        .sort((a, b) => a.index - b.index)
                                        .map((desc) => {
                                            const isImageUrl = desc.value.startsWith("http") &&
                                                (desc.value.endsWith(".jpg") ||
                                                    desc.value.endsWith(".jpeg") ||
                                                    desc.value.endsWith(".png"));

                                            return (
                                                <div key={desc.id} className={desc.type === 'BoldText' ? 'font-bold' : ''}>
                                                    {isImageUrl ? (
                                                        <img src={desc.value} alt="Gadget" className="max-w-full h-auto" />
                                                    ) : (
                                                        <div>{desc.value}</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex py-4">
                            {product.discountPercentage > 0 ? (
                                <>
                                    <div className="mr-2 text-3xl font-bold text-red-600">
                                        {product.discountPrice.toLocaleString()}₫
                                    </div>
                                    <span className="line-through text-gray-500">
                                        {product.price.toLocaleString()}₫
                                    </span>
                                    <div className='mr-2 text-xl font-bold text-red-600'>
                                        {`${product.discountPercentage}%`}
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-800 font-semibold text-3xl">
                                    {product.price.toLocaleString()}₫
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <button
                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                    onClick={() => handleQuantityChange('decrement')}
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold">{quantity}</span>
                                <button
                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                    onClick={() => handleQuantityChange('increment')}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-200"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                                onClick={handleBuyNow}
                            >
                                Mua ngay
                            </button>
                        </div>

                        <h2 className="text-lg font-semibold">Thông tin người bán</h2>
                        <p>{product.seller?.shopName}</p>
                        <p>{product.seller?.shopAddress}</p>
                        <div className="flex">

                            <h2 className="text-lg font-semibold mt-4 ">Brand</h2>
                            {product.brand?.logoUrl && (
                                <img src={product.brand.logoUrl} alt={product.brand.name || 'Brand Logo'} className="object-contain w-16 h-16 max-h-20 ml-5" />
                            )}
                        </div>

                    </div>
                </div>
            </div>
            {showConfirmation && (
                <OrderConfirmation
                    product={product}
                    quantity={quantity}
                    totalPrice={totalPrice}
                    onCancel={handleCancelOrder}
                />
            )}
        </div>
    );
};

export default DetailGadgetPage;