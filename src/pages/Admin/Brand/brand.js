import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { Search, Plus, X } from 'lucide-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Trash2, MoreVertical } from 'lucide-react'; 

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, [page, searchValue]);

  const fetchBrands = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/brands`
        : `${process.env.REACT_APP_PRO_API}/api/brands`;

      // Conditionally build the URL based on whether searchValue is provided
      const url = searchValue
        ? `${baseUrl}?Page=${page}&PageSize=10&Name=${searchValue}`
        : `${baseUrl}?Page=${page}&PageSize=10`;

      const response = await AxiosInterceptor.get(url);
      const totalItems = response.data.totalItems || 0;

      setBrands(response.data.items || []);
      setTotalPages(Math.ceil(totalItems / 10));
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
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
    setNewBrandName("");
    setNewLogoUrl("");
  };

  const handleCreateBrand = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/brands`
        : `${process.env.REACT_APP_PRO_API}/api/brands`;

      const formData = new FormData();
      formData.append('Name', newBrandName);
      formData.append('Logo', newLogoFile); // newLogoFile is the file object

      const response = await AxiosInterceptor.post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        fetchBrands();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  const handleDeleteBrand = async (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              const baseUrl = process.env.NODE_ENV === "development"
                ? `${process.env.REACT_APP_DEV_API}/api/brands`
                : `${process.env.REACT_APP_PRO_API}/api/brands`;

              await AxiosInterceptor.delete(`${baseUrl}/${id}`);
              fetchBrands();
            } catch (error) {
              console.error('Error deleting brand:', error);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setNewLogoFile(null);
    setPreviewUrl(null);
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
          <Plus className="mr-2 h-4 w-4" /> Tạo thương hiệu
        </button>
      </div>
      <div className="rounded-md border max-w-screen-lg mx-auto">
        <table className="w-full ">
          <thead>
            <tr className="border-b bg-primary/40">
              <th className="p-4 pl-5 text-left font-medium">ID</th>
              <th className="p-4 text-center font-medium">Tên thương hiệu</th>
              <th className="p-4 text-center font-medium">Logo</th>
              <th className="p-4 text-center font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.id} className="border-b">
                <td className="p-4 pl-5">{brand.id}</td>
                <td className="p-4 text-center">{brand.name}</td>
                <td className="p-4 text-center">
                  <img src={brand.logoUrl} alt={brand.name} className="w-16 h-auto mx-auto" />
                </td>
                <td className="p-4 text-center relative">
                  <button onClick={() => toggleRow(brand.id)} className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="inline h-5 w-5" />
                  </button>
                  {expandedRow === brand.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
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
            {brands.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Không tìm thấy thương hiệu!!!
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
                    Tạo thương hiệu
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Nhập tên thương hiệu và đường dẫn logo để tạo thương hiệu mới.
                    </p>
                  </div>

                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Tên thương hiệu"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 mb-3"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
                    />
                  </div>

                  {previewUrl && (
                    <div className="relative mt-4">
                      <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-md" />
                      <button
                        onClick={handleRemoveFile}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={handleClose}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-primary/70 px-4 py-2 text-sm font-medium text-black hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={handleCreateBrand}
                    >
                      Tạo mới
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BrandPage;
