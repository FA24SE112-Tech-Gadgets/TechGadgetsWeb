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
        const response = await axios.get(`${process.env.REACT_APP_DEV_API || process.env.REACT_APP_PRO_API}/api/gadgets?Name=${searchQuery}`);
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
        className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
      />
      <IoMdSearch
        className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
        onClick={handleSearch} // triggers on clicking search icon
      />

      {showModal && (
        <div ref={modalRef} className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.id} 
              onClick={() => navigate(`/gadget/detail/${slugify(result.name)}`, {
                state: {
                    productId: result.id,
                }
            })}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {result.name}
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