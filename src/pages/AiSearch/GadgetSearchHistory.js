import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import slugify from '~/ultis/config';

const GadgetSearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await AxiosInterceptor.get('/api/gadget-histories');
        setHistory(response.data.items);
      } catch (error) {
        console.error('Failed to fetch gadget search history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleProductClick = (item) => {
    navigate(`/gadget/detail/${slugify(item.name)}`, {
      state: {
        productId: item.id,
      }
    });
  };

  return (
    <div className="w-1/4 p-2 border-r bg-gray-100 overflow-y-auto"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
      <h2 className="text-lg font-bold mb-4">Lịch sử tìm kiếm</h2>
      {loading ? (
         <div className="flex items-center justify-center min-h-screen">
         <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
           <div className="h-4 w-4 bg-white rounded-full"></div>
         </div>
         <span className="ml-2 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
           Loading...
         </span>
       </div>
      ) : history.length > 0 ? (
        <ul>
          {history.map((item) => (
            <li key={item.id} onClick={() => handleProductClick(item.gadget)} className="relative border-2 rounded-2xl shadow-sm flex flex-col justify-between transition-transform duration-200 transform hover:scale-105 hover:border-primary/50">
              <div className="flex items-center p-2">
                {item.gadget.discountPercentage > 0 && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white font-bold text-center py-1 px-2 rounded-tr-md rounded-b-md" style={{ fontSize: '0.625rem' }}>
                    Giảm {`${item.gadget.discountPercentage}%`}
                  </div>
                )}
                <div className="flex p-2">
                  <img src={item.gadget.thumbnailUrl} alt={item.gadget.name} className="w-16 h-10 object-contain mr-4 rounded" />
                  <div className="flex flex-col justify-between">
                    <h3 className="font-semibold text-xs overflow-hidden overflow-ellipsis whitespace-nowrap" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, whiteSpace: 'normal' }}>
                      {item.gadget.name}
                    </h3>
                    <div className="flex items-center">
                      {item.gadget.discountPercentage > 0 ? (
                        <>
                          <div className="text-red-500 font-semibold text-sm mr-2">
                            {item.gadget.discountPrice.toLocaleString()}₫
                          </div>
                          <span className="line-through text-gray-500 text-xs">
                            {item.gadget.price.toLocaleString()}₫
                          </span>
                        </>
                      ) : (
                        <div className="text-gray-800 font-semibold text-sm">
                          {item.gadget.price.toLocaleString()}₫
                        </div>
                      )}
                    </div>
                    {item.gadget.status === "Inactive" ? (
                    <div className="text-red-500 font-semibold text-sm">
                        Sản phẩm đã bị khóa do vi phạm chính sách TechGadget
                      </div>
                    ) : !item.gadget.isForSale && (
                      <div className="text-red-500 font-semibold text-sm">
                       Ngừng bán
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Không có lịch sử tìm kiếm</p>
      )}
    </div>
  );
};

export default GadgetSearchHistory;