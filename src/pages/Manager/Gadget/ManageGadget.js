import React, { useEffect, useState } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { Eye, Percent, Plus, X, Box, ShoppingBag, Pause, Loader, Search } from 'lucide-react';
import slugify from '~/ultis/config';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ManageGadget = ({ categoryId }) => {
  const [gadgets, setGadgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1); // Changed to state
  const itemsPerPage = 3; // Add this constant
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  const fetchBrands = async () => {
    try {
      const response = await AxiosInterceptor.get(`/api/brands/categories/${categoryId}?Page=1&PageSize=100`);
      setBrands(response.data.items);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands");
    }
  };

  const fetchGadgets = async () => {
    try {
      setIsLoading(true);
      let url = `/api/gadgets/category/${categoryId}/managers?Page=1&PageSize=200`;
      if (statusFilter !== 'all') {
        url += `&GadgetStatus=${statusFilter}`;
      }
      if (debouncedSearch) {
        url += `&Name=${encodeURIComponent(debouncedSearch)}`;
      }
      if (selectedBrand) {
        url += `&Brands=${selectedBrand}`;
      }
      const response = await AxiosInterceptor.get(url);
      setGadgets(response.data.items);
    } catch (error) {
      console.error("Error fetching gadgets:", error);
      toast.error("Failed to fetch gadgets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (gadgetId, currentStatus) => {
    setLoadingStates(prev => ({ ...prev, [gadgetId]: true }));
    try {
      const endpoint = currentStatus === "Active"
        ? `/api/gadgets/${gadgetId}/deactivate`
        : `/api/gadgets/${gadgetId}/activate`;

      await AxiosInterceptor.put(endpoint);

      setGadgets(prev => prev.map(gadget => {
        if (gadget.id === gadgetId) {
          return {
            ...gadget,
            gadgetStatus: currentStatus === "Active" ? "Inactive" : "Active"
          };
        }
        return gadget;
      }));

      // toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Không thể cập nhật trạng thái");
    } finally {
      setLoadingStates(prev => ({ ...prev, [gadgetId]: false }));
    }
  };

  // Add these calculations for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGadgets = gadgets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(gadgets.length / itemsPerPage);

  // Add handleChangePage function
  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Thêm hàm này trước return statement
  const getPaginationRange = () => {
    const maxVisible = 5; // Số lượng nút hiển thị
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + maxVisible - 1, totalPages);

    // Điều chỉnh start nếu end đã chạm giới hạn
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update useEffect to include debouncedSearch
  useEffect(() => {
    setCurrentPage(1);
    fetchGadgets();
  }, [categoryId, statusFilter, debouncedSearch, selectedBrand]);

  // Add useEffect for fetching brands when categoryId changes
  useEffect(() => {
    fetchBrands();
    setSelectedBrand(''); // Reset selected brand when category changes
  }, [categoryId]);

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

  return (
    <div className="">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between mb-4">
        {/* Add search input */}
        <div className="relative w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary/80"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="flex gap-4">
          {/* Brand filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none focus:border-primary/80"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none focus:border-primary/80"
          >
            <option value="all">Tất cả trạng thái </option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <table className="min-w-full bg-white rounded-md shadow-lg">
        <thead>
          <tr>
            <th className="p-4 text-left font-medium">Hình ảnh</th>
            <th className="p-4 text-left font-medium">Tên sản phẩm</th>
            <th className="p-4 text-left font-medium">Giá</th>
            <th className="p-4 text-left font-medium">Giảm giá</th>
            <th className="p-4 text-left font-medium">Trạng thái</th>
            <th className="p-4 text-left font-medium">Đang bán</th>
            <th className="p-4 text-left font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {currentGadgets.map((gadget) => (
            <tr key={gadget.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <img
                  src={gadget.thumbnailUrl}
                  alt={gadget.name}
                  className="w-32 h-32 object-contain rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </td>
              <td className="p-4">
                {gadget.name.length > 20 ? `${gadget.name.slice(0, 20)}...` : gadget.name}
              </td>
              <td className="p-4">
                {gadget.discountPercentage > 0 ? (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {`${gadget.discountPrice.toLocaleString()}₫`}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {`${gadget.price.toLocaleString()}₫`}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-900 dark:text-white">
                    {`${gadget.price.toLocaleString()}₫`}
                  </span>
                )}
              </td>
              <td className="p-4">
                {gadget.discountPercentage > 0 ? (
                  <>
                    <span className="block text-sm text-gray-600">{`-${gadget.discountPercentage}%`}</span>
                    {gadget.discountExpiredDate && (
                      <span className="block text-xs text-gray-500">
                        {`HSD: ${formatDate(gadget.discountExpiredDate)}`}
                      </span>
                    )}
                  </>
                ) : (
                  "Không có giảm giá"
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {loadingStates[gadget.id] ? (
                    <Loader className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={gadget.gadgetStatus === "Active"}
                        onChange={() => handleStatusToggle(gadget.id, gadget.gadgetStatus)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  )}
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gadget.isForSale ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {gadget.isForSale ? "Đang bán" : "Ngừng bán"}
                </span>
              </td>
              <td className="p-4">
                <button
                  onClick={() => navigate(`/gadget/detail-manager/${slugify(gadget.name)}`, {
                    state: {
                      gadgetId: gadget.id,
                    }
                  })}
                  className="flex items-center space-x-1 text-primary/80 hover:text-primary"
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

      {/* Thay thế phần pagination controls cũ bằng đoạn này */}
      <div className="flex justify-center mt-6 space-x-2">
        {getPaginationRange().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handleChangePage(pageNumber)}
            className={`px-4 py-2 rounded-md ${pageNumber === currentPage
                ? 'bg-primary/80 text-white'
                : 'bg-gray-200 text-gray-700'
              }`}
            disabled={isLoading}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageGadget;