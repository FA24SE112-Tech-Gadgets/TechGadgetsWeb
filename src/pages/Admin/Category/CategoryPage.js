import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { Search, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Trash2, MoreVertical } from 'lucide-react';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [newParentId, setNewParentId] = useState("");
  const [categoryDetail, setCategoryDetail] = useState(null);
  useEffect(() => {
    fetchCategories();
  }, [page, searchValue]);

  const fetchCategories = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/categories`
        : `${process.env.REACT_APP_PRO_API}/api/categories`;

      // Conditionally build the URL based on whether searchValue is provided and filter by isRoot: true
      const url = searchValue
        ? `${baseUrl}?Page=${page}&PageSize=10&Name=${searchValue}&isRoot=true`
        : `${baseUrl}?Page=${page}&PageSize=10&isRoot=true`;

      const response = await AxiosInterceptor.get(url);
      const totalItems = response.data.totalItems || 0;

      setCategories(response.data.items || []);
      setTotalPages(Math.ceil(totalItems / 10));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setTotalPages(0);
    }
  };

  const fetchCategoryDetail = async (id) => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/categories`
        : `${process.env.REACT_APP_PRO_API}/api/categories`;

      const response = await AxiosInterceptor.get(`${baseUrl}/${id}`);
      setCategoryDetail(response.data);
    } catch (error) {
      console.error('Error fetching category detail:', error);
      setCategoryDetail(null);
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
  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose = () => {
    setOpen(false);
    setNewCategoryName("");
    setNewParentId("");
  };
  const handleClose1 = () => {
    setOpen1(false);
    setNewCategoryName("");
    setNewParentId("");
  };

  const handleCreateCategory = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/categories`
        : `${process.env.REACT_APP_PRO_API}/api/categories`;

      const response = await AxiosInterceptor.post(baseUrl, { name: newCategoryName });

      if (response.status === 201) {
        fetchCategories();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
  const handleCreateSubCategory = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_DEV_API}/api/categories`
        : `${process.env.REACT_APP_PRO_API}/api/categories`;

      const response = await AxiosInterceptor.post(baseUrl, { name: newCategoryName, parentId: newParentId });

      if (response.status === 201) {
        fetchCategories();
        handleClose1();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa danh mục này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              const baseUrl = process.env.NODE_ENV === "development"
                ? `${process.env.REACT_APP_DEV_API}/api/categories`
                : `${process.env.REACT_APP_PRO_API}/api/categories`;

              await AxiosInterceptor.delete(`${baseUrl}/${id}`);
              fetchCategories();
            } catch (error) {
              console.error('Error deleting category:', error);
            }
          }
        },
        {
          label: 'Không',
          onClick: () => { }
        }
      ]
    });
  };

  const toggleRow = async (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
      setCategoryDetail(null);
    } else {
      setExpandedRow(id);
      await fetchCategoryDetail(id);
    }
  };

  const renderChildCategories = (children) => {
    if (!children) return null;

    // Ensure children is always an array
    const childrenArray = Array.isArray(children) ? children : [children];

    return (
      <ul className="pl-4 mt-2 space-y-2">
        {childrenArray.map((child) => (
          <li key={child.id} className="text-sm">
            <strong>{child.name}</strong> (ID: {child.id})
            {child.children && renderChildCategories(child.children)}
          </li>
        ))}
      </ul>
    );
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
          <Plus className="mr-2 h-4 w-4" /> Tạo danh mục
        </button>
        <button
          onClick={handleClickOpen1}
          className="flex items-center bg-primary/70 text-black font-medium px-4 py-2 rounded-md hover:bg-primary"
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo danh mục con
        </button>
      </div>
      <div className="rounded-md border max-w-screen-lg mx-auto">
        <table className="w-full ">
          <thead>
            <tr className="border-b bg-primary/40">
              <th className="p-4 pl-5 text-left font-medium">ID</th>
              <th className="p-4 text-center font-medium">Tên danh mục</th>
              <th className="p-4 text-center font-medium">Parent ID</th>
              {/* <th className="p-4 text-center font-medium">Admin Created</th> */}
              <th className="p-4 text-center font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <React.Fragment key={category.id}>
                <tr className="border-b">
                  <td className="p-4 pl-5">
                    {(page - 1) * 10 + (index + 1)}
                  </td>
                  <td className="p-4 text-center">{category.name}</td>
                  <td className="p-4 text-center">{category.parentId}</td>
                  <td className="p-4 text-center relative">
                    <button onClick={() => toggleRow(category.id)} className="text-gray-500 hover:text-gray-700">
                      {expandedRow === category.id ? <ChevronUp className="inline h-5 w-5" /> : <ChevronDown className="inline h-5 w-5" />}
                    </button>
                    {expandedRow === category.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-right"
                        >
                          <Trash2 className="inline h-5 w-5 mr-2" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                {expandedRow === category.id && categoryDetail && (
                  <tr>
                    <td colSpan="4" className="p-4 bg-gray-50">
                      <div className="text-sm">

                        {renderChildCategories(categoryDetail.children)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Không tìm thấy danh mục!!!
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
                    Tạo danh mục
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Nhập tên danh mục vào ô trống!
                    </p>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tên danh mục
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary/70 focus:border-primary/70 sm:text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary/70 px-4 py-2 text-sm font-medium text-black hover:bg-primary focus:outline-none"
                      onClick={handleCreateCategory}
                    >
                      Tạo
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={handleClose}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


      <Transition appear show={open1} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose1}>
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
                    Tạo danh mục
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Nhập tên danh mục vào ô trống!
                    </p>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nhập ID
                    </label>
                    <input
                      id="parentId"
                      type="text"
                      value={newParentId}
                      onChange={(e) => setNewParentId(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary/70 focus:border-primary/70 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tên danh mục
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary/70 focus:border-primary/70 sm:text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary/70 px-4 py-2 text-sm font-medium text-black hover:bg-primary focus:outline-none"
                      onClick={handleCreateSubCategory}
                    >
                      Tạo
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={handleClose1}
                    >
                      Hủy bỏ
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

export default CategoryPage;
