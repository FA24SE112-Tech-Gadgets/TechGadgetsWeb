import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import GadgetSearchHistory from './GadgetSearchHistory';
import Logo from "~/assets/logo.png";
import { useNavigate } from 'react-router-dom';
import slugify from '~/ultis/config';
import { CiHeart } from 'react-icons/ci';
import { toast, ToastContainer } from 'react-toastify';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { FaCircle, FaDotCircle } from 'react-icons/fa';

const NaturalLanguageSearch = () => {
    const [searchText, setSearchText] = useState('');
    const [gadgets, setGadgets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGadget, setSelectedGadget] = useState(null);
    const itemsPerPage = 8;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sellers, setSellers] = useState([]);
    const [resultType, setResultType] = useState('gadget');

    const fetchGadgets = async () => {
        setLoading(true);
        try {
            const response = await AxiosInterceptor.post('/api/natural-languages/search', {
                input: searchText,
            });
            setResultType(response.data.type);
            if (response.data.type === 'gadget') {
                setGadgets(response.data.gadgets);
                setSellers([]);
            } else {
                setSellers(response.data.sellers);
                setGadgets([]);
            }
        } catch (error) {
            console.error('Failed to fetch results:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGadgets();
    }, []);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchGadgets();
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prevPage) => prevPage + (direction === 'next' ? 1 : -1));
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handleProductClick = (gadget) => {
        setSelectedGadget(gadget);
    };

    const handleConfirmNavigation = () => {
        if (selectedGadget) {
            navigate(`/gadget/detail/${slugify(selectedGadget.name)}`, {
                state: {
                    productId: selectedGadget.id,
                }
            });
        }
    };

    const handleCloseModal = () => {
        setSelectedGadget(null);
    };
    const totalPages = Math.ceil(gadgets.length / itemsPerPage);
    const displayedGadgets = gadgets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleFavorite = async (gadgetId, isFavorite) => {
        try {
            await AxiosInterceptor.post(`/api/favorite-gadgets/${gadgetId}`);
            setGadgets((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === gadgetId ? { ...product, isFavorite: !isFavorite } : product
                )
            );
        } catch (error) {
            console.error("Error toggling favorite status:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };
    return (
        <div className="flex h-screen relative z-0">
            <GadgetSearchHistory />
            <ToastContainer />
            <div className="flex flex-col flex-grow overflow-hiddden">
                {/* Product List Section */}
                <div className="flex-grow p-4">
                    <div className="flex items-center justify-between mb-4 border-b">
                        <div>
                            <button onClick={() => navigate("/")} className="font-bold text-2xl sm:text-3xl flex gap-2">
                                <img src={Logo} alt="Logo" className="w-10" />
                                Tech Gadget
                            </button>
                        </div>
                        <h2 className="text-center text-lg font-bold mb-4">Danh sách sản phẩm tìm kiếm dựa trên ngôn ngữ tự nhiên</h2>
                    </div>
                    {loading ? (
                        <p className="text-center text-gray-500">Đang tải...</p>
                    ) : resultType === 'gadget' ? (
                        displayedGadgets.length > 0 ? (
                            <div className="container w-full max-w-screen-lg mx-auto grid grid-cols-4 gap-4 h-[400px] overflow-y-hiden">
                                {displayedGadgets.map((gadget) => (
                                    <div
                                        key={gadget.id}
                                        onClick={() => handleProductClick(gadget)}
                                        className="relative border-2 rounded-2xl shadow-sm flex flex-col justify-between transition-transform duration-200 transform hover:scale-105 hover:border-primary/50 h-[250px]">
                                        {gadget.discountPercentage > 0 && (
                                            <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold text-center py-1 px-2 rounded-tr-md rounded-b-md">
                                                Giảm {`${gadget.discountPercentage}%`}
                                            </div>
                                        )}
                                        {!gadget.isForSale && (
                                            <div className="absolute top-1/3 left-0 transform -translate-y-1/2 w-full bg-red-500 text-white text-sm font-bold text-center py-1 rounded">
                                                Ngừng kinh doanh
                                            </div>
                                        )}
                                        <div className="p-2 flex flex-col flex-grow">
                                            <img
                                                src={gadget.thumbnailUrl}
                                                alt={gadget.name}
                                                className="w-full h-32 object-contain mb-2 rounded"
                                            />
                                            <h3 className="font-semibold text-xs line-clamp-2">{gadget.name}</h3>
                                            <div className="flex py-4">
                                                {gadget.discountPercentage > 0 ? (
                                                    <>
                                                        <div className="text-red-500 font-semibold text-sm mr-2">
                                                            {gadget.discountPrice.toLocaleString()}₫
                                                        </div>
                                                        <span className="line-through text-gray-500 text-xs">
                                                            {gadget.price.toLocaleString()}₫
                                                        </span>
                                                    </>
                                                ) : (
                                                    <div className="text-gray-800 font-semibold text-sm">
                                                        {gadget.price.toLocaleString()}₫
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-1 flex items-center">
                                            <div className='w-full text-sm flex items-center justify-end px-2 py-1 text-gray-500'>
                                                <span className="mr-2">Yêu thích</span>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(gadget.id, gadget.isFavorite);
                                                    }}
                                                    className="cursor-pointer flex items-center"
                                                >
                                                    {gadget.isFavorite ? (
                                                        <svg
                                                            className="h-8 w-5 text-red-500"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                        </svg>
                                                    ) : (
                                                        <CiHeart className="h-8 w-5 text-gray-500" />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">Không tìm thấy từ khóa, hãy thử tìm với từ khóa khác</p>
                        )
                    ) : (
                        sellers.length > 0 ? (
                            <div className="container w-full max-w-screen-lg h-[550px] mx-auto overflow-y-auto">
                                <div className="grid grid-cols-1 gap-4 p-4">
                                    {sellers.map((seller) => (
                                        <div key={seller.id}
                                            className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold text-lg text-primary/80">
                                                    {seller.shopName || "Chưa đặt tên shop"}
                                                </h3>
                                                <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">
                                                    {seller.businessModel === 'Personal'
                                                        ? 'Cá nhân'
                                                        : seller.businessModel === 'BusinessHouseHold'
                                                            ? 'Doanh nghiệp'
                                                            : 'Công ty'}

                                                </span>
                                            </div>
                                            <div className="space-y-2 text-gray-600">
                                                <p className="flex items-center gap-2">
                                                    <span className="font-semibold min-w-[100px]">Địa chỉ:</span>
                                                    <span className="text-gray-700">{seller.shopAddress}</span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="font-semibold min-w-[100px]">Mã số thuế:</span>
                                                    <span className="text-gray-700">{seller.taxCode}</span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="font-semibold min-w-[100px]">Số điện thoại:</span>
                                                    <span className="text-gray-700">{seller.phoneNumber}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">Không tìm thấy người bán nào phù hợp</p>
                        )
                    )}
                </div>

                {/* Pagination - only show for gadgets */}
                {resultType === 'gadget' && displayedGadgets.length > 0 && (
                    <div className="flex items-center justify-between p-1 bg-white border-t">
                        <button
                            onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2  bg-gray-200 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" /> Trước
                        </button>

                        {/* <span className="text-gray-600">
                            Trang {currentPage} / {totalPages}
                        </span> */}

                        <button
                            onClick={() => handlePageChange('next')}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Kế tiếp <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Search Bar */}
                <div className="sticky top-0 bg-white p-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Nhập thông tin cần tìm"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/80 "
                        />
                        <button onClick={handleSearch} className="ml-2 p-2 bg-primary-500 text-gray rounded-md hover:bg-primary-600">
                            {loading ? <LoadingOutlined className="w-5 h-5 text-primary/80" /> : <SendOutlined className="w-5 h-5 text-primary/80" />}
                        </button>
                    </div>
                </div>
            </div>
            {selectedGadget && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" style={{ zIndex: 1000 }} onClick={handleCloseModal}>
                    <div className="bg-white p-6 rounded-md shadow-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Xác nhận</h2>
                        <p>Bạn có muốn đến trang chi tiết sản phẩm không?</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmNavigation}
                                className="px-4 py-2 bg-primary/80 text-white rounded hover:bg-primary-600"
                            >
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NaturalLanguageSearch;