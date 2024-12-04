import React, { useState, useEffect } from 'react';
import LottieAnimation from '~/components/Lottie/LottieAnimation';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';


const AiFeature = () => {
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState(null);
    const backgroundImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await AxiosInterceptor.get("/api/users/current");
                setUserStatus(response.data.status);
            } catch (error) {
                console.error("Error fetching user status:", error);
            }
        };
        fetchUserStatus();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="max-w-6xl w-full bg-white bg-opacity-30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 p-8 flex items-center justify-center bg-white bg-opacity-50">
                        <div className="w-full h-64 md:h-full">
                            <LottieAnimation />
                        </div>
                    </div>
                    <div className="md:w-3/5 p-8 relative">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                                Khám phá tính năng tìm kiếm sản phẩm bằng ngôn ngữ tự nhiện
                            </h1>
                            <p className="text-lg text-white mb-8 leading-relaxed drop-shadow-md">
                                Tính năng tìm kiếm sản phẩm bằng ngôn ngữ tự nhiên giúp bạn dễ dàng tìm thấy sản phẩm và cửa hàng một cách nhanh chóng và chính xác. Hệ thống có
                                khả năng hiểu ý định tìm kiếm, phân tích từ khóa và gợi ý những sản phẩm, cửa hàng phù hợp nhất với nhu cầu của bạn.
                            </p>
                            {userStatus === 'Inactive' && (
                                <div className="mb-4 p-4 bg-red-500 bg-opacity-70 rounded-lg">
                                    <p className="text-white font-semibold flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Tài khoản của bạn hiện đang bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    localStorage.removeItem('searchState');
                                    navigate("/search-by-natural-language");
                                }}
                                disabled={userStatus === 'Inactive'}
                                className={`group inline-flex items-center px-6 py-3 text-lg font-semibold text-white rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    userStatus === 'Inactive' 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                                }`}
                                title={userStatus === 'Inactive' ? 'Tài khoản của bạn hiện đang bị vô hiệu hóa' : ''}
                            >
                                Hãy thử ngay
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiFeature;