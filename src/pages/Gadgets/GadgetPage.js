import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '~/context/auth/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import { CiHeart } from 'react-icons/ci';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { Breadcrumb, Button } from 'antd';
import slugify from '~/ultis/config';
import Filter from './Filter/Filter';
import { FilterOutlined } from '@ant-design/icons';

function CategoryGadgetPage() {
    const location = useLocation();
    const { categoryId, brandId } = location.state || {};
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const apiBaseUrl = process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_API
        : process.env.REACT_APP_PRO_API;

    useEffect(() => {
        const fetchBrandProducts = async () => {
            setLoading(true);
            const apiClient = isAuthenticated ? AxiosInterceptor : axios;

            const gadgetFilters = appliedFilters.GadgetFilters
                ? appliedFilters.GadgetFilters.map(filter => `GadgetFilters=${filter}`).join('&')
                : '';
            const minPrice = appliedFilters.MinPrice ? `MinPrice=${appliedFilters.MinPrice}` : '';
            const maxPrice = appliedFilters.MaxPrice ? `MaxPrice=${appliedFilters.MaxPrice}` : '';

            const queryString = [
                gadgetFilters,
                minPrice,
                maxPrice
            ].filter(Boolean).join('&');

            const apiUrl = `${apiBaseUrl}/api/gadgets/category/${categoryId}?Brands=${brandId}&${queryString}&Page=${page}&PageSize=20`;

            try {
                const response = await apiClient.get(apiUrl);
                const newProducts = response.data.items;

                // Filter out products with seller status "Inactive"
                const activeProducts = newProducts.filter(product => product.sellerStatus === 'Active');

                setProducts((prevProducts) => page === 1 ? activeProducts : [...prevProducts, ...activeProducts]);
                setHasMore(activeProducts.length === 20); // Check if there are more products to load
            } catch (error) {
                console.error("Error fetching brand products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrandProducts();
    }, [category, brandId, categoryId, apiBaseUrl, appliedFilters, isAuthenticated, page]);

    const toggleFavorite = async (gadgetId, isFavorite) => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để thêm vào yêu thích!");
            return;
        }
        try {
            await AxiosInterceptor.post(`/api/favorite-gadgets/${gadgetId}`);
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === gadgetId ? { ...product, isFavorite: !isFavorite } : product
                )
            );
        } catch (error) {
            console.error("Error toggling favorite status:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const toggleFilterModal = () => {
        setFilterModalVisible((prev) => !prev);
    };

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setFilterModalVisible(false);
        setPage(1); // Reset page when filters are applied
    };

    return (
        <div className="bg-white dark:bg-gray-900 dark:text-white">
            <ToastContainer />

            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
            )}
            <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <Breadcrumb className="w-full">
                    <Breadcrumb.Item>
                        <p>
                            {category}
                        </p>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Button onClick={toggleFilterModal} className="mt-4 px-4">
                    <FilterOutlined />
                </Button>

                <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto px-4 py-8">
                    {products.length === 0 && !loading ? (
                        <div className="text-center py-4 text-gray-500">Không có sản phẩm</div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="relative border-2 rounded-2xl shadow-sm flex flex-col justify-between transition-transform duration-200 transform hover:scale-105  hover:border-primary/50"
                                onClick={() => navigate(`/gadget/detail/${slugify(product.name)}`, {
                                    state: {
                                        productId: product.id,
                                    }
                                })}
                            >
                                {product.discountPercentage > 0 && (
                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold text-center py-1 px-2 rounded-tr-md rounded-b-md">
                                        Giảm {`${product.discountPercentage}%`}
                                    </div>
                                )}
                                {!product.isForSale && (
                                    <div className="absolute top-1/3 left-0 transform -translate-y-1/2 w-full bg-red-500 text-white text-sm font-bold text-center py-1 rounded">
                                        Ngừng kinh doanh
                                    </div>
                                )}
                                <div className="p-2">
                                    <img
                                        src={product.thumbnailUrl}
                                        alt={product.name}
                                        className="w-full h-32 object-cover mb-2 rounded"
                                    />
                                    <h3 className="font-semibold text-xs line-clamp-2">{product.name}</h3>
                                    <div className="flex py-4">
                                        {product.discountPercentage > 0 ? (
                                            <>
                                                <div className="text-red-500 font-semibold text-sm mr-2">
                                                    ₫{product.discountPrice.toLocaleString()}
                                                </div>
                                                <span className="line-through text-gray-500">
                                                    {product.price.toLocaleString()}đ
                                                </span>
                                            </>
                                        ) : (
                                            <div className="text-gray-800 font-semibold text-sm">
                                                ₫{product.price.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className='w-full text-sm flex items-center justify-end px-2 py-1 text-gray-500'>
                                        <span className="mr-2">Yêu thích</span>
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(product.id, product.isFavorite);
                                            }}
                                            className="cursor-pointer flex items-center"
                                        >
                                            {product.isFavorite ? (
                                                <svg
                                                    className="h-8 w-5 text-red-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                            ) : (
                                                <CiHeart className="h-8 w-5 text-gray-500" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {hasMore && !loading && (
                    <div className="text-center mt-4">
                        <Button onClick={() => setPage((prevPage) => prevPage + 1)}>
                            Xem thêm 20 sản phẩm 
                        </Button>
                    </div>
                )}
            </div>
            <Filter
                isVisible={isFilterModalVisible}
                onClose={toggleFilterModal}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
}

export default CategoryGadgetPage;
