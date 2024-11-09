import React, { useState, useEffect, useRef } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { ToastContainer, toast } from 'react-toastify';
import { CiHeart } from 'react-icons/ci';
import { useLocation, useNavigate } from 'react-router-dom';
import slugify from '~/ultis/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SuggestGadget = () => {
  const [suggestedGadgets, setSuggestedGadgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = location.state || {};

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchSuggestedGadgets = async () => {
      try {
        const response = await AxiosInterceptor.get(`/api/gadgets/suggested/${productId}`);
        setSuggestedGadgets(response.data.items);
      } catch (error) {
        toast.error('Failed to fetch suggested gadgets');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedGadgets();
  }, [productId]);

  const toggleFavorite = async (gadgetId, isFavorite) => {
    try {
      await AxiosInterceptor.post(`/api/favorite-gadgets/${gadgetId}`);
      setSuggestedGadgets((prev) =>
        prev.map((product) =>
          product.id === gadgetId ? { ...product, isFavorite: !product.isFavorite } : product
        )
      );
      toast.success(isFavorite ? 'Xóa khỏi yêu thích thành công' : 'Thêm vào yêu thích thành công');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
          <div className="h-4 w-4 bg-white rounded-full"></div>
        </div>
        <span className="ml-2 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Gợi ý sản phẩm cho bạn</h1>
      <ToastContainer />
      <div className="relative group">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.update();
            });
          }}
          onReachBeginning={() => prevRef.current.classList.add('hidden')}
          onReachEnd={() => nextRef.current.classList.add('hidden')}
          onFromEdge={() => {
            prevRef.current.classList.remove('hidden');
            nextRef.current.classList.remove('hidden');
          }}
          className="relative"
        >
          {suggestedGadgets.length > 0 ? (
            suggestedGadgets.map((product) => (
              <SwiperSlide key={product.id}>
                <div
                  className="border-1 rounded-2xl shadow-sm flex flex-col justify-between relative transition-transform duration-200 transform-gpu hover:scale-105 hover:border-primary/50 overflow-hidden bg-gray-100"
                  onClick={() =>
                    navigate(`/gadget/detail/${slugify(product.name)}`, {
                      state: { productId: product.id },
                    })
                  }
                >
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold text-center py-1 px-2 rounded-tr-md rounded-b-md">
                      Giảm {`${product.discountPercentage}%`}
                    </div>
                  )}
                  {product.isForSale === false && (
                    <div className="absolute top-1/3 left-0 transform -translate-y-1/2 w-full bg-red-500 text-white text-xs font-bold text-center py-1 rounded">
                      Ngừng kinh doanh
                    </div>
                  )}
                  <div className="p-2 flex-grow cursor-pointer">
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-full h-24 object-contain mb-2 rounded-xl"
                    />
                    <h3
                      className="font-semibold text-xs overflow-hidden overflow-ellipsis whitespace-nowrap"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex py-2">
                      {product.discountPercentage > 0 ? (
                        <>
                          <div className="text-red-500 font-semibold text-xs mr-2">
                            {product.discountPrice.toLocaleString()}₫
                          </div>
                          <span className="line-through text-gray-500 text-xs">
                            {product.price.toLocaleString()}₫
                          </span>
                        </>
                      ) : (
                        <div className="text-gray-800 font-semibold text-xs">
                          {product.price.toLocaleString()}₫
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="w-full text-xs flex items-center justify-end px-2 py-1 text-gray-500">
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
                            className="h-6 w-4 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <CiHeart className="h-6 w-4 text-gray-500" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p>Không có gợi ý sản phẩm nào.</p>
          )}
        </Swiper>
        <button
          ref={prevRef}
          className="absolute left-0 z-10 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-md"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          ref={nextRef}
          className="absolute right-0 z-10 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-md"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default SuggestGadget;