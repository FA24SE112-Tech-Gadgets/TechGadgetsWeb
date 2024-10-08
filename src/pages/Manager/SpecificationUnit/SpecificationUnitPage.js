import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { Search, Plus, X } from 'lucide-react'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Trash2, MoreVertical } from 'lucide-react'; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SpecificationUnitPage = () => {
  const [units, setUnits] = useState([]);
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const [searchValue, setSearchValue] = useState(""); 
  const [open, setOpen] = useState(false); 
  const [newUnitName, setNewUnitName] = useState(""); 
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchUnits(); 
  }, [page, searchValue]);

  const fetchUnits = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/specification-units`
        : `${process.env.REACT_APP_PRO_API}/api/specification-units`;

      const url = `${baseUrl}?Page=${page}&PageSize=10&Name=${searchValue}`;
      const response = await AxiosInterceptor.get(url);
      const totalItems = response.data.totalItems || 0;

      setUnits(response.data.items || []);
      setTotalPages(Math.ceil(totalItems / 10));
    } catch (error) {
      console.error('Error fetching units:', error);
      setUnits([]); 
      setTotalPages(0); 
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setPage(1);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage); 
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

 
  const handleClose = () => {
    setOpen(false);
    setNewUnitName(""); 
  };

  const handleCreateUnit = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/specification-units`
        : `${process.env.REACT_APP_PRO_API}/api/specification-units`;

      const response = await AxiosInterceptor.post(baseUrl, { name: newUnitName });

      if (response.status >= 200 && response.status < 300) { 
        fetchUnits();
        handleClose(); 
        toast.success("Thêm Thành Công");
      } else if (response.status >= 400 && response.status <= 500) { 
        toast.error("Thêm Thất Bại");
      }
    } catch (error) {
      console.error('Error creating unit:', error);
      toast.error("Thêm Thất Bại");
    }
  };

  const handleDeleteUnit = async (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa đơn vị này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              const baseUrl = process.env.NODE_ENV === "development"
                ? `${process.env.REACT_APP_DEV_API}/api/specification-units`
                : `${process.env.REACT_APP_PRO_API}/api/specification-units`;

              await AxiosInterceptor.delete(`${baseUrl}/${id}`);
              fetchUnits();
              toast.error("Xóa Thành Công");
            } catch (error) {
              console.error('Error deleting unit:', error);
            }
          }
        },
        {
          label: 'Không',
          onClick: () => {}
        }
      ]
    });
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
          />
        </div>
        <button
          onClick={handleClickOpen}
          className="flex items-center bg-primary/70 text-black font-medium px-4 py-2 rounded-md hover:bg-primary"
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo đơn vị
        </button>
      </div>
      <div className="rounded-md border max-w-screen-lg mx-auto">
        <table className="w-full ">
          <thead>
            <tr className="border-b bg-primary/40">
              <th className="p-4 pl-5 text-left font-medium">ID</th>
              <th className="p-4 text-center font-medium">Tên đơn vị</th>
              <th className="p-4 text-center font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {units.map(unit => (
              <tr key={unit.id} className="border-b">
                <td className="p-4 pl-5">{unit.id}</td>
                <td className="p-4 text-center">{unit.name}</td>
                <td className="p-4 text-center relative">
                  <button onClick={() => toggleRow(unit.id)} className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="inline h-5 w-5" />
                  </button>
                  {expandedRow === unit.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-right"
                      >
                        <Trash2 className="inline h-5 w-5 mr-2" />
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  Không tìm thấy đơn vị!!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <nav className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handleChangePage(pageNumber)}
              className={`px-4 py-2 rounded-md ${pageNumber === page ? 'bg-primary/70 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {pageNumber}
            </button>
          ))}
        </nav>
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Tạo đơn vị 
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Nhập tên đơn vị vào ô trống!
                    </p>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tên đơn vị
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={newUnitName}
                      onChange={(e) => setNewUnitName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary/40 focus:border-primary/40 sm:text-sm"
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={handleClose}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary/60 px-4 py-2 text-sm font-medium text-white hover:bg-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2"
                      onClick={handleCreateUnit}
                    >
                      Tạo
                    </button>
                  </div>
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Đóng</span>
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer /> 
    </div>
  );
};

export default SpecificationUnitPage;
