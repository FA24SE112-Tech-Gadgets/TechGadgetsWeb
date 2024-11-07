import React, { useState, useEffect } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';

const GadgetSearchHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await AxiosInterceptor.get('/api/gadget-histories');
        setHistory(response.data.items);
      } catch (error) {
        console.error('Failed to fetch gadget search history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      className="w-1/4 p-2 border-r bg-gray-100 overflow-y-auto"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        scrollbarWidth: 'none', // Firefox (ẩn thanh cuộn)
        msOverflowStyle: 'none', // IE/Edge (ẩn thanh cuộn)
      }}
    >
      <h2 className="text-lg font-bold mb-4">Lịch sử tìm kiếm</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((item) => (
            <li key={item.id} className="relative border-2 rounded-2xl shadow-sm flex flex-col justify-between transition-transform duration-200 transform hover:scale-105 hover:border-primary/50">
              <div className="flex items-center p-2">
                {item.gadget.discountPercentage > 0 && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white font-bold text-center py-1 px-2 rounded-tr-md rounded-b-md"
                    style={{ fontSize: '0.625rem' }}
                  >
                    Giảm {`${item.gadget.discountPercentage}%`}
                  </div>
                )}
                <div className="flex p-2">
                  <img
                    src={item.gadget.thumbnailUrl}
                    alt={item.gadget.name}
                    className="w-16 h-10 object-contain mr-4 rounded"
                  />
                  <div className="flex flex-col justify-between">
                    <h3
                      className="font-semibold text-xs overflow-hidden overflow-ellipsis whitespace-nowrap"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1, // Only one line visible with ellipsis
                        whiteSpace: 'normal',
                      }}
                    >
                      {item.gadget.name}
                    </h3>
                    <div className="flex items-center">
                      {item.gadget.discountPercentage > 0 ? (
                        <>
                          <div className="flex flex-col">
                            <div className="text-red-500 font-semibold text-sm">
                              {item.gadget.discountPrice.toLocaleString()}₫
                            </div>
                            <span className="line-through text-gray-500 text-xs">
                              {item.gadget.price.toLocaleString()}₫
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-800 font-semibold text-sm">
                          {item.gadget.price.toLocaleString()}₫
                        </div>
                      )}
                    </div>
                    {!item.gadget.isForSale && (
                      <div className="text-red-500 font-semibold text-sm">
                        Ngừng kinh doanh
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