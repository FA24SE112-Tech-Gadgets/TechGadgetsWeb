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
    name: "Điện thoại/Máy tính bảng",
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
      {
        subcategory: "Mức giá",
        items: [
          { name: "Dưới 5 triệu", link: "/products/under-5m" },
          { name: "5-10 triệu", link: "/products/5-10m" },
          { name: "Trên 10 triệu", link: "/products/above-10m" },
          { name: "10-15 triệu", link: "/products/10-15m" },
          { name: "15-20 triệu", link: "/products/15-20m" },
          { name: "Trên 20 triệu", link: "/products/above-20m" }
        ]
      },
      {
        subcategory: "Điện thoại hot",
        items: [
          { name: "iPhone 15 Pro Max", link: "/products/iphone-15-pro-max" },
          { name: "Samsung Galaxy Z Fold 5", link: "/products/samsung-galaxy-z-fold-5" },
          { name: "Xiaomi 13 Pro", link: "/products/xiaomi-13-pro" },
          { name: "Oppo Find X6 Pro", link: "/products/oppo-find-x6-pro" },
          { name: "Google Pixel 8 Pro", link: "/products/google-pixel-8-pro" }
        ]
      },
      {
        subcategory: "Hãng máy tính bảng",
        items: [
          { name: "iPad", link: "/products/ipad" },
          { name: "Samsung", link: "/products/samsung-tablets" },
          { name: "Xiaomi", link: "/products/xiaomi-tablets" },
          { name: "Huawei", link: "/products/huawei-tablets" },
          { name: "Lenovo", link: "/products/lenovo-tablets" },
          { name: "Nokia", link: "/products/nokia-tablets" },
          { name: "Teclast", link: "/products/teclast-tablets" },
          { name: "Máy đọc sách", link: "/products/e-readers" },
          { name: "Kindle", link: "/products/kindle" },
        ]
      },
      {
        subcategory: "Sản phẩm nổi bật",
        items: [
          { name: "iPad Air 2024", link: "/products/ipad-air-2024" },
          { name: "iPad Pro 2024", link: "/products/ipad-pro-2024" },
          { name: "Galaxy Tab S9 FE 5G", link: "/products/galaxy-tab-s9-fe-5g" },
          { name: "Galaxy Tab S9 Ultra", link: "/products/galaxy-tab-s9-ultra" },
          { name: "Xiaomi Pad 6 256GB", link: "/products/xiaomi-pad-6-256gb" },
          { name: "Huawei Matepad 11.5''S", link: "/products/huawei-matepad-11-5" },
          { name: "Xiaomi Pad SE", link: "/products/xiaomi-pad-se" },
          { name: "Xiaomi Redmi Pad Pro", link: "/products/xiaomi-redmi-pad-pro" }
        ]
      }
      
      
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
      
      {
        subcategory: "Phân khúc giá",
        items: [
          { name: "Dưới 10 triệu", link: "/products/under-10m" },
          { name: "10-20 triệu", link: "/products/10-20m" },
          { name: "Trên 20 triệu", link: "/products/above-20m" },
          { name: "20-30 triệu", link: "/products/20-30m" },
          { name: "30-40 triệu", link: "/products/30-40m" },
          { name: "Trên 40 triệu", link: "/products/above-40m" }
        ]
      },
      
      {
        subcategory: "Nhu cầu sử dụng",
        items: [
          { name: "Laptop gaming", link: "/products/laptop-gaming" },
          { name: "Máy tính văn phòng", link: "/products/office-pc" },
          { name: "Máy tính đồ họa", link: "/products/graphic-pc" },
          { name: "Laptop mỏng nhẹ", link: "/products/ultrabook" },
          { name: "Văn phòng", link: "/products/office" },
          { name: "Gaming", link: "/products/gaming" },
          { name: "Mỏng nhẹ", link: "/products/thin-light" },
          { name: "Đồ họa - Kỹ thuật", link: "/products/graphic-technical" },
          { name: "Cảm ứng", link: "/products/touch" },
        ]
      },
      {
        subcategory: "Dòng chip",
        items: [
          { name: "Laptop Core i3", link: "/products/laptop-core-i3" },
          { name: "Laptop Core i5", link: "/products/laptop-core-i5" },
          { name: "Laptop Core i7", link: "/products/laptop-core-i7" },
          { name: "Laptop Core i9", link: "/products/laptop-core-i9" },
          { name: "Apple M1 Series", link: "/products/apple-m1-series" },
          { name: "Apple M2 Series", link: "/products/apple-m2-series" },
          { name: "Apple M3 Series", link: "/products/apple-m3-series" },
          { name: "AMD Ryzen", link: "/products/amd-ryzen" },
          { name: "Intel Core Ultra", link: "/products/intel-core-ultra" }
        ]
      }      
      
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
        subcategory: "Loại đồng hồ",
        items: [
          { name: "Đồng hồ thông minh", link: "/products/smartwatch" },
          { name: "Vòng đeo tay thông minh", link: "/products/smartband" },
          { name: "Đồng hồ định vị trẻ em", link: "/products/kid-gps-watch" },
          { name: "Dây đeo", link: "/products/watch-strap" }
        ]
      },
      
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
      
      {
        subcategory: "Sản phẩm nổi bật",
        items: [
          { name: "Apple Watch Series 10 ", link: "/products/apple-watch-series-10" },
          { name: "Apple Watch Series 9", link: "/products/apple-watch-series-9" },
          { name: "Samsung Galaxy Watch 7 ", link: "/products/samsung-galaxy-watch-7" },
          { name: "Samsung Galaxy Watch Ultra ", link: "/products/samsung-galaxy-watch-ultra" },
          { name: "Apple Watch Ultra 2 2023", link: "/products/apple-watch-ultra-2-2023" },
          { name: "Apple Watch SE", link: "/products/apple-watch-se" },
          { name: "Xiaomi Watch 2", link: "/products/xiaomi-watch-2" },
          { name: "Garmin Lily 2", link: "/products/garmin-lily-2" },
          { name: "Huawei Watch GT4", link: "/products/huawei-watch-gt4" },
        ]
      }
      
    ]
  },
  {
    icon: (
      <svg className="h-8 w-8 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
    ),
    name: "Phụ kiện",
    details: [
      {
        subcategory: "Phụ kiện di động",
        items: [
          { name: "Phụ kiện di động", link: "/products/mobile-accessories" },
          { name: "Phụ kiện Apple", link: "/products/apple-accessories" },
          { name: "Dán màn hình", link: "/products/screen-protectors" },
          { name: "Ốp lưng - Bao da", link: "/products/cases-covers" },
          { name: "Thẻ nhớ", link: "/products/memory-cards" },
          { name: "Apple Care+", link: "/products/apple-care" },
          { name: "Samsung Care+", link: "/products/samsung-care" },
          { name: "Sim 4G", link: "/products/4g-sim" },
          { name: "Cáp, sạc", link: "/products/cables-chargers" },
        ]
      },
      {
        subcategory: "Phụ kiện Laptop",
        items: [
          { name: "Phụ kiện Laptop", link: "/products/laptop-accessories" },
          { name: "Chuột, bàn phím", link: "/products/mouse-keyboard" },
          { name: "Balo Laptop | Túi chống sốc", link: "/products/laptop-bags" },
          { name: "Sạc laptop", link: "/products/laptop-chargers" }
        ]
      },
      {
        subcategory: "Phụ kiện khác",
        items: [
          { name: "Phần mềm", link: "/products/software" },
          { name: "Webcam", link: "/products/webcams" },
          { name: "Giá đỡ", link: "/products/stands" },
          { name: "Thảm, lót chuột", link: "/products/mouse-pads" }
        ]
      },
      {
        subcategory: "Thiết bị mạng",
        items: [
          { name: "Thiết bị mạng", link: "/products/network-devices" },
          { name: "Thiết bị phát sóng WiFi", link: "/products/wifi-routers" },
          { name: "Bộ phát wifi di động", link: "/products/mobile-wifi" },
          { name: "Bộ kích sóng WiFi", link: "/products/wifi-extenders" },
          { name: "Xem tất cả thiết bị mạng", link: "/products/all-network-devices" }
        ]
      }
      
    ]
  },
  {
    name: "PC/Màn hình/Máy in",
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
      {
        subcategory: "Linh kiện máy tính",
        items: [
          { name: "CPU", link: "/products/cpu" },
          { name: "Main", link: "/products/motherboard" },
          { name: "RAM", link: "/products/ram" },
          { name: "Ổ cứng", link: "/products/storage" },
          { name: "Nguồn", link: "/products/power-supply" },
          { name: "VGA", link: "/products/graphics-card" },
          { name: "Tản nhiệt", link: "/products/cooling" },
          { name: "Case", link: "/products/case" },
          { name: "Xem tất cả", link: "/products/all-computer-parts" }
        ]
      },
      {
        subcategory: "Chọn màn hình theo hãng",
        items: [
          { name: "ASUS", link: "/products/asus-monitors" },
          { name: "Samsung", link: "/products/samsung-monitors" },
          { name: "DELL", link: "/products/dell-monitors" },
          { name: "LG", link: "/products/lg-monitors" },
          { name: "MSI", link: "/products/msi-monitors" },
          { name: "Acer", link: "/products/acer-monitors" },
          { name: "Xiaomi", link: "/products/xiaomi-monitors" },
          { name: "ViewSonic", link: "/products/viewsonic-monitors" },
          { name: "Philips", link: "/products/philips-monitors" },
        ]
      },
      {
        subcategory: "Chọn màn hình theo nhu cầu",
        items: [
          { name: "Gaming", link: "/products/gaming-monitors" },
          { name: "Văn phòng", link: "/products/office-monitors" },
          { name: "Đồ họa", link: "/products/graphic-monitors" },
          { name: "Lập trình", link: "/products/programming-monitors" },
          { name: "Màn hình di động", link: "/products/mobile-monitors" },
          { name: "Arm màn hình", link: "/products/monitor-arms" },
          { name: "Xem tất cả", link: "/products/all-monitors" }
        ]
      },
      {
        subcategory: "Gaming Gear",
        items: [
          { name: "PlayStation", link: "/products/playstation" },
          { name: "ROG Ally", link: "/products/rog-ally" },
          { name: "Bàn phím Gaming", link: "/products/gaming-keyboards" },
          { name: "Chuột chơi game", link: "/products/gaming-mice" },
          { name: "Tai nghe Gaming", link: "/products/gaming-headsets" },
          { name: "Tay cầm chơi Game", link: "/products/gaming-controllers" },
          { name: "Xem tất cả", link: "/products/all-gaming-gear" }
        ]
      },
      {
        subcategory: "Thiết bị văn phòng",
        items: [
          { name: "Máy in", link: "/products/printers" },
          { name: "Phần mềm", link: "/products/software" },
          { name: "Decor bàn làm việc", link: "/products/desk-decor" }
        ]
      }
    ]
  },
  {
    icon: (
      <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="2" y1="8" x2="22" y2="8" />
        <path d="M15 19H9v-2h6v2z" />
      </svg>
    ),
    name: "Tivi",
    details: [
      {
        subcategory: "Hãng Tivi",
        items: [
          { name: "Samsung", link: "/products/samsung-tv" },
          { name: "LG", link: "/products/lg-tv" },
          { name: "Xiaomi", link: "/products/xiaomi-tv" },
          { name: "Coocaa", link: "/products/coocaa-tv" },
          { name: "Sony", link: "/products/sony-tv" },
          { name: "Toshiba", link: "/products/toshiba-tv" },
          { name: "TCL", link: "/products/tcl-tv" },
          { name: "Hisense", link: "/products/hisense-tv" },
        ]
      },
      {
        subcategory: "Mức giá",
        items: [
          { name: "Dưới 5 triệu", link: "/products/under-5-million" },
          { name: "Từ 5 - 9 triệu", link: "/products/5-9-million" },
          { name: "Từ 9 - 12 triệu", link: "/products/9-12-million" },
          { name: "Từ 12 - 15 triệu", link: "/products/12-15-million" },
          { name: "Trên 15 triệu", link: "/products/above-15-million" },
        ]
      },
      {
        subcategory: "Độ phân giải",
        items: [
          { name: "Tivi 4K", link: "/products/4k-tv" },
          { name: "Tivi 8K", link: "/products/8k-tv" },
          { name: "Tivi Full HD", link: "/products/full-hd-tv" },
          { name: "Tivi OLED", link: "/products/oled-tv" },
          { name: "Tivi QLED", link: "/products/qled-tv" },
          { name: "Android Tivi", link: "/products/android-tv" },
        ]
      },
      {
        subcategory: "Kích thước",
        items: [
          { name: "Tivi 32 inch", link: "/products/32-inch-tv" },
          { name: "Tivi 43 inch", link: "/products/43-inch-tv" },
          { name: "Tivi 50 inch", link: "/products/50-inch-tv" },
          { name: "Tivi 55 inch", link: "/products/55-inch-tv" },
          { name: "Tivi 65 inch", link: "/products/65-inch-tv" },
          { name: "Tivi 70 inch", link: "/products/70-inch-tv" },
          { name: "Tivi 85 inch", link: "/products/85-inch-tv" },
        ]
      },
      {
        subcategory: "Sản phẩm nổi bật ⚡",
        items: [
          { name: "Xiaomi TV Max 86 inch", link: "/products/xiaomi-tv-max-86-inch" },
          { name: "Tivi Xiaomi A Pro 55 inch 4K", link: "/products/xiaomi-a-pro-55-inch-4k" },
          { name: "Tivi LG Stanby Me 27 inch", link: "/products/lg-stanby-me-27-inch" },
          { name: "Tivi Xiaomi A 32 inch HD", link: "/products/xiaomi-a-32-inch-hd" },
          { name: "Tivi Samsung QLED 55\" 55Q60BAK", link: "/products/samsung-qled-55-55q60bak" }
        ]
      }
    ]
  }
  
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
