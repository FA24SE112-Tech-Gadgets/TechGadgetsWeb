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
import slugify from '~/ultis/config';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";




const categoryIds = {
  laptop: "458d7752-e45e-444a-adf9-f7201c07acd1",
  headphones: "9f6ac480-e673-49ec-9bc0-7566cca80b86",
  speakers: "bb65a310-e28e-4226-a562-0b6ea27f4faa",
  phones: "ea4183e8-5a94-401c-865d-e000b5d2b72d"
};

const apiBase = process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_DEV_API + "/"
  : process.env.REACT_APP_PRO_API + "/";

const categoryPaths = Object.fromEntries(
  Object.entries(categoryIds).map(([key, id]) => [key, `${apiBase}api/gadgets/category/${id}?Page=1&PageSize=100`])
);

export default function ProductPage() {

  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const [products, setProducts] = useState({
    laptop: [],
    headphones: [],
    speakers: [],
    phones: []
  });

  const [brands, setBrands] = useState({
    laptop: [],
    headphones: [],
    speakers: [],
    phones: []
  });

  const navigationRefs = {
    laptop: { prev: useRef(null), next: useRef(null) },
    headphones: { prev: useRef(null), next: useRef(null) },
    speakers: { prev: useRef(null), next: useRef(null) },
    phones: { prev: useRef(null), next: useRef(null) }
  };

  useEffect(() => {
    const fetchCategoryData = async (category) => {
      setLoading(true);
      const api = isAuthenticated ? AxiosInterceptor : axios;
      try {
        const productResponse = await api.get(categoryPaths[category]);
        const activeProducts = productResponse.data.items.filter(product => product.sellerStatus === 'Active');
        setProducts((prev) => ({ ...prev, [category]: activeProducts }));
       
  
        const brandResponse = await axios.get(`${apiBase}api/brands/categories/${categoryIds[category]}`);
        setBrands((prev) => ({ ...prev, [category]: brandResponse.data.items }));
      } catch (error) {
        console.error(`Error fetching ${category} data:`, error);
        toast.error(`Có lỗi xảy ra khi lấy dữ liệu ${category}.`);
      } finally {
        setLoading(false);
      }
    };
  
    Object.keys(categoryIds).forEach(fetchCategoryData);
  }, [isAuthenticated]);
  

  const toggleFavorite = async (gadgetId, isFavorite, setCategory) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích!");
      return;
    }
    try {
      await AxiosInterceptor.post(`/api/favorite-gadgets/${gadgetId}`);
      setProducts((prev) => ({
        ...prev,
        [setCategory]: prev[setCategory].map(product =>
          product.id === gadgetId ? { ...product, isFavorite: !isFavorite } : product
        )
        
      }));
      // toast.success("Thêm vào yêu thích thành công");
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const renderProduct = (product, setCategory) => (
    <div
      key={product.id}
      className="border-2 rounded-2xl shadow-sm flex flex-col justify-between relative transition-transform duration-200 transform hover:scale-105  hover:border-primary/50"
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
      {product.isForSale === false && (
        <div className="absolute top-1/3 left-0 transform -translate-y-1/2 w-full bg-red-500 text-white text-sm font-bold text-center py-1 rounded">
          Ngừng kinh doanh
        </div>
      )}
      <div className="p-2">
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-full h-32 object-contain mb-2 rounded-2xl"
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
              toggleFavorite(product.id, product.isFavorite, setCategory);
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
  );

  const renderCategory = (category, title) => (
    <div data-aos="fade-up" className="mb-10">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex flex-wrap space-x-2">
          {brands[category].map((brand, index) => (
            <button className="bg-gray-200 dark:bg-gray-500 dark:text-white hover:bg-gray-300 px-4 py-2 rounded-lg"
              key={index}
              onClick={() => {
                navigate(`/gadgets/${title}/${slugify(brand.name)}`, {

                  state: {
                    categoryId: categoryIds[category],
                    brandId: brand.id
                  }

                })
              }}
            >
              {brand.name}

            </button>
          ))}
          <button className="bg-gray-200 dark:bg-gray-500 dark:text-white hover:bg-gray-300 px-4 py-2 rounded-lg"
            onClick={() => {
              navigate(`/gadgets/${title}`, {

                state: {
                  categoryId: categoryIds[category],
                }

              })
            }}
          >
            Xem thêm
          </button>
        </div>
      </div>

      <div className="relative group">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          navigation={{
            nextEl: navigationRefs[category].next.current,
            prevEl: navigationRefs[category].prev.current,
          }}
          modules={[Navigation]}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = navigationRefs[category].prev.current;
            swiper.params.navigation.nextEl = navigationRefs[category].next.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="relative"
        >
          {products[category]?.reduce((slides, product, index) => {
            if (index % 10 === 0) slides.push([]);
            slides[slides.length - 1].push(product);
            return slides;
          }, []).map((productGroup, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productGroup.map(product => renderProduct(product, category))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          ref={navigationRefs[category].prev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-gray-300 rounded-full p-2"
        >
          <ChevronLeft />
        </button>
        <button
          ref={navigationRefs[category].next}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-gray-300 rounded-full p-2"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
      {renderCategory("laptop", "Laptop")}
      {renderCategory("headphones", "Tai nghe")}
      {renderCategory("speakers", "Loa")}
      {renderCategory("phones", "Điện thoại")}
    </div>
  );
}
