import React, { useState, useEffect } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { ToastContainer, toast } from 'react-toastify';
import { CloseCircleOutlined } from '@ant-design/icons';
import slugify from '~/ultis/config';
import { useNavigate } from 'react-router-dom';

const GadgetHistoryDetail = () => {
  const [gadgets, setGadgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGadgetHistory = async () => {
      try {
        const response = await AxiosInterceptor.get('/api/gadget-histories');
        const fetchedGadgets = response.data.items.map(item => item.gadget).slice(0, 2); // Show only the first 2 gadgets
        setGadgets(fetchedGadgets);
      } catch (error) {
        toast.error('Failed to fetch gadget history');
      } finally {
        setLoading(false);
      }
    };

    fetchGadgetHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
          <div className="h-4 w-4 bg-white rounded-full"></div>
        </div>
        <span className="ml-2 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Sản phẩm đã xem</h1>
      <ToastContainer />
      <div className="flex gap-4 items-start">
        {gadgets.length > 0 ? (
          gadgets.map((gadget) => (
            <div key={gadget.id}
            onClick={() => navigate(`/gadget/detail/${slugify(gadget.name)}`, {
                state: {
                  productId: gadget.id,
                }
              })}
             className="relative p-4 border rounded-lg shadow-md flex items-center w-40"
            >
              <img src={gadget.thumbnailUrl} alt={gadget.name} className="w-12 h-12 object-contain rounded" />
              <div className="flex flex-col overflow-hidden w-full">
                <h3
                  className="font-semibold text-xs overflow-hidden overflow-ellipsis whitespace-nowrap"
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1, // Only one line visible with ellipsis
                    whiteSpace: 'normal',
                  }}
                >
                  {gadget.name}
                </h3>
                <div className="text-gray-500 text-sm">
                  {gadget.discountPercentage > 0 ? (
                    <>
                      <span className="text-red-500 font-bold">{gadget.discountPrice.toLocaleString()}₫</span>
                      <span className="text-gray-500 text-xs ml-2 line-through">{gadget.price.toLocaleString()}₫</span>
                      <span className="text-gray-500 font-semibold text-xs ml-2">-{gadget.discountPercentage}%</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold">{gadget.price.toLocaleString()}₫</span>
                  )}
                </div>
                {!gadget.isForSale && (
                    <div className="text-red-500 font-bold text-sm">
                      Ngừng kinh doanh
                    </div>
                  )}
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm đã xem gần đây.</p>
        )}
      </div>
    </div>
  );
};

export default GadgetHistoryDetail;
