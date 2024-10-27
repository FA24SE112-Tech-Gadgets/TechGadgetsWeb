import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import useAuth from '~/context/auth/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import { CiHeart } from 'react-icons/ci';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { Breadcrumb } from 'antd';
import slugify from '~/ultis/config';

function BrandGadgetPage() {
    const location = useLocation();
    const { categoryId, brandId } = location.state || {}; 

    const { isAuthenticated } = useAuth();
    const { category, brand } = useParams();
    const [products, setProducts] = useState([]);
    const apiBaseUrl = process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_API
        : process.env.REACT_APP_PRO_API;

    const fetchBrandProducts = async () => {
        const apiClient = isAuthenticated ? AxiosInterceptor : axios;
        try {
            const response = await apiClient.get(
                `${apiBaseUrl}/api/gadgets/category/${categoryId}/brand/${brandId}`
            );
            setProducts(response.data.items);
            console.log("data nè ", response.data.items);
            
        } catch (error) {
            console.error("Error fetching brand products:", error);
        }
    };

    useEffect(() => {
        console.log(`${apiBaseUrl}/api/gadgets/category/${categoryId}/brand/${brandId}`);
        
        fetchBrandProducts();
    }, [category, brandId, brand, categoryId]);

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

    return (
        <div >
            <ToastContainer />
            <div  className="bg-gray-100 w-full px-4">
                <Breadcrumb className="w-full">
                    <Breadcrumb.Item>
                        <a href={`/gadgets/${slugify(category)}`} className="text-blue-600 hover:underline">{category}</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <p>{brand}</p>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto px-4 py-8">
            
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg shadow-sm flex flex-col justify-between relative">
                  {product.isForSale === false && (
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
                    <div className="text-red-500 font-semibold text-sm">
                      {product.price.toLocaleString()}đ
                    </div>
                  </div>
                  <div className="p-2">
                    <div
                      className='w-full text-sm flex items-center justify-end px-2 py-1 text-gray-500'
                    >
                      <span className="mr-2">Yêu thích</span>
                      <span
                        onClick={() => toggleFavorite(product.id, product.isFavorite, setProducts)}
                        className="cursor-pointer flex items-center"
                      >
                        {product.isFavorite ? (
                          // Trái tim đầy màu đỏ
                          <svg
                            className="h-8 w-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          // Trái tim viền màu xám
                          <CiHeart className="h-8 w-5 text-gray-500" />
                        )}
                      </span>
                    </div>
                  </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default BrandGadgetPage;
