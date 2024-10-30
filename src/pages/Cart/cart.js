import React, { useEffect, useState } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';

const CartPage = () => {
    const [sellers, setSellers] = useState([]);
    const [cartItemsBySeller, setCartItemsBySeller] = useState({});

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await AxiosInterceptor.get('/api/cart/sellers?Page=1&PageSize=100');
                setSellers(response.data.items);
            } catch (error) {
                console.error("Error fetching sellers:", error);
            }
        };

        fetchSellers();
    }, []);

    useEffect(() => {
        const fetchCartItemsForSeller = async (sellerId) => {
            try {
                const response = await AxiosInterceptor.get(`/api/cart/seller/${sellerId}`);
                setCartItemsBySeller(prev => ({ ...prev, [sellerId]: response.data.items }));
            } catch (error) {
                console.error(`Error fetching cart items for seller ${sellerId}:`, error);
            }
        };

        sellers.forEach(seller => fetchCartItemsForSeller(seller.id));
    }, [sellers]);

    const handleQuantityChange = (sellerId, productId, change) => {
        setCartItemsBySeller(prev => {
            const updatedItems = prev[sellerId].map(item => {
                if (item.gadget.id === productId) {
                    // Lưu giá trị trước khi thay đổi vào localStorage
                    const previousTotalPrice = item.gadget.price * item.quantity;
                    localStorage.setItem(`previousTotalPrice_${productId}`, previousTotalPrice);

                    // Cập nhật số lượng mới
                    const newQuantity = Math.max(1, item.quantity + change);
                    const newTotalPrice = item.gadget.price * newQuantity;

                    // Lưu giá trị mới sau khi thay đổi vào localStorage
                    localStorage.setItem(`currentTotalPrice_${productId}`, newTotalPrice);

                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            return {
                ...prev,
                [sellerId]: updatedItems,
            };
        });
    };


    const handleRemoveItemsForSeller = async (sellerId) => {
        try {
            await AxiosInterceptor.delete(`/api/cart/seller/${sellerId}`);

            setCartItemsBySeller(prev => ({
                ...prev,
                [sellerId]: []
            }));

            toast.success("Xóa tất cả sản phẩm khỏi giỏ hàng thành công");
        } catch (error) {
            console.error(`Error removing items from seller ${sellerId}:`, error);
            toast.error("Xóa tất cả sản phẩm khỏi giỏ hàng thất bại.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <ToastContainer />

            {/* Kiểm tra nếu giỏ hàng trống */}
            {sellers.length === 0 || Object.values(cartItemsBySeller).every(items => items.length === 0) ? (
                <div className="text-center text-gray-500 text-lg font-semibold py-8">
                    Giỏ hàng trống
                </div>
            ) : (
                sellers.map(seller => (
                    <div key={seller.id} className="mb-8 p-4 border rounded-lg shadow-sm bg-white">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">{seller.shopName}</h2>
                            <p>{seller.shopAddress}</p>
                            <p>Phone: {seller.phoneNumber}</p>
                            <div className='flex justify-end mt-2'>
                                <button
                                    onClick={() => handleRemoveItemsForSeller(seller.id)}
                                    className="text-red-500 hover:underline mt-2"
                                >
                                    Remove All
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(cartItemsBySeller[seller.id] || []).map(item => (
                                <div key={item.gadget.id} className="flex items-start gap-4 p-4 border rounded-md shadow-sm bg-gray-100">
                                    <img src={item.gadget.thumbnailUrl} alt={item.gadget.name} className="w-20 h-20 object-cover rounded-md" />
                                    <div className="flex-grow flex flex-col space-y-2">
                                        <h4 className="font-bold">{item.gadget.name}</h4>
                                        <p>Hãng: {item.gadget.brand.name}</p>
                                        <p>Loại sản phẩm: {item.gadget.category.name}</p>
                                        <div className="flex items-center mt-2">
                                            <p>Đơn giá:   </p>
                                                {item.gadget.discountPercentage > 0 ? (
                                                    <>
                                                        <div className="text-red-500 font-semibold text-sm mr-2">
                                                            ₫{item.gadget.discountPrice.toLocaleString()}
                                                        </div>
                                                        <span className="line-through text-gray-500">
                                                            {item.gadget.price.toLocaleString()}đ
                                                        </span>
                                                    </>
                                                ) : (
                                                    <div className="text-gray-800 font-semibold text-sm">
                                                        ₫{item.gadget.price.toLocaleString()}
                                                    </div>
                                                )}
                                          
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <p>Thành tiền: </p>
                                            <span className="font-semibold text-red-500 mr-2">
                                                ₫{(
                                                    (item.gadget.discountPercentage > 0
                                                        ? item.gadget.discountPrice
                                                        : item.gadget.price) * item.quantity
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>


                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(seller.id, item.gadget.id, -1)}
                                                disabled={item.quantity <= 1}
                                                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(seller.id, item.gadget.id, 1)}
                                                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                <PlusOutlined />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CartPage;
