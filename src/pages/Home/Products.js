import React, { useEffect, useState, useRef } from 'react';
import { CiHeart } from 'react-icons/ci';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import useAuth from '~/context/auth/useAuth';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';


const apiBase = process.env.NODE_ENV === "development" 
  ? process.env.REACT_APP_DEV_API + "/" 
  : process.env.REACT_APP_PRO_API + "/";

const categoryPaths = {
  laptops: `${apiBase}api/gadgets/category/458d7752-e45e-444a-adf9-f7201c07acd1?Page=1&PageSize=100`,
  headphones: `${apiBase}api/gadgets/category/9f6ac480-e673-49ec-9bc0-7566cca80b86?Page=1&PageSize=100`,
  speakers: `${apiBase}api/gadgets/category/bb65a310-e28e-4226-a562-0b6ea27f4faa?Page=1&PageSize=100`,
  phones: `${apiBase}api/gadgets/category/ea4183e8-5a94-401c-865d-e000b5d2b72d?Page=1&PageSize=100`
};

export default function ProductPage() {
  const { isAuthenticated } = useAuth();
  const [laptops, setLaptops] = useState([]);
  const [headphones, setHeadphones] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [phones, setPhones] = useState([]);

  const laptopsNav = { prev: useRef(null), next: useRef(null) };
  const headphonesNav = { prev: useRef(null), next: useRef(null) };
  const speakersNav = { prev: useRef(null), next: useRef(null) };
  const phonesNav = { prev: useRef(null), next: useRef(null) };

  useEffect(() => {
    const fetchCategoryProducts = async (path, setCategory) => {
      const api = isAuthenticated ? AxiosInterceptor : axios;
      try {
        const response = await api.get(path);
        setCategory(response.data.items);
        console.log("data",response.data.items);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategoryProducts(categoryPaths.laptops, setLaptops);
    fetchCategoryProducts(categoryPaths.headphones, setHeadphones);
    fetchCategoryProducts(categoryPaths.speakers, setSpeakers);
    fetchCategoryProducts(categoryPaths.phones, setPhones);
  }, [isAuthenticated]);

  const toggleFavorite = async (gadgetId, isFavorite, setProducts) => {
    if (!isAuthenticated) {
      // Show toast notification to log in
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
    }
  };
  const renderCategory = (products, title, navigationRefs, setProducts) => (
    <div className="mb-10">
      <h2 className="text-2xl font-bold py-4">{title}</h2>
      <div className="relative group">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          navigation={{ 
            nextEl: navigationRefs.next.current, 
            prevEl: navigationRefs.prev.current, 
          }} 
          modules={[Navigation]}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = navigationRefs.prev.current;
            swiper.params.navigation.nextEl = navigationRefs.next.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="relative"
        >
          {products.reduce((slides, product, index) => {
            if (index % 10 === 0) slides.push([]);
            slides[slides.length - 1].push(product);
            return slides;
          }, []).map((productGroup, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productGroup.slice(0, 5).map((product, colIndex) => (
                  <div key={colIndex} className="border rounded-lg shadow-sm flex flex-col justify-between relative">
                    {product.isForSale === false && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-sm px-2 py-1 rounded-br-lg">
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
                    <button
                        className={`w-full text-sm flex items-center justify-center border rounded px-2 py-1 ${product.isFavorite ? 'text-red-500 border-red-500' : 'text-gray-500 border-gray-500'}`}
                        onClick={() => toggleFavorite(product.id, product.isFavorite, setProducts)}
                      >
                        <CiHeart className="mr-2" /> Yêu thích
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {productGroup.slice(5, 10).map((product, colIndex) => (
                  <div key={colIndex} className="border rounded-lg shadow-sm flex flex-col justify-between relative">
                    {product.isForSale === false && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-sm px-2 py-1 rounded-br-lg">
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
                    <button
                        className={`w-full text-sm flex items-center justify-center border rounded px-2 py-1 ${product.isFavorite ? 'text-red-500 border-red-500' : 'text-gray-500 border-gray-500'}`}
                        onClick={() => toggleFavorite(product.id, product.isFavorite, setProducts)}
                      >
                        <CiHeart className="mr-2" /> Yêu thích
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <div>
          <button
            ref={navigationRefs.prev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full cursor-pointer shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <button
          ref={navigationRefs.next}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full cursor-pointer shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
    {renderCategory(laptops, "Laptops", laptopsNav, setLaptops)}
    {renderCategory(headphones, "Tai Nghe", headphonesNav, setHeadphones)}
    {renderCategory(speakers, "Loa", speakersNav, setSpeakers)}
    {renderCategory(phones, "Điện Thoại", phonesNav, setPhones)}
  </div>
  );
}
