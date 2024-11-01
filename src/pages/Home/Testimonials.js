import React from "react";
import Slider from "react-slick";

const TestimonialData = [
  {
    id: 1,
    name: "Nguyễn Văn Hùng",
    text: "Cổng thông tin Tech-Gadgets đã giúp tôi tìm được các thiết bị công nghệ tiên tiến phù hợp với nhu cầu bản thân. ",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Phạm Ngọc Lan",
    text: "Tôi rất ấn tượng với sự đa dạng sản phẩm trên trang này. Mọi thứ từ laptop đến phụ kiện đều có mức giá tốt và chất lượng đảm bảo.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Đỗ Minh Khoa",
    text: "Tech-Gadgets thực sự là nơi lý tưởng để tìm kiếm các sản phẩm công nghệ mới nhất với giá cạnh tranh.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 5,
    name: "Lê Vũ Thu Phương",
    text: "Tôi đã tìm được chiếc điện thoại mình mong muốn nhờ chức năng tìm kiếm nâng cao của cổng thông tin này.",
    img: "https://picsum.photos/103/103",
  },
];


const Testimonials = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-10 mb-10">
      <div className="container">
        {/* header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Đánh giá từ khách hàng
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Những phản hồi của khách hàng về sản phẩm, dịch vụ
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
          Mua sắm dễ dàng, trải nghiệm tuyệt vời - Tech Gadgets luôn đồng hành cùng bạn
          </p>
        </div>

        {/* Testimonial cards */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div className="my-6" key={data.id}>
                <div
                  className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-700 bg-primary/10 relative"
                >
                  <div className="mb-4">
                    <img
                      src={data.img}
                      alt=""
                      className="rounded-full w-20 h-20"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 dark:text-gray-300">{data.text}</p>
                      <h1 className="text-xl font-bold text-black/80 dark:text-light dark:text-gray-300">
                        {data.name}
                      </h1>
                    </div>
                  </div>
                  <p className="text-black/20 text-9xl font-serif absolute top-0 right-0 dark:text-gray-300">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
