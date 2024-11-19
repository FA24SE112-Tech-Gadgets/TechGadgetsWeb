import React, { useState, useEffect } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { ToastContainer, toast } from 'react-toastify';
import { CloseCircleOutlined } from '@ant-design/icons';
import slugify from '~/ultis/config';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const GadgetHistory = () => {
  const [gadgets, setGadgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGadgetHistory = async () => {
      try {
        const response = await AxiosInterceptor.get('/api/gadget-histories');
        const fetchedGadgets = response.data.items.map(item => item.gadget).slice(0, 4); // Show only the first 4 gadgets
        setGadgets(fetchedGadgets);
      } catch (error) {
        toast.error('Failed to fetch gadget history');
      } finally {
        setLoading(false);
      }
    };

    fetchGadgetHistory();
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Sản phẩm đã xem</h1>
      <ToastContainer />
      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        navigation
        modules={[Navigation]}
        className="mySwiper"
      >
        {gadgets.length > 0 ? (
          gadgets.map((gadget) => (
            <SwiperSlide key={gadget.id}>
              <div
                onClick={() => navigate(`/gadget/detail/${slugify(gadget.name)}`, {
                  state: {
                    productId: gadget.id,
                  }
                })}
                className="relative p-4 border rounded-lg shadow-md w-76 cursor-pointer"
              >
                <div className="flex">


                  <img src={gadget.thumbnailUrl} alt={gadget.name} className="w-16 h-16 object-contain rounded mr-4" />
                  <div className="flex flex-col w-48">
                    <h3
                      className="font-semibold text-xs overflow-hidden overflow-ellipsis whitespace-nowrap"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1, // Only one line visible with ellipsis
                        whiteSpace: 'normal',
                      }}
                    >
                      {gadget.name}
                    </h3>
                    <div className="text-gray-500 text-sm mt-1">
                      {gadget.discountPercentage > 0 ? (
                        <>
                          <span className="text-red-500 font-bold">{gadget.discountPrice.toLocaleString()}₫</span>
                          <span className="text-gray-500 text-xs ml-2 line-through">{gadget.price.toLocaleString()}₫</span>
                          <span className="text-gray-500 font-semibold text-xs ml-2">-{gadget.discountPercentage}%</span>
                        </>
                      ) : (
                        <span className="text-gray-800 font-semibold text-sm">{gadget.price.toLocaleString()}₫</span>
                      )}
                    </div>
                    {gadget.status === "Inactive" ? (
                     <div className="text-red-500 font-bold text-sm">
                        Sản phẩm đã bị khóa
                      </div>
                    ) : !gadget.isForSale && (
                      <div className="text-red-500 font-bold text-sm">
                        Ngừng kinh doanh
                      </div>
                    )}
                    {/* {!gadget.isForSale && (
                      <div className="text-red-500 font-bold text-sm">
                        Ngừng kinh doanh
                      </div>
                    )} */}
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))
        ) : (
          <p>Không có sản phẩm đã xem gần đây.</p>
        )}
      </Swiper>
    </div>
  );
};

export default GadgetHistory;
