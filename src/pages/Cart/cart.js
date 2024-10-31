import React, { useEffect, useState } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { HomeOutlined, MinusOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';

const CartPage = () => {
    const [sellers, setSellers] = useState([]);
    const [cartItemsBySeller, setCartItemsBySeller] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

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
    const handleSelectItem = (sellerId, productId) => {
        setSelectedItems(prev => {
            const newSelectedItems = { ...prev };
            if (newSelectedItems[sellerId]?.includes(productId)) {
                newSelectedItems[sellerId] = newSelectedItems[sellerId].filter(id => id !== productId);
                if (newSelectedItems[sellerId].length === 0) delete newSelectedItems[sellerId];
            } else {
                if (!newSelectedItems[sellerId]) newSelectedItems[sellerId] = [];
                newSelectedItems[sellerId].push(productId);
            }
            return newSelectedItems;
        });
    };
    const handleSelectAllForSeller = (sellerId) => {
        setSelectedItems(prev => {
            const isSelected = selectedItems[sellerId]?.length === cartItemsBySeller[sellerId].length;
            const updatedSelectedItems = { ...prev };

            if (isSelected) {
                delete updatedSelectedItems[sellerId];
            } else {
                updatedSelectedItems[sellerId] = cartItemsBySeller[sellerId].map(item => item.gadget.id);
            }
            return updatedSelectedItems;
        });
    };
    const handleSelectAll = () => {
        const allSelected = Object.keys(selectedItems).length === sellers.length &&
            sellers.every(seller => selectedItems[seller.id]?.length === cartItemsBySeller[seller.id]?.length);

        if (allSelected) {
            setSelectedItems({});
        } else {
            const newSelectedItems = {};
            sellers.forEach(seller => {
                newSelectedItems[seller.id] = cartItemsBySeller[seller.id].map(item => item.gadget.id);
            });
            setSelectedItems(newSelectedItems);
        }
    };
    useEffect(() => {
        let total = 0;
        Object.entries(selectedItems).forEach(([sellerId, productIds]) => {
            productIds.forEach(productId => {
                const item = cartItemsBySeller[sellerId]?.find(item => item.gadget.id === productId);
                if (item) {
                    total += (item.gadget.discountPercentage > 0 ? item.gadget.discountPrice : item.gadget.price) * item.quantity;
                }
            });
        });
        setTotalPrice(total);
    }, [selectedItems, cartItemsBySeller]);

    const handleCheckout = async () => {
        const listGadgetItems = [];

        Object.entries(selectedItems).forEach(([sellerId, productIds]) => {
            productIds.forEach(productId => {
                listGadgetItems.push(productId);
            });
        });

        try {
            await AxiosInterceptor.post('/api/order', { listGadgetItems });
            toast.success("Đặt hàng thành công");
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Đặt hàng thất bại");
        }
    };
    const selectedItemCount = Object.values(selectedItems).flat().length;
    return (
        <div className="max-w-7xl mx-auto p-4">
            <ToastContainer />
            <h1 className="text-3xl font-bold text-center text-indigo-900 dark:text-white mb-8">
                Giỏ hàng của bạn
            </h1>

            {/* Kiểm tra nếu giỏ hàng trống */}
            {sellers.length === 0 || Object.values(cartItemsBySeller).every(items => items.length === 0) ? (
                <div className="text-center text-gray-500 text-lg font-semibold py-8">
                    Giỏ hàng trống
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={Object.keys(selectedItems).length === sellers.length &&
                                sellers.every(seller => selectedItems[seller.id]?.length === cartItemsBySeller[seller.id]?.length)}
                        />
                        <label className="ml-2">Sản phẩm</label>
                    </div>

                    {sellers.map(seller => (
                        (cartItemsBySeller[seller.id]?.length > 0) && (
                            <div key={seller.id} className="mb-8 p-4 border rounded-lg shadow-sm bg-white">
                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelectAllForSeller(seller.id)}
                                            checked={selectedItems[seller.id]?.length === cartItemsBySeller[seller.id]?.length}
                                        />
                                        <h2 className="text-lg font-semibold">{seller.shopName}</h2>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <HomeOutlined />
                                        <p style={{ marginLeft: '8px' }}>{seller.shopAddress}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneOutlined />
                                        <p style={{ marginLeft: '8px' }}>SĐT: {seller.phoneNumber}</p>
                                    </div>


                                    <div className='flex justify-end '>
                                        <button
                                            onClick={() => handleRemoveItemsForSeller(seller.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Xóa tất cả
                                        </button>

                                    </div>

                                </div>

                                <div className="space-y-4">
                                    {(cartItemsBySeller[seller.id] || []).map(item => (
                                        <div key={item.gadget.id} className="flex items-start gap-4 p-4 border rounded-md shadow-sm bg-gray-100">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems[seller.id]?.includes(item.gadget.id) || false}
                                                onChange={() => handleSelectItem(seller.id, item.gadget.id)}
                                                className="mt-1"
                                            />
                                            <img src={item.gadget.thumbnailUrl}
                                                alt={item.gadget.name}
                                                className="w-20 h-20 object-contain rounded-md"
                                            />
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
                        )
                    ))}

                    {totalPrice > 0 && (
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 py-3 shadow-2xl px-4 flex justify-between items-center">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                <p className="text-lg font-semibold text-gray-700">Tổng tiền:</p>
                                <p className="text-xl font-bold text-red-500">{totalPrice.toLocaleString()} VNĐ</p>
                                <p className="text-lg font-semibold text-gray-700 sm:border-l sm:pl-4 sm:ml-4">Sản phẩm đã chọn:
                                    <span className="text-blue-600 font-bold ml-2">{selectedItemCount}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="bg-red-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                            >
                                Mua ngay
                            </button>
                        </div>
                    )}
                </>
 )}
        </div>
    );
};

export default CartPage;
