import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '~/context/auth/useAuth';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';

const SpecificationUnitPage = () => {
  const [units, setUnits] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { token } = useAuth(); 

  useEffect(() => {
    fetchUnits();
  }, [page]);

  const fetchUnits = async () => {
    try {
      const response = await AxiosInterceptor.get(
        process.env.NODE_ENV === "development"
          ? `${process.env.REACT_APP_DEV_API}/api/specification-units`
          : `${process.env.REACT_APP_PRO_API}/api/specification-units`,
        // {
        //   // headers: {
        //   //   Authorization: `Bearer ${token}`
        //   // },
        //   // params: {
        //   //   Page: page + 1,
        //   //   PageSize: 3
        //   // }
        // }
      );
      const totalItems = response.data.totalItems || 0; 
      setUnits(response.data.items || []); 
      setTotalPages(Math.ceil(totalItems / 3)); 
    } catch (error) {
      console.error('Error fetching units:', error);
      setUnits([]); 
      setTotalPages(0);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto pb-4">
        <div className="block">
          <div className="overflow-x-auto w-full border rounded-lg border-gray-300">
            <table className="w-full rounded-xl">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-5 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-900">Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {units.map(unit => (
                  <tr key={unit.id} className="bg-white transition-all duration-500 hover:bg-gray-50">
                    <td className="p-5 text-sm font-medium text-gray-900">{unit.id}</td>
                    <td className="p-5 text-sm font-medium text-gray-900">{unit.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="flex items-center justify-center py-4" aria-label="Table navigation">
            <ul className="flex items-center justify-center text-sm gap-12">
              <li>
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                  className="px-3 h-8 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700"
                  disabled={page === 0}
                >
                  Back
                </button>
              </li>
              {[...Array(totalPages).keys()].map(p => (
                <li key={p}>
                  <button
                    onClick={() => setPage(p)}
                    className={`py-2.5 px-4 rounded-full transition-all duration-500 ${page === p ? 'bg-primary/40 text-black' : 'bg-white text-black hover:bg-secondary hover:text-white'}`}
                  >
                    {p + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                  className="px-3 h-8 text-gray-500 bg-white font-medium text-base leading-7 hover:text-gray-700"
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SpecificationUnitPage;