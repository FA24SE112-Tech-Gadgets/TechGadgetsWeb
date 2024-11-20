import React, { useState, useEffect } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { toast, ToastContainer } from "react-toastify";
import { Search, Plus, Edit, Trash } from 'lucide-react';

export default function SpecificationUnitManage({ categoryId }) {
  const [specificationKeys, setSpecificationKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSpecificationKeys = async () => {
    try {
      setIsLoading(true);
      let url = `https://tech-gadgets-dev.xyz/api/specification-keys/categories/${categoryId}?Page=1&PageSize=100`;
      if (debouncedSearch) {
        url += `&Name=${encodeURIComponent(debouncedSearch)}`;
      }
      const response = await AxiosInterceptor.get(url);
      setSpecificationKeys(response.data.items);
    } catch (error) {
      console.error("Error fetching specification keys:", error);
      toast.error("Failed to fetch specification keys");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    fetchSpecificationKeys();
  }, [categoryId]);

  useEffect(() => {
    fetchSpecificationKeys();
  }, [debouncedSearch]);

  const handleAddSpecificationKey = () => {
    toast.info("Add functionality not implemented yet");
  };

  const handleEditSpecificationKey = (id) => {
    toast.info(`Edit functionality not implemented yet for ID: ${id}`);
  };

  const handleDeleteSpecificationKey = (id) => {
    toast.info(`Delete functionality not implemented yet for ID: ${id}`);
  };

  const filteredKeys = specificationKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredKeys.length / itemsPerPage);
  const paginatedKeys = filteredKeys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSpecificationUnits = (units) => {
    if (units.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1">
        {units.map((unit) => (
          <span key={unit.id} className="px-2 py-1 bg-gray-200 text-xs rounded-full text-gray-600">
            {unit.name}
          </span>
        ))}
      </div>
    );
  };

  const getPaginationRange = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + maxVisible - 1, pageCount);

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
    <div className="container mx-auto px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between mb-4">
        <div className="relative w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm thông số..."
             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary/80"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {/* <button
          onClick={handleAddSpecificationKey}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="inline-block mr-2" />
          Thêm thông số
        </button> */}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên thông số
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn vị
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedKeys.map((specKey) => (
              <tr key={specKey.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {specKey.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderSpecificationUnits(specKey.specificationUnits)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditSpecificationKey(specKey.id)}
                    className="text-primary/75 hover:text-secondary/85 mr-4 focus:outline-none focus:underline"
                  >
                    <Edit className="h-5 w-5 inline-block" />
                    <span className="sr-only">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSpecificationKey(specKey.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                  >
                    <Trash className="h-5 w-5 inline-block" />
                    <span className="sr-only">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredKeys.length === 0 && (
        <div className="text-center p-4 text-gray-500">Không có thông số kỹ thuật</div>
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
    </div>
  );
}