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

function BrandGadgetPage() {
  const location = useLocation();
  const { categoryId, brandId } = location.state || {};
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { category, brand } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const apiBaseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PRO_API;

  // Fetch products based on brand, category, and applied filters
  const fetchBrandProducts = async () => {
    setLoading(true);
    const apiClient = isAuthenticated ? AxiosInterceptor : axios;

    // Chuẩn bị các GadgetFilters dưới dạng query string
    const gadgetFilters = appliedFilters.GadgetFilters
        ? appliedFilters.GadgetFilters.map(filter => `GadgetFilters=${filter}`).join('&')
        : '';

    // Thêm MinPrice và MaxPrice vào query nếu có trong appliedFilters
    const minPrice = appliedFilters.MinPrice ? `MinPrice=${appliedFilters.MinPrice}` : '';
    const maxPrice = appliedFilters.MaxPrice ? `MaxPrice=${appliedFilters.MaxPrice}` : '';

    // Kết hợp tất cả các tham số query
    const queryString = [
        gadgetFilters, 
        minPrice, 
        maxPrice
    ].filter(Boolean).join('&'); // filter(Boolean) để loại bỏ các chuỗi rỗng

    const apiUrl = `${apiBaseUrl}/api/gadgets/category/${categoryId}?Brands=${brandId}&${queryString}`;

    console.log("API URL:", apiUrl); // Kiểm tra URL để đảm bảo đúng định dạng

    try {
        const response = await apiClient.get(apiUrl);
        setProducts(response.data.items);
    } catch (error) {
        console.error("Error fetching brand products:", error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
  fetchBrandProducts();
}, [categoryId, brandId, appliedFilters, isAuthenticated]);

  // const handleNavigation = () => {
  //   navigate(`/gadgets/${slugify(category)}`);
  // };

  const toggleFavorite = async (gadgetId, isFavorite) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add to favorites!");
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
      toast.error("An error occurred, please try again.");
    }
  };

  const toggleFilterModal = () => {
    setFilterModalVisible((prev) => !prev);
  };

  const handleApplyFilters = (filters) => {
    console.log("Applied Filters: ", filters);
    setAppliedFilters(filters);
    setFilterModalVisible(false); // Close modal after applying filters
};


  return (
    <div>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-900 dark:text-white">
        <div className="w-full px-4">
          <Breadcrumb className="w-full">
            <Breadcrumb.Item>
              {/* <span onClick={handleNavigation} className="hover:underline cursor-pointer"> */}
              <p>
                {category}

              </p>
              {/* </span> */}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <p>{brand}</p>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Button onClick={toggleFilterModal} className="mt-4">Filter</Button>
        </div>

        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto px-4 py-8 ">
          {products.length === 0 && !loading ? (
            <div className="text-center py-4 text-gray-500">No products available</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="relative border-2 rounded-2xl shadow-sm flex flex-col justify-between transition-transform duration-200 transform hover:scale-105 hover:border-primary/50">
                {product.isForSale === false && (
                  <div className="absolute top-1/3 left-0 transform -translate-y-1/2 w-full bg-red-500 text-white text-sm font-bold text-center py-1 rounded">
                    Out of stock
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
                  <div className="w-full text-sm flex items-center justify-end">
                    <button onClick={() => toggleFavorite(product.id, product.isFavorite)}>
                      <CiHeart
                        className={`h-6 w-6 ${product.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Filter
        isVisible={isFilterModalVisible}
        onClose={toggleFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}

export default BrandGadgetPage;
