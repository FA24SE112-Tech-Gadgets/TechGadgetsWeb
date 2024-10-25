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
import { toast ,ToastContainer } from 'react-toastify';

const laptopsId = "458d7752-e45e-444a-adf9-f7201c07acd1"
const headphonesId = "9f6ac480-e673-49ec-9bc0-7566cca80b86"
const speakersId = "bb65a310-e28e-4226-a562-0b6ea27f4faa"
const phonesId = "ea4183e8-5a94-401c-865d-e000b5d2b72d"


const apiBase = process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_DEV_API + "/"
  : process.env.REACT_APP_PRO_API + "/";

const categoryPaths = {
  laptops: `${apiBase}api/gadgets/category/${laptopsId}?Page=1&PageSize=100`,
  headphones: `${apiBase}api/gadgets/category/${headphonesId}?Page=1&PageSize=100`,
  speakers: `${apiBase}api/gadgets/category/${speakersId}?Page=1&PageSize=100`,
  phones: `${apiBase}api/gadgets/category/${phonesId}?Page=1&PageSize=100`
};

export default function ProductPage() {
  const { isAuthenticated } = useAuth();
  const [laptops, setLaptops] = useState([]);
  const [headphones, setHeadphones] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [phones, setPhones] = useState([]);

  const [brands, setBrands] = useState({
    laptops: [],
    headphones: [],
    speakers: [],
    phones: []
  });

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
        console.log("data", response.data.items);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchBrands = async (categoryId, categoryName) => {
      try {
        const response = await axios.get(
          `${apiBase}api/brands/categories/${categoryId}`
        );
        setBrands((prev) => ({ ...prev, [categoryName]: response.data.items }));
        console.log("brands", response.data.items);

      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    // Fetch products and brands for each category
    fetchCategoryProducts(categoryPaths.laptops, setLaptops);
    fetchBrands(laptopsId, 'laptops');

    fetchCategoryProducts(categoryPaths.headphones, setHeadphones);
    fetchBrands(headphonesId, 'headphones');

    fetchCategoryProducts(categoryPaths.speakers, setSpeakers);
    fetchBrands(speakersId, 'speakers');

    fetchCategoryProducts(categoryPaths.phones, setPhones);
    fetchBrands(phonesId, 'phones');

  }, [isAuthenticated]);

  const toggleFavorite = async (gadgetId, isFavorite, setProducts) => {
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
  const renderCategory = (products, title, navigationRefs, setProducts, categoryBrands) => (
    <div data-aos="fade-up" className="mb-10">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex flex-wrap space-x-2">
          {categoryBrands.map((brand, index) => (
            <a
              key={index}
              href={`/gadgets/${slugify(title)}/${brand.name.toLowerCase()}`}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded"
            >
              {brand.name}
            </a>
          ))}
          <a
            href={`/gadgets/${slugify(title)}`}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded"
          >
            Xem thêm
          </a>
        </div>
      </div>



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
      <ToastContainer />
      {renderCategory(laptops, "Laptops", laptopsNav, setLaptops, brands.laptops)}
      {renderCategory(headphones, "Tai Nghe", headphonesNav, setHeadphones, brands.headphones)}
      {renderCategory(speakers, "Loa", speakersNav, setSpeakers, brands.speakers)}
      {renderCategory(phones, "Điện Thoại", phonesNav, setPhones, brands.phones)}
    </div>
  );
}
