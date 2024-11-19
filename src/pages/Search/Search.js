import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoMdSearch } from 'react-icons/io';
import slugify from '~/ultis/config';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      try {
        const response = await axios.get(`${process.env.REACT_APP_DEV_API || process.env.REACT_APP_PRO_API}/api/gadgets?Name=${searchQuery}&Page=1&PageSize=100`);
        setSearchResults(response.data.items);
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative group hidden sm:block">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch} // triggers on pressing Enter
        placeholder="Tìm kiếm"
        className="w-[400px] sm:w-[400px] group-hover:w-[400px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
      />
      <IoMdSearch
        className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
        onClick={handleSearch} // triggers on clicking search icon
      />

      {showModal && (
        <div ref={modalRef} className="absolute top-full mt-2 w-full h-[500px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => navigate(`/gadget/detail/${slugify(result.name)}`, {
                  state: {
                    productId: result.id,
                  }
                })}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <img src={result.thumbnailUrl} alt={result.name} className="w-12 h-12 object-contain rounded mr-4" />
                <div className="flex-1">
                  <h3 className="text-xs font-semibold">{result.name}</h3>
                  <div className="text-gray-500">
                    {result.discountPercentage > 0 ? (
                      <>
                        <span className="text-red-500 text-xs mr-3">{result.discountPrice.toLocaleString()}₫</span>
                        <span className="text-xs line-through ">{result.price.toLocaleString()}₫</span>
                        <span className="bg-red-100 text-xs text-red-600 rounded-full ml-2 px-2 py-1">-{result.discountPercentage}%</span>
                      </>
                    ) : (
                      <span className="text-xs">{result.price.toLocaleString()}₫</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">Không tìm thấy sản phẩm</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;