import React, { useEffect, useState } from "react";
import Image1 from "../../assets/hero/camera.png";
import Image2 from "../../assets/hero/laptop.png";
import Image3 from "../../assets/hero/sale.png";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import slugify from "~/ultis/config";
import { Button } from "antd";
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

const fetchBrandsForCategories = async (navigate) => {
  try {
    const categoriesResponse = await axios.get(
      process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/categories`
        : `${process.env.REACT_APP_PRO_API}/api/categories`
    );

    const categoriesData = categoriesResponse.data.items;

    const updatedCategories = await Promise.all(
      categoriesData.map(async (category) => {
        const brands = [];
        let page = 1;
        const pageSize = 50; // Giả sử số lượng item mỗi trang là 50
        let hasNextPage = true;

        while (hasNextPage) {
          try {
            const brandsResponse = await axios.get(
              `${process.env.REACT_APP_DEV_API || process.env.REACT_APP_PRO_API}/api/brands/categories/${category.id}?page=${page}&pageSize=${pageSize}`
            );

            const brandsPage = brandsResponse.data.items || [];
            brands.push(...brandsPage); // Gộp thương hiệu mới vào mảng tổng

            hasNextPage = brandsResponse.data.hasNextPage;
            page++; // Tăng page để lấy trang tiếp theo
          } catch (error) {
            console.error(`Error fetching brands for category ${category.name}`, error);
            break; // Nếu có lỗi, thoát khỏi vòng lặp
          }
        }

        // Chia thành từng cột 10 thương hiệu
        const brandColumns = [];
        const columnSize = Math.ceil(brands.length / 3); // Tính kích thước cột

        for (let i = 0; i < brands.length; i += columnSize) {
          brandColumns.push(brands.slice(i, i + columnSize)); // Tạo mảng các cột thương hiệu
        }

        return {
          name: category.name,
          icon: getCategoryIcon(category.name),
          details: [
            {
              subcategory: `Hãng ${category.name}`,
              items: brandColumns.map((column) =>
                column.map((brand) => ({
                  name: brand.name,
                  navigate: () =>     navigate(`/gadgets/${slugify(category.name)}/${slugify(brand.name)}`, {

                    state: {
                      categoryId: category.id,
                      brandId: brand.id
                    }
    
                  })
                }))
              )
            }
          ]
        };
      })
    );

    return updatedCategories;
  } catch (error) {
    console.error("Error fetching categories or brands", error);
    return [];
  }
};


const getCategoryIcon = (categoryName) => {
  switch (categoryName.toLowerCase()) {
    case 'laptop':
      return (
        <svg
          className="h-8 w-8 text-yellow-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3h18v12H3z" />
          <path d="M2 16h20v2H2z" />
          <path d="M4 16V4h16v12H4z" />
        </svg>
      );


    case 'tai nghe':
      return (
        <svg
          className="h-8 w-8 text-yellow-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a9 9 0 00-9 9v3a3 3 0 006 0v-3a3 3 0 006 0v3a3 3 0 006 0v-3a9 9 0 00-9-9z" />
          <path d="M12 21v1" />
        </svg>
      );


    case 'loa':
      return (
        <svg
          className="h-8 w-8 text-yellow-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M9 9h6v6H9z" />
          <line x1="3" y1="12" x2="0" y2="12" />
          <line x1="24" y1="12" x2="21" y2="12" />
        </svg>
      );


    case 'điện thoại':
      return (
        <svg
          className="h-8 w-8 text-yellow-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
          <path d="M9 4h6" />
          <path d="M9 20h6" />
        </svg>
      );


    default:
      return null;
  }
};

const promoImages = [Image1, Image2, Image3];

const HeroSection = ({ handleOrderPopup }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isHoveringDetails, setIsHoveringDetails] = useState(false);
  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchBrandsForCategories(navigate);
      setCategories(fetchedCategories);
    };

    loadCategories();
  }, [navigate]);

  const handleMouseEnterCategory = (index) => {
    setHoveredCategory(index);
    setIsHoveringDetails(true);
  };

  const handleMouseLeaveCategory = () => {
    setIsHoveringDetails(false);
  };

  const handleBrandClick = (navigateFunction) => {
    if (typeof navigateFunction === 'function') {
      navigateFunction();
    }
  };


  const handleMouseEnterDetails = () => {
    setIsHoveringDetails(true);
  };

  const handleMouseLeaveDetails = () => {
    setIsHoveringDetails(false);
    setHoveredCategory(null);
  };
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

  return (
    <div className="relative overflow-hidden min-h-[800px] sm:min-h-[100px] bg-gray-100 flex dark:bg-gray-950 dark:text-white duration-200 p-5">
      {/* background pattern */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>

      {/* Main section */}
      <div className="container flex gap-2 justify-center sm:pb-0 relative">

        {/* Left Sidebar */}
        <div className="w-[200px] h-[300px] bg-white dark:bg-gray-800 rounded-lg p-4 relative z-20">
          <div className="h-[400px] flex flex-col justify-between p-4">
          <ul className="flex flex-col">
            {categories.map((category, index) => (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnterCategory(index)}
                onMouseLeave={handleMouseLeaveCategory}
                className="flex items-center gap-2 cursor-pointer mb-5"
              >
                {category.icon}
                <h3>{category.name}</h3>
              </li>
            ))}
          </ul>
          </div>
         
          {/* Brands Panel - Đặt phần này ở cùng vị trí */}
          
          {(hoveredCategory !== null || isHoveringDetails) && (
            <div
              className="absolute top-0 left-full ml-2 overflow-y-auto w-[955px] bg-white dark:bg-gray-900 p-4 space-x-4 flex z-30"
              onMouseEnter={handleMouseEnterDetails}
              onMouseLeave={handleMouseLeaveDetails}
            >
              {categories[hoveredCategory]?.details.map((detail, idx) => (
                <div key={idx} className="flex-1 min-w-[100px] space-y-4">
                  <div className="font-semibold text-gray-600 dark:text-gray-300">
                    {detail.subcategory}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {detail.items.map((brandColumn, columnIndex) => (
                      <ul key={columnIndex} className="list-none list-inside space-y-2">
                        {brandColumn.map((item, id) => (
                          <li key={id} className="text-gray-600 dark:text-gray-300"   onClick={() => handleBrandClick(item.navigate)}>
                            <div className="hover:underline">
                              {item.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
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
                        className="w-[300px] h-[300px] sm:h-[300px] sm:w-[200px] sm:scale-105 lg:scale -120 object-contain mx-auto"
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
