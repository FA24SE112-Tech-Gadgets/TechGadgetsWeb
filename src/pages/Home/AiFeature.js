// AiFeature.js
import React from 'react';
import LottieAnimation from '~/components/Lottie/LottieAnimation'; // Adjust the path as needed
import Ai from '~/assets/AiSearch.jpg';
import { useNavigate } from 'react-router-dom';

const AiFeature = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center  bg-gray-100 p-4">
            <div className="flex  justify-center bg-white shadow-lg rounded-lg overflow-hidden">
                <div
                    onClick={() => navigate("/search-by-natural-language")}
                    className="md:w-1/4 p-4 flex items-center justify-center">
                    <LottieAnimation

                    />
                </div>
                <div className="md:w-3/4 relative p-4">
                    <img src={Ai} alt="AI Search" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                    <div className="relative z-10 text-center md:text-left">
                        <h1 className="text-2xl font-bold mb-4">Khám phá tính năng tìm kiếm sản phẩm bằng AI</h1>
                        <p className="mb-4">
                            Tính năng tìm kiếm sản phẩm bằng công nghệ AI cho phép bạn tìm kiếm các sản phẩm một cách nhanh chóng và chính xác.
                            Nhờ vào công nghệ trí tuệ nhân tạo tiên tiến, hệ thống của chúng tôi có thể hiểu được ý định tìm kiếm của bạn,
                            phân tích từ khóa và gợi ý các sản phẩm phù hợp nhất với nhu cầu của bạn.
                        </p>
                    </div>
                    <div className="absolute bottom-4 right-4 z-20">
                        <p 
                        onClick={() => navigate("/search-by-natural-language")}
                        className="text-yellow-500 cursor-pointer">Hãy thử ngay</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiFeature;