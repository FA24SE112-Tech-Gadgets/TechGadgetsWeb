import React, { useEffect, useState } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { toast } from "react-toastify";
import { Search, Loader } from 'lucide-react';

const ManageBrandByCategory = ({ categoryId }) => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      let url = `/api/brands/categories/${categoryId}?Page=${currentPage}&PageSize=${itemsPerPage}`;
      if (debouncedSearch) {
        url += `&Name=${encodeURIComponent(debouncedSearch)}`;
      }
      const response = await AxiosInterceptor.get(url);
      setBrands(response.data.items || []);
      setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch brands when dependencies change
  useEffect(() => {
    setCurrentPage(1);
    fetchBrands();
  }, [categoryId, debouncedSearch]);

  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
        <div className="h-4 w-4 bg-white rounded-full"></div>
      </div>
      <span className="ml-2 text-xl font-bold text-primary">Loading...</span>
    </div>
  );

  return (
    <div className="">
      <div className="flex justify-between mb-4">
        <div className="relative w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm thương hiệu..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary/80"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      <table className="min-w-full bg-white rounded-md shadow-lg">
        <thead>
          <tr>
            <th className="p-4 text-left font-medium">Logo</th>
            <th className="p-4 text-left font-medium">Tên thương hiệu</th>
            
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-16 h-16 object-contain rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </td>
              <td className="p-4">{brand.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {brands.length === 0 && !isLoading && (
        <div className="text-center p-4 text-gray-500">Không có thương hiệu</div>
      )}

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
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
};

export default ManageBrandByCategory;
