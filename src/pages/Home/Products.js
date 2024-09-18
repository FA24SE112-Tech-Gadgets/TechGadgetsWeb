import React, { useEffect, useState, useRef } from 'react';
import { CiHeart } from 'react-icons/ci';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [swiper, setSwiper] = useState(null); 
  const filters = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'vivo', 'realme', 'ASUS', 'TECNO', 'Nokia', 'Infinix', 'Oneplus', 'Xem tất cả'];
  
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const fakeData = [
        {
          name: 'iPhone 16 Pro Max 256GB| Chính Hãng VN/A',
          image: 'https://s.net.vn/0hT0',
          price: 34990000,
          discount: 12,
          additionalDiscount: 300000,
        },
        {
          name: 'Samsung Galaxy S24 Ultra 12GB 256GB',
          image: 'https://s.net.vn/gsjW',
          price: 29990000,
          discount: 16,
          additionalDiscount: 600000,
        },
        {
          name: 'Xiaomi Mi 12 5G | Chính Hãng Xiaomi',
          image: 'https://s.net.vn/ry0D',
          price: 11990000,
          discount: 8,
          additionalDiscount: 200000,
        },
        {
          name: 'OPPO Find X5 Pro 5G 12GB|256GB Gen 5',
          image: 'https://s.net.vn/Nb72',
          price: 25990000,
          discount: 14,
          additionalDiscount: 400000,
        },
        {
          name: 'Vivo V23 5G Điện thoại (8GB/256GB) Chính Hãng',
          image: 'https://s.net.vn/FBc4',
          price: 17990000,
          discount: 10,
          additionalDiscount: 250000,
        },
        {
          name: 'realme GT Neo 3 80W 5G Chính Hãng',
          image: 'https://s.net.vn/uwCW',
          price: 13990000,
          discount: 7,
          additionalDiscount: 150000,
        },
        {
          name: 'ASUS ROG Phone 5 Snapdragon 888 Chính Hãng',
          image: 'https://s.net.vn/6ssP',
          price: 19990000,
          discount: 5,
          additionalDiscount: 300000,
        }
      ];
      setProducts(fakeData);
    };
    fetchData();
  }, []);

  const handleSwiperInit = (swiperInstance) => {
    setSwiper(swiperInstance);
  };

  const handleSlideChange = () => {
    if (swiper) {
      const { isBeginning, isEnd } = swiper;
      prevRef.current.style.opacity = isBeginning ? 0.5 : 1;
      nextRef.current.style.opacity = isEnd ? 0.5 : 1;
    }
  };

  return (
    <div data-aos="fade-up" className="container mx-auto px-5">
      <h2 className="text-3xl font-bold py-4">Điện Thoại Nổi Bật Nhất</h2>

      {/* Bộ lọc */}
      <div className="flex space-x-2 py-4">
        {filters.map((filter, index) => (
          <button key={index} className="bg-gray-200 dark:bg-gray-500 dark:text-white hover:bg-gray-300 px-4 py-2 rounded-lg">
            {filter}
          </button>
        ))}
      </div>

      {/* Swiper carousel */}
      <div className="relative">
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          navigation={{
            nextEl: nextRef.current,
            prevEl: prevRef.current,
          }}
          modules={[Navigation]}
          onInit={handleSwiperInit}
          onSlideChange={handleSlideChange}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div className="border p-4 rounded-lg shadow-md flex flex-col justify-between h-full">
                {/* Product image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />

                {/* Product details */}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <div className="text-red-500 font-semibold text-xl">
                    {product.price.toLocaleString()}đ
                  </div>
                </div>

                {/* Favorite button */}
                <button className="mt-4 text-red-500 flex items-center justify-end">
                  <CiHeart className="mr-2 text-3xl" /> Yêu thích
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation icons */}
        <div
          ref={prevRef}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 dark:bg-gray-100 dark:text-black rounded-full cursor-pointer shadow-md"
        >
          <GrFormPrevious size={24} />
        </div>
        <div
          ref={nextRef}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 dark:bg-gray-100 dark:text-black rounded-full cursor-pointer shadow-md"
        >
          <MdNavigateNext size={24} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
