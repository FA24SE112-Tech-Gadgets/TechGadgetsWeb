import React from "react";
import Img1 from "~/assets/topproduct/topproduct.png";
import Img2 from "~/assets/topproduct/topproduct2.png";
import Img3 from "~/assets/topproduct/topproduct3.png";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Điện thoại thông minh",
    description:
      "Khám phá các điện thoại thông minh mới nhất với công nghệ tiên tiến, thiết kế để giữ bạn kết nối và làm việc hiệu quả.",
  },
  {
    id: 2,
    img: Img2,
    title: "Màn hình 4K",
    description:
      "Trải nghiệm hình ảnh tuyệt đẹp với màn hình 4K UHD hàng đầu của chúng tôi, hoàn hảo cho chơi game và sử dụng chuyên nghiệp.",
  },
  {
    id: 3,
    img: Img3,
    title: "Tai nghe không dây",
    description:
      "Thưởng thức âm thanh chất lượng cao và kết nối liền mạch với tai nghe không dây cao cấp của chúng tôi.",
  },
];

const TopProducts = ({ handleOrderPopup }) => {
  return (
    <div>
      <div className="container">
        {/* Header section */}
        <div className="text-left pt-5 mb-24">
          <p data-aos="fade-up" className="text-sm text-primary">
            Những sản phẩm được đánh giá cao
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Các sản phẩm tốt nhất
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
          Nâng tầm trải nghiệm số với những thiết bị điện tử hàng đầu, giúp cuộc sống của bạn trở nên thông minh và tiện lợi hơn
          </p>
        </div>
        {/* Body section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center">
          {ProductsData.map((data) => (
            <div
              data-aos="zoom-in"
              className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
            >
              {/* image section */}
              <div className="h-[100px]">
                <img
                  src={data.img}
                  alt=""
                  className="max-w-[180px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                />
              </div>
              {/* details section */}
              <div className="p-4 text-center">
                {/* star rating */}
                <div className="w-full flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>
                <h1 className="text-xl font-bold">{data.title}</h1>
                <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                  {data.description}
                </p>
           
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
