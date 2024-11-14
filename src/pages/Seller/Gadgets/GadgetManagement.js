import React, { useEffect, useState } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast, ToastContainer } from "react-toastify";
import { Eye, X, Percent, Plus, Edit  } from 'lucide-react';
import { Switch } from 'antd';
import slugify from '~/ultis/config';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
        day: '2-digit',    // Changed order to put day first
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false      // Use 24-hour format
    });
};

const GadgetManagement = ({ categoryId }) => {
    const [gadgets, setGadgets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGadget, setSelectedGadget] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const formRef = React.useRef(null);

    const resetForm = () => {
        if (formRef.current) {
            formRef.current.reset();
            setFormattedDate('');
        }
    };

    const fetchGadgets = async () => {
        try {
            setIsLoading(true);
            const response = await AxiosInterceptor.get(`/api/gadgets/category/${categoryId}/current-seller?Page=1&PageSize=100`);
            setGadgets(response.data.items);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGadgets();
    }, [categoryId]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGadgets = gadgets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(gadgets.length / itemsPerPage);

    const handleSaleToggle = async (id, isForSale) => {
        try {
            setIsLoading(true);
            if (isForSale) {
                await AxiosInterceptor.put(`/api/gadgets/${id}/set-not-for-sale`);
            } else {
                await AxiosInterceptor.put(`/api/gadgets/${id}/set-for-sale`);
            }
            await fetchGadgets();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.reasons) {
                const reasons = error.response.data.reasons;
                if (reasons.length > 0) {
                    const reasonMessage = reasons[0].message;
                    toast.error(reasonMessage);
                } else {
                    toast.error("Thay đổi trạng thái thất bại, vui lòng thử lại");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const showDiscountModal = (gadget) => {
        setSelectedGadget(gadget);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedGadget(null);
        resetForm();
    };

    const validateDiscount = (discountPercentage, discountExpiredDate) => {
        const now = moment();
        const expirationDate = moment(discountExpiredDate);

        if (!discountPercentage || discountPercentage < 1 || discountPercentage > 90) {
            toast.error("giảm giá phải từ 1 đến 90%");
            return false;
        }

        if (!expirationDate.isValid()) {
            toast.error("Vui lòng chọn ngày hết hạn");
            return false;
        }

        if (expirationDate.isBefore(now)) {
            toast.error("Vui lòng chọn thời gian hết hạn");
            return false;
        }

        return true;
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        if (date) {
            e.target.dataset.rawValue = date;
            const formatted = moment(date).format('DD/MM/YYYY');
            setFormattedDate(formatted);
        } else {
            setFormattedDate('');
        }
    };

    const handleDiscountSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const discountPercentage = parseInt(event.target.discountPercentage.value, 10);
            const discountDate = event.target.discountExpiredDate.dataset.rawValue;
            const discountTime = event.target.discountExpiredTime.value || '23:59';

            const discountExpiredDate = moment(`${discountDate} ${discountTime}`).toISOString();

            if (!validateDiscount(discountPercentage, discountExpiredDate)) {
                return;
            }

            const formData = new FormData();
            formData.append("DiscountPercentage", discountPercentage);
            formData.append("DiscountExpiredDate", discountExpiredDate);

            console.log('Sending discount data as FormData:', {
                DiscountPercentage: discountPercentage,
                DiscountExpiredDate: discountExpiredDate
            });

            await AxiosInterceptor.post(`/api/gadget-discount/${selectedGadget.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            await fetchGadgets();
            resetForm();
            setIsModalVisible(false);
            setSelectedGadget(null);
        } catch (error) {
            console.error("Error adding discount:", error);
            if (error.response?.data?.reasons?.[0]?.message) {
                toast.error(error.response.data.reasons[0].message);
            } else {
                toast.error("Failed to add discount. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            handleCancel();
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
                <div className="h-4 w-4 bg-white rounded-full"></div>
            </div>
            <span className="ml-2 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Loading...
            </span>
        </div>
    );

    const handleUpdateGadget = (gadgetId) => {
        navigate(`/seller/gadgets/update/${gadgetId}`);
    };

    return (
        <div className="p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <table className="min-w-full bg-white rounded-md shadow-lg">
                <thead>
                    <tr>
                        <th className="p-4 text-left font-medium">Hình ảnh </th>
                        <th className="p-4 text-left font-medium">Tên sản phẩm</th>
                        <th className="p-4 text-left font-medium">Giá</th>
                        <th className="p-4 text-left font-medium">Giảm giá</th>
                        <th className="p-4 text-left font-medium">Số lượng</th>
                        <th className="p-4 text-left font-medium">Trạng thái</th>
                        <th className="p-4 text-left font-medium">Đang bán</th>
                        <th className="p-4 text-left font-medium"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentGadgets.map((gadget) => (
                        <tr key={gadget.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                                <div className="relative">
                                    <img
                                        src={gadget.thumbnailUrl}
                                        alt={gadget.name}
                                        className="w-32 h-32 object-contain rounded"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-image.png';
                                        }}
                                    />
                                    <button
                                        onClick={() => handleUpdateGadget(gadget.id)}
                                        className="absolute top-0 left-0 bg-white p-1 rounded-full shadow-md border-x-2"
                                        title="Cập nhật sản phẩm"
                                    >
                                        <Edit className="h-4 w-4 text-primary/100" />
                                    </button>
                                </div>
                            </td>
                            <td className="p-4">{gadget.name}</td>
                            <td className="p-4">{`${gadget.price.toLocaleString()}₫`}</td>
                            <td className="p-4">
                                {gadget.discountPercentage > 0 ? (
                                    <>
                                        {/* <span className="text-red-500">{`${gadget.discountPrice.toLocaleString()} đ`}</span> */}
                                        <span className="block text-sm text-gray-600">{`-${gadget.discountPercentage}%`}</span>
                                        {gadget.discountExpiredDate && (
                                            <span className="block text-xs text-gray-500">
                                                {`HSD: ${formatDate(gadget.discountExpiredDate)}`}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => showDiscountModal(gadget)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full text-primary/80 hover:text-primary"
                                        disabled={isLoading}
                                    >
                                        <Plus className="h-5 w-5 items-center" />
                                    </button>

                                )}
                            </td>
                            <td className="p-4">{gadget.quantity}</td>
                            <td className="p-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full  ${gadget.gadgetStatus === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {gadget.gadgetStatus}
                                </span>

                            </td>
                            <td className="p-4">
                                <Switch
                                    checked={gadget.isForSale}
                                    onChange={() => handleSaleToggle(gadget.id, gadget.isForSale)}
                                    disabled={isLoading}
                                    style={{
                                        backgroundColor: gadget.isForSale ? 'rgba(59, 130, 246, 0.8)' : 'gray', // Set `primary/80` color when checked
                                    }}
                                />

                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => navigate(`/gadget/detail-seller/${slugify(gadget.name)}`, {
                                        state: {
                                            gadgetId: gadget.id,
                                        }
                                    })}
                                    className="flex items-center space-x-1 text-primary/80 hover:text-primary"
                                    disabled={isLoading}
                                >
                                    <Eye className="h-5 w-5 items-center" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {gadgets.length === 0 && !isLoading && (
                <div className="text-center p-4 text-gray-500">Không có sản phẩm</div>
            )}
            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handleChangePage(i + 1)}
                        className={`px-4 py-2 rounded-md ${i + 1 === currentPage
                            ? 'bg-primary/80 text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                        disabled={isLoading}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Discount Modal */}
            {isModalVisible && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
                    onClick={handleOutsideClick}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
                        <div
                            className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Thêm giảm giá</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleDiscountSubmit} className="space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="discountPercentage" className="text-gray-700">
                                    Nhập phần trăm giảm giá
                                </label>
                                <input
                                    type="number"
                                    id="discountPercentage"
                                    name="discountPercentage"
                                    min="1"
                                    max="90"
                                    step="1" // Thêm step để chỉ nhận số nguyên
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded focus:ring-primary/80 focus:border-primary/80"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="discountExpiredDate" className="text-gray-700">
                                    Nhập ngày hết hạn
                                </label>
                                <input
                                    type="date"
                                    id="discountExpiredDate"
                                    name="discountExpiredDate"
                                    min={moment().format('YYYY-MM-DD')}
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded focus:ring-primary/80 focus:border-primary/80"
                                    disabled={isLoading}
                                    onChange={handleDateChange}
                                    style={{ display: 'none' }}
                                />
                                <input
                                    type="text"
                                    value={formattedDate}
                                    onClick={(e) => {
                                        e.target.previousSibling.showPicker();
                                    }}
                                    readOnly
                                    placeholder="DD/MM/YYYY"
                                    className="mt-1 p-2 border border-gray-300 rounded focus:ring-primary/80 focus:border-primary/80"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="discountExpiredTime" className="text-gray-700">
                                    Thời gian quá hạn
                                </label>
                                <input
                                    type="time"
                                    id="discountExpiredTime"
                                    name="discountExpiredTime"
                                    defaultValue="23:59"
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded focus:ring-primary/80 focus:border-primary/80"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    disabled={isLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary/80 text-white rounded hover:bg-primary"
                                    disabled={isLoading}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GadgetManagement;