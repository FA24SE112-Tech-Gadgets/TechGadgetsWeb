import React, { useEffect, useState } from "react";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import { Eye, X, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let url = `/api/users?Page=${page}&PageSize=${pageSize}`;
    
    if (roleFilter !== 'all') {
      url += `&Role=${roleFilter}`;
    }
    if (statusFilter !== 'all') {
      url += `&Status=${statusFilter}`;
    }

    setIsLoading(true);
    AxiosInterceptor.get(url)
      .then((response) => {
        setUsers(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [roleFilter, statusFilter, page, pageSize]);

  // Add new useEffect to reset currentPage when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getRoleInVietnamese = (role) => {
    switch (role) {
      case "Customer":
        return "Khách hàng";
      case "Seller":
        return "Người bán";
      case "Manager":
        return "Quản lý";
      default:
        return role;
    }
  };

  const renderUserInfo = (user) => {
    const renderField = (label, value) => {
      if (!value) return null; // Don't render if value is null/undefined/empty
      return (
        <div className="mb-4">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-base font-medium">{value}</p>
        </div>
      );
    };

    switch (user.role) {
      case "Manager":
        return (
          <div className="space-y-4">
            {user.manager?.fullName && renderField("Tên quản lý", user.manager.fullName)}
            {renderField("Email", user.email)}
          </div>
        );
      case "Seller":
        return (
          <div className="space-y-4">
      
            {user.seller?.companyName && renderField("Tên công ty", user.seller.companyName)}
            {user.seller?.shopName && renderField("Tên cửa hàng", user.seller.shopName)}
            {user.seller?.shopAddress && renderField("Địa chỉ cửa hàng", user.seller.shopAddress)}
            {user.seller?.businessModel && renderField("Mô hình kinh doanh", user.seller.businessModel)}
            {renderField("Email", user.email)}
            {user.seller?.businessRegistrationCertificateUrl && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Giấy phép kinh doanh:</p>
                <div className="flex justify-center">
                  <img
                    src={user.seller.businessRegistrationCertificateUrl}
                    alt="Business Registration Certificate"
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "Customer":
        return (
          <div className="space-y-4">
            {user.customer?.avatarUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={user.customer.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}
            {user.customer?.fullName && renderField("Họ và tên", user.customer.fullName)}
            {renderField("Email", user.email)}
            {user.customer?.phoneNumber && renderField("Số điện thoại", user.customer.phoneNumber)}
            {user.customer?.address && renderField("Địa chỉ", user.customer.address)}
            {user.customer?.cccd && renderField("CCCD", user.customer.cccd)}
            {user.customer?.gender && renderField("Giới tính", user.customer.gender)}
            {user.customer?.dateOfBirth && renderField("Ngày sinh", new Date(user.customer.dateOfBirth).toLocaleDateString())}
          </div>
        );
      default:
        return null;
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    try {
      const endpoint = currentStatus === "Active" 
        ? `/api/user/${userId}/deactivate`  // for deactivating user
        : `/api/user/${userId}/activate`;   // for activating user
      
      await AxiosInterceptor.put(endpoint);
      
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: currentStatus === "Active" ? "Inactive" : "Active"
          };
        }
        return user;
      }));
      
      toast.success("Cập nhật trạng thái thành công");
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
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const getPaginationRange = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold mb-4">Quản lý người dùng</h1>
      
      <div className="mb-6 flex gap-4 justify-end">
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
            }}
            className="w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">Tất cả </option>
            <option value="Customer">Khách hàng</option>
            <option value="Seller">Người bán</option>
            <option value="Manager">Quản lý</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">Tất cả </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getRoleInVietnamese(user.role)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {loadingStates[user.id] ? (
                      <Loader className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.status === "Active"}
                          onChange={() => handleStatusToggle(user.id, user.status)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    )}
                    {/* <span className={`px-2 py-1 rounded-full text-white text-sm ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !isLoading && (
        <div className="text-center p-4 text-gray-500">Không có người dùng</div>
      )}

      <div className="flex justify-center mt-6 space-x-2">
        {getPaginationRange().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`px-4 py-2 rounded-md ${
              pageNumber === currentPage
                ? 'bg-primary/80 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            disabled={isLoading}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
             onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Chi tiết người dùng</h2>
                <p className="text-sm text-gray-500 mt-1">Vai trò: {getRoleInVietnamese(selectedUser.role)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {renderUserInfo(selectedUser)}
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
             onClick={() => setIsImageModalOpen(false)}>
          <div className="relative max-w-4xl max-h-[90vh] p-2">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;