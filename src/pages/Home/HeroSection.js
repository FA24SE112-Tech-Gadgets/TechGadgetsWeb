import React, { useState } from "react";
import Image1 from "../../assets/hero/camera.png";
import Image2 from "../../assets/hero/laptop.png";
import Image3 from "../../assets/hero/sale.png";
import Slider from "react-slick";
import { Link } from "react-router-dom";

// Image list for the slider
const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Giảm giá tới 50% cho các loại máy quay phim",
    description:
      "Nâng cấp video của bạn với các máy ảnh được đánh giá cao với giá không thể tốt hơn. Đừng bỏ lỡ các ưu đãi tốt nhất của năm.",
  },
  {
    id: 2,
    img: Image2,
    title: "Giảm giá 30% cho các Laptop Gaming",
    description:
      "Có những trải nghiệm tốt hơn trong công việc hoặc giải trí với dòng laptop giảm giá của chúng tôi. Ưu đãi có thời hạn!",
  },
  {
    id: 3,
    img: Image3,
    title: "Giảm giá 70% cho các phụ kiện công nghệ",
    description:
      "Hoàn thiện góc nhỏ công nghệ của bạn với các thiết bị công nghệ của chúng tôi, từ sạc đến vỏ máy, tất cả đều giảm giá đáng kinh ngạc.",
  },
];

// List of categories for the left sidebar
const categories = [
  {
    name: "Điện thoại",
    icon: (
      <svg className="h-8 w-8 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    details: [
      {
        subcategory: "Hãng điện thoại",
        items: [
          { name: "iPhone", link: "/gadget/iphone" },
          { name: "Samsung", link: "/products/samsung" },
          { name: "Xiaomi", link: "/products/xiaomi" },
          { name: "Oppo", link: "/products/oppo" },
          { name: "Vivo", link: "/products/vivo" },
          { name: "Realme", link: "/products/realme" },
          { name: "OnePlus", link: "/products/oneplus" },
          { name: "Sony", link: "/products/sony" },
          { name: "Nokia", link: "/products/nokia" },
          { name: "Huawei", link: "/products/huawei" }
        ]

      },     
    ]
  },
  {
    icon: (
      <svg className="h-8 w-8 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <rect x="3" y="4" width="18" height="12" rx="1" />
        <line x1="7" y1="20" x2="17" y2="20" />
        <line x1="9" y1="16" x2="9" y2="20" />
        <line x1="15" y1="16" x2="15" y2="20" />
      </svg>
    ),
    name: "Máy tính",
    details: [
      {
        subcategory: "Thương hiệu",
        items: [
          { name: "Dell", link: "/products/dell" },
          { name: "HP", link: "/products/hp" },
          { name: "Lenovo", link: "/products/lenovo" },
          { name: "Mac", link: "/gadget/mac" },
          { name: "Asus", link: "/products/asus" },
          { name: "Acer", link: "/products/acer" },
          { name: "MSI", link: "/products/msi" },
          { name: "Razer", link: "/products/razer" },
          { name: "Samsung", link: "/products/samsung" }
        ]
      },
        ]
  },
  {
    icon: (
      <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <polyline points="12 9 12 12 13.5 13.5" />
        <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
      </svg>
    ),
    name: "Đồng hồ",
    details: [
      {
        subcategory: "Hãng đồng hồ",
        items: [
          { name: "Apple Watch", link: "/products/apple-watch" },
          { name: "Samsung", link: "/products/samsung-watch" },
          { name: "Xiaomi", link: "/products/xiaomi-watch" },
          { name: "Huawei", link: "/products/huawei-watch" },
          { name: "Coros", link: "/products/coros-watch" },
          { name: "Garmin", link: "/products/garmin-watch" },
          { name: "Kieslect", link: "/products/kieslect-watch" },
          { name: "Amazfit", link: "/products/amazfit-watch" },
        ]
      },
    ]
  },
 
  {
    name: "Loa",
    icon: (
      <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
        <line x1="2" y1="19" x2="22" y2="19" />
        <line x1="6" y1="2" x2="6" y2="5" />
        <line x1="18" y1="2" x2="18" y2="5" />
      </svg>
    ),
    details: [
      {
        subcategory: "Loại PC",
        items: [
          { name: "Build PC", link: "/products/build-pc" },
          { name: "Cấu hình sẵn", link: "/products/preset-pc" },
          { name: "All In One", link: "/products/all-in-one-pc" },
          { name: "PC bộ", link: "/products/desktop-pc" },
          { name: "Chọn PC theo nhu cầu", link: "/products/select-pc-by-need" },
          { name: "Gaming", link: "/products/gaming-pc" },
          { name: "Đồ họa", link: "/products/graphic-pc" },
          { name: "Văn phòng", link: "/products/office-pc" }
        ]
      },

    ]
  },
 
  
];


// Promotional image list
const promoImages = [Image1, Image2, Image3];

const HeroSection = ({ handleOrderPopup }) => {
  // State to track the hovered category
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isHoveringDetails, setIsHoveringDetails] = useState(false);

  // Slider settings
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  const handleMouseEnterCategory = (index) => {
    setHoveredCategory(index);
    setIsHoveringDetails(true);
  };

  const handleMouseLeaveCategory = () => {
    setIsHoveringDetails(false);
  };

  const handleMouseEnterDetails = () => {
    setIsHoveringDetails(true);
  };

  const handleMouseLeaveDetails = () => {
    setIsHoveringDetails(false);
    setHoveredCategory(null);
  };

  return (
    <div className="relative overflow-hidden min-h-[700px] sm:min-h-[400px] bg-gray-100 flex dark:bg-gray-950 dark:text-white duration-200 p-5">
      {/* background pattern */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>

      {/* Main section */}
      <div className="container flex gap-4 justify-center sm:pb-0 relative">

        {/* Left Sidebar */}
        <div className="w-[200px] h-[300px] bg-white dark:bg-gray-800 rounded-lg p-4 relative z-20">
          <ul className="space-y-3">
            {categories.map((category, index) => (
              <li
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => handleMouseEnterCategory(index)}
                onMouseLeave={handleMouseLeaveCategory}
              >
                <div className="text-gray-800 dark:text-white flex items-center">
                  {category.icon && category.icon}
                  {category.name}
                </div>
              </li>
            ))}
          </ul>
          {/* Details on hover */}
          {(hoveredCategory !== null || isHoveringDetails) && (
            <div
              className="absolute top-0 left-full ml-2 h-[300px] w-[955px] bg-white dark:bg-gray-900 p-4 space-x-4 flex z-30"
              onMouseEnter={handleMouseEnterDetails}
              onMouseLeave={handleMouseLeaveDetails}
            >
              {categories[hoveredCategory]?.details.map((detail, idx) => (
                <div key={idx} className="flex-1 min-w-[100px]  space-y-4">
                  <div className="font-semibold text-gray-600 dark:text-gray-300">
                    {detail.subcategory}
                  </div>
                  <ul className="list-none list-inside space-y-2">
                    {detail.items.map((item, id) => (
                      <li key={id} className="text-gray-600 dark:text-gray-300">
                        <Link to={item.link} className="hover:underline">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slider Container */}
        <div className="flex-grow sm:pb-0 border-1 border-gray-500 rounded-lg h-[300px] w-[700px] relative z-10">
          <Slider {...settings}>
            {ImageList.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 ">
                  {/* text content section */}
                  <div className="flex flex-col justify-center gap-4 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                    <h1
                      data-aos="zoom-out"
                      data-aos-duration="500"
                      data-aos-once="true"
                      className="text-5xl sm:text-1xl lg:text-2xl font-bold"
                    >
                      {data.title}
                    </h1>
                    <p
                      data-aos="fade-up"
                      data-aos-duration="500"
                      data-aos-delay="100"
                      className="text-sm"
                    >
                      {data.description}
                    </p>
                    <div
                      data-aos="fade-up"
                      data-aos-duration="500"
                      data-aos-delay="300"
                    >
                    </div>
                  </div>
                  {/* image section */}
                  <div className="order-1 sm:order-2">
                    <div
                      data-aos="zoom-in"
                      data-aos-once="true"
                      className="relative z-10"
                    >
                      <img
                        src={data.img}
                        alt={data.title}
                        className="w-[300px] h-[300px] sm:h-[300px] sm:w-[200px] sm:scale-105 lg:scale-120 object-contain mx-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Sidebar (Framed Promotional Images) */}
        <div className="h-[300px] w-[200px] bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 relative z-10">
          <div className="space-y-4">
            {promoImages.map((img, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={img}
                  alt={`Promo ${index + 1}`}
                  className="rounded-lg object-cover w-full h-[60px] hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
