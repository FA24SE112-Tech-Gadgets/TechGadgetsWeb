import React, { useState, useEffect } from "react";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import { Search, Plus } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [promptInput, setPromptInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [tempSearch, setTempSearch] = useState("");

  // Fetch prompts
  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/natural-language-prompts`
        : `${process.env.REACT_APP_PRO_API}/api/natural-language-prompts`;

      const url = searchValue
        ? `${baseUrl}?Page=${page}&PageSize=10&Prompt=${searchValue}`
        : `${baseUrl}?Page=${page}&PageSize=10`;

      const response = await AxiosInterceptor.get(url);
      setPrompts(response.data.items);
      setTotalPages(Math.ceil(response.data.totalItems / 10));
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [page, searchValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPrompt) {
        await AxiosInterceptor.patch(`/api/natural-language-prompts/${editingPrompt.id}`, {
          prompt: promptInput
        });
        toast.success("Cập nhật gợi ý thành công!");
      } else {
        await AxiosInterceptor.post("/api/natural-language-prompts", {
          prompt: promptInput
        });
        toast.success("Thêm gợi ý thành công!");
      }
      setIsModalVisible(false);
      setPromptInput("");
      setEditingPrompt(null);
      fetchPrompts();
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
        }
  };

  const handleDelete = async (id) => {
    try {
      await AxiosInterceptor.delete(`/api/natural-language-prompts/${id}`);
      toast.success("Xóa gợi ý thành công!");
      setIsDeleteModalVisible(false);
      setPromptToDelete(null);
      fetchPrompts();
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
        
    }
  };

  const showDeleteConfirm = (prompt) => {
    setPromptToDelete(prompt);
    setIsDeleteModalVisible(true);
  };

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setPromptInput(prompt.prompt);
    setIsModalVisible(true);
  };

  const handleSearchChange = (event) => {
    setTempSearch(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchValue(tempSearch);
      setPage(1);
    }
  };

  return (
    <div className="container mx-auto">
      <ToastContainer />
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý từ khóa gợi ý</h1>
        </div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={tempSearch}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
          />
        </div>
        <button
          onClick={() => {
            setIsModalVisible(true);
            setEditingPrompt(null);
            setPromptInput("");
          }}
          className="flex items-center bg-primary/70 text-black font-medium px-4 py-2 rounded-md hover:bg-primary"
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo từ khóa gợi ý
        </button>
      </div>

      <div className="rounded-md border max-w-screen-lg mx-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-primary/40">
              <th className="p-4 pl-5 text-left font-medium">STT</th>
              <th className="p-4 text-left font-medium">Nội dung </th>
              <th className="p-4 text-center font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt, index) => (
              <tr key={prompt.id} className="border-b">
                <td className="p-4 pl-5">{(page - 1) * 10 + (index + 1)}</td>
                <td className="p-4">{prompt.prompt}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleEdit(prompt)}
                    className="bg-primary/60 text-white px-3 py-1 rounded-md hover:bg-primary/80 mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => showDeleteConfirm(prompt)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {prompts.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  Không tìm thấy bất kỳ gợi ý nào!!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4">
              {editingPrompt ? "Chỉnh sửa gợi ý" : "Thêm gợi ý mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Nhập nội dung gợi ý"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalVisible(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary/60 text-white rounded-md hover:bg-primary/80"
                >
                  {editingPrompt ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">Bạn có chắc chắn muốn xóa gợi ý này?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDeleteModalVisible(false);
                  setPromptToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(promptToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <nav className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-4 py-2 rounded-md ${
                pageNumber === page ? 'bg-primary/70 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default PromptManagement;
