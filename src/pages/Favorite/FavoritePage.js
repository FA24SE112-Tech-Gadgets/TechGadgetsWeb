import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
import slugify from '~/ultis/config';
import { toast, ToastContainer } from 'react-toastify';

function FavoritePage() {
    const [groupedFavorites, setGroupedFavorites] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [scrollPositions, setScrollPositions] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await AxiosInterceptor.get("api/favorite-gadgets?Page=1&PageSize=100");
                const grouped = response.data.items.reduce((groups, item) => {
                    const shopName = item.gadget.seller.shopName;
                    if (!groups[shopName]) {
                        groups[shopName] = {
                            shopInfo: item.gadget.seller,
                            products: []
                        };
                    }
                    groups[shopName].products.push(item.gadget);
                    return groups;
                }, {});
                setLoading(true);
                setGroupedFavorites(Object.values(grouped));

            } catch (error) {
                console.error("Failed to fetch favorites:", error);
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);


    const handleScroll = (direction, shopName) => {
        const container = document.getElementById(`shop-container-${shopName}`);
        if (!container) return;

        const scrollAmount = 300; // Điều chỉnh khoảng cách scroll
        const newScrollLeft = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });

        // Cập nhật trạng thái scroll cho shop cụ thể
        setScrollPositions(prev => ({
            ...prev,
            [shopName]: newScrollLeft
        }));
    };

    // Kiểm tra xem có thể scroll không
    const checkScrollable = (shopName) => {
        const container = document.getElementById(`shop-container-${shopName}`);
        if (!container) return { canScrollLeft: false, canScrollRight: false };

        const canScrollLeft = container.scrollLeft > 0;
        const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);

        return { canScrollLeft, canScrollRight };
    };

    // Theo dõi scroll event của mỗi container
    useEffect(() => {
        const handleContainerScroll = (shopName) => {
            const { canScrollLeft, canScrollRight } = checkScrollable(shopName);
            setScrollPositions(prev => ({
                ...prev,
                [shopName]: {
                    canScrollLeft,
                    canScrollRight
                }
            }));
        };

        // Thêm scroll listener cho mỗi container
        groupedFavorites.forEach(shop => {
            const container = document.getElementById(`shop-container-${shop.shopInfo.shopName}`);
            if (container) {
                container.addEventListener('scroll', () => handleContainerScroll(shop.shopInfo.shopName));
                // Kiểm tra ban đầu
                handleContainerScroll(shop.shopInfo.shopName);
            }
        });

        // Cleanup
        return () => {
            groupedFavorites.forEach(shop => {
                const container = document.getElementById(`shop-container-${shop.shopInfo.shopName}`);
                if (container) {
                    container.removeEventListener('scroll', () => handleContainerScroll(shop.shopInfo.shopName));
                }
            });
        };
    }, [groupedFavorites]);

    const handleRemoveProduct = async (gadgetId) => {
        try {
            await AxiosInterceptor.post(`/api/favorite-gadgets/${gadgetId}`);
            setGroupedFavorites(prevGroups => {
                const newGroups = prevGroups.map(group => ({
                    ...group,
                    products: group.products.filter(product => product.id !== gadgetId)
                })).filter(group => group.products.length > 0);
                toast.success("Xóa khỏi yêu thích thành công");
                return newGroups;
            });
        } catch (error) {
            console.error("Error removing product:", error);
        }
        handleClose();
    };

    const handleClick = (event, product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedProduct(null);
    };

    return (
        <div className="min-h-screen  dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-indigo-900 dark:text-white mb-8">
                    Danh sách yêu thích
                </h1>
                {groupedFavorites.length === 0 ? (

                    <div className="text-center text-gray-500 dark:text-gray-300">
                        Danh sách này trống
                    </div>
                ) : (
                    groupedFavorites.map((shop) => (
                        <div key={shop.shopInfo.shopName} className="mb-10">
                            <div className="bg-40 rounded-lg shadow-md">
                                <div className="p-3 bg-primary/40 dark:bg-gray-700 rounded-t-lg">
                                    <h2 className="text-lg font-semiboldtext-indigo-900 dark:text-white">{shop.shopInfo.shopName}</h2>
                                    <p className="text-sm text-indigo-900 dark:text-white">{shop.shopInfo.shopAddress}</p>
                                </div>
                                <div className="relative">
                                    {/* Container sản phẩm có thể scroll */}
                                    <div
                                        id={`shop-container-${shop.shopInfo.shopName}`}
                                        className="overflow-x-auto scrollbar-hide"
                                        style={{
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none'
                                        }}
                                    >
                                        <div className="p-4 flex gap-4 min-w-min">
                                            {shop.products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => navigate(`/gadget/detail/${slugify(product.name)}`, {
                                                        state: {
                                                            productId: product.id,
                                                        }
                                                    })}
                                                    className="border rounded-lg shadow-sm flex-none w-[200px] flex flex-col justify-between relative bg-40"
                                                >
                                                    {product.discountPercentage > 0 && (
                                                        <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold text-center py-1 px-2 rounded-tr-md rounded-b-md">
                                                            Giảm {`${product.discountPercentage}%`}
                                                        </div>
                                                    )}
                                                    {product.status === "Inactive" ? (
                                                        <div className="absolute top-1/3 left-0 transform -translate-y-1/2 w-full bg-red-500 text-white text-sm font-bold text-center py-1 rounded">
                                                           Sản phẩm đã bị khóa do vi phạm chính sách TechGadget
                                                        </div>
                                                    ) : !product.isForSale && (
                                                        <div className="absolute top-0 right-0 bg-gray-400 text-white text-sm font-bold text-center py-1 px-1 rounded-tr-md rounded-b-md">
                                                            Ngừng bán
                                                        </div>
                                                    )}
                                                    <div className="p-2">
                                                        <img
                                                            src={product.thumbnailUrl}
                                                            alt={product.name}
                                                            className="w-full h-32 object-contain mb-2 rounded"
                                                        />
                                                        <div className="flex justify-between items-center mb-2 text-indigo-900 dark:text-white">
                                                            <h3 className="font-semibold text-xs line-clamp-2">{product.name}</h3>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Stop the click event from bubbling up
                                                                    handleClick(e, product);
                                                                }}
                                                                size="small"
                                                                className="text-gray-500"
                                                            >
                                                                <MoreVert />
                                                            </IconButton>
                                                        </div>
                                                        <div className="flex py-4">
                                                            {product.discountPercentage > 0 ? (
                                                                <>
                                                                    <div className="text-red-500 font-semibold text-sm mr-2">
                                                                        {product.discountPrice.toLocaleString()}₫
                                                                    </div>
                                                                    <span className="line-through text-gray-500">
                                                                        {product.price.toLocaleString()}₫
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <div className="text-gray-800 font-semibold text-sm">
                                                                    {product.price.toLocaleString()}₫
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl) && selectedProduct?.id === product.id}
                                                        onClose={handleClose}
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right",
                                                        }}
                                                        transformOrigin={{
                                                            vertical: "top",
                                                            horizontal: "right",
                                                        }}
                                                    >
                                                        <MenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Stop the click event from bubbling up
                                                                handleRemoveProduct(product.id);
                                                            }}>
                                                            Xóa khỏi yêu thích
                                                        </MenuItem>
                                                    </Menu>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nút scroll phải */}
                                    {scrollPositions[shop.shopInfo.shopName]?.canScrollRight && (
                                        <button
                                            onClick={() => handleScroll('right', shop.shopInfo.shopName)}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-l shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>

                                    )}
                                    {scrollPositions[shop.shopInfo.shopName]?.canScrollLeft && (
                                        <button
                                            onClick={() => handleScroll('left', shop.shopInfo.shopName)}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-indigo-900 dark:text-white p-2 rounded-r shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>

                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FavoritePage;