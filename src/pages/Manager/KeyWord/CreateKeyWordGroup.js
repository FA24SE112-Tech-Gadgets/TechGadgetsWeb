import React, { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import AxiosInterceptor from '~/components/api/AxiosInterceptor'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const criteriaTypes = ['Name', 'Description', 'Condition', 'Price', 'Specification']

export default function CreateKeyWordGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('')
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')
  const [criteria, setCriteria] = useState([])
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [criteriaForm, setCriteriaForm] = useState({
    type: 'Name',
    contains: '',
    minPrice: '',
    maxPrice: '',
    specificationKeyId: '',
    categories: []
  })
  const [categories, setCategories] = useState([])
  const [specifications, setSpecifications] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await AxiosInterceptor.get('/api/categories')
      setCategories(response.data.items)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories. Please try again.')
    }
  }

  const fetchSpecifications = async (categoryId) => {
    try {
      const response = await AxiosInterceptor.get(`/api/specification-keys/categories/${categoryId}?Page=1&PageSize=100`)
      setSpecifications(response.data.items)
    } catch (error) {
      console.error('Error fetching specifications:', error)
      toast.error('Failed to load specifications. Please try again.')
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, { id: Date.now(), text: newKeyword }])
      setNewKeyword('')
    }
  }

  const removeKeyword = (id) => {
    setKeywords(keywords.filter(keyword => keyword.id !== id))
  }

  const handleAddCriteria = () => {
    if (!isFormValid()) {
      toast.error('Bảng tiêu chí không được để trống.');
      return;
    }

    if (criteriaForm.type === 'Price') {
      const minPrice = criteriaForm.minPrice === '' ? 0 : parseFloat(criteriaForm.minPrice);
      const maxPrice = criteriaForm.maxPrice === '' ? 150000000 : parseFloat(criteriaForm.maxPrice);
    
      if (minPrice < 0 || minPrice > 150000000) {
        toast.error('Giá tối thiểu phải từ 0 đến nhỏ hơn hoặc bằng 150,000,000đ.');
        return;
      }
    
      if (maxPrice < 0 || maxPrice > 150000000) {
        toast.error('Giá tối đa phải từ 0 đến nhỏ hơn hoặc bằng 150,000,000đ.');
        return;
      }
    
      if (minPrice > maxPrice) {
        toast.error('Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu.');
        return;
      }
    }

    const newCriteria = {
      id: Date.now(),
      type: criteriaForm.type,
      categories: criteriaForm.categories,
    };

    switch (criteriaForm.type) {
      case 'Name':
      case 'Description':
      case 'Condition':
        newCriteria.contains = criteriaForm.contains;
        break;
      case 'Price':
        newCriteria.minPrice = criteriaForm.minPrice === '' ? 0 : parseFloat(criteriaForm.minPrice);
        newCriteria.maxPrice = criteriaForm.maxPrice === '' ? 150000000 : parseFloat(criteriaForm.maxPrice);
        break;
      case 'Specification':
        newCriteria.specificationKeyId = criteriaForm.specificationKeyId;
        newCriteria.contains = criteriaForm.contains;
        break;
    }

    setCriteria([...criteria, newCriteria]);
    setShowCriteriaModal(false);
    setCriteriaForm({
      type: 'Name',
      contains: '',
      minPrice: '',
      maxPrice: '',
      specificationKeyId: '',
      categories: [],
    });
  };

  const removeCriteria = (id) => {
    setCriteria(criteria.filter(c => c.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!groupName.trim()) {
      toast.error('Tên nhóm không được để trống.');
      return;
    }
    if (keywords.length === 0) {
      toast.error('Từ khóa không được để trống.');
      return;
    }
    if (criteria.length === 0) {
      toast.error('Tiêu chí không được để trống.');
      return;
    }
    setIsLoading(true)

    try {
      const requestBody = {
        name: groupName,
        keywords: keywords.map(k => k.text),
        criteria: criteria.map(c => {
          const criteriaData = {
            type: c.type,
            categories: c.categories
          }

          switch (c.type) {
            case 'Name':
            case 'Description':
            case 'Condition':
              criteriaData.contains = c.contains
              break
            case 'Price':
              criteriaData.minPrice = c.minPrice
              criteriaData.maxPrice = c.maxPrice
              break
            case 'Specification':
              criteriaData.specificationKeyId = c.specificationKeyId
              criteriaData.contains = c.contains
              break
          }

          return criteriaData
        })
      }

      console.log('Request body:', JSON.stringify(requestBody, null, 2))

      const response = await AxiosInterceptor.post('/api/natural-language-keyword-groups', requestBody)

      console.log('Group created:', response.data)
      setIsLoading(false)
      toast.success('Tạo tên nhóm thành công')
      setTimeout(() => {
        navigate('/manage-keyword')
      }, 2000)
    } catch (error) {
      console.error('Error creating group:', error)
      setIsLoading(false)
      if (error.response && error.response.data && error.response.data.reasons) {
        toast.error(`Lỗi: ${error.response.data.reasons[0].message}`)
      } else {
        toast.error('Failed to create group. Please try again.')
      }
    }
  }

  const isFormValid = () => {
    if (criteriaForm.type === 'Specification') {
      return (
        selectedCategoryId &&
        criteriaForm.specificationKeyId &&
        criteriaForm.contains.trim() !== ''
      );
    } else if (criteriaForm.type === 'Price') {
      return (
        (criteriaForm.minPrice === '' || criteriaForm.minPrice >= 0) &&
        (criteriaForm.maxPrice === '' || criteriaForm.maxPrice > criteriaForm.minPrice) &&
        criteriaForm.categories.length > 0
      );
    } else {
      return (
        criteriaForm.contains.trim() !== '' &&
        criteriaForm.categories.length > 0
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary/85"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <h1 className="text-3xl font-bold text-white">Tạo nhóm từ khóa mới</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Tên nhóm</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900">Từ khóa</h2>
            <div className="mt-2 space-y-2">
              {keywords.map(keyword => (
                <div key={keyword.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{keyword.text}</span>
                  <button type="button" onClick={() => removeKeyword(keyword.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập từ khóa mới"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Thêm
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900">Tiêu chí</h2>
            <div className="mt-2 space-y-2">
              {criteria.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    {c.type === 'Price' ? (
                      <span>Giá: {c.minPrice.toLocaleString()}đ đến {c.maxPrice.toLocaleString()}đ</span>
                    ) : c.type === 'Specification' ? (
                      <span>{c.type}: {specifications.find(spec => spec.id === c.specificationKeyId)?.name} - {c.contains}</span>
                    ) : (
                      <span>{c.type}: {c.contains}</span>
                    )}
                    <div className="text-sm text-gray-500">
                      Áp dụng: {c.type === 'Specification'
                        ? categories.find(cat => cat.id === selectedCategoryId)?.name
                        : c.categories.map(catId => categories.find(cat => cat.id === catId)?.name).join(', ')}
                    </div>
                  </div>
                  <button type="button" onClick={() => removeCriteria(c.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowCriteriaModal(true)}
              className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
            >
              <FaPlus className="mr-2" />
              Thêm tiêu chí
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate('/manage-keyword')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Tạo nhóm
            </button>
          </div>
        </form>
      </div>

      {/* Create Criteria Modal */}
      {showCriteriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Tạo tiêu chí</h2>
              <button
                onClick={() => setShowCriteriaModal(false)}
                className="text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Loại tiêu chí:</label>
                <select
                  value={criteriaForm.type}
                  onChange={(e) => {
                    setCriteriaForm({ ...criteriaForm, type: e.target.value })
                    if (e.target.value === 'Specification') {
                      setSelectedCategoryId('')
                      setSpecifications([])
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {criteriaTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {criteriaForm.type === 'Specification' && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Chọn danh mục:</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value)
                      fetchSpecifications(e.target.value)
                    }}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {criteriaForm.type === 'Specification' && selectedCategoryId && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Chọn thông số kỹ thuật:</label>
                  <select
                    value={criteriaForm.specificationKeyId}
                    onChange={(e) => setCriteriaForm({ ...criteriaForm, specificationKeyId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn thông số</option>
                    {specifications.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {['Name', 'Description', 'Condition', 'Specification'].includes(criteriaForm.type) && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phải chứa:</label>
                  <input
                    type="text"
                    value={criteriaForm.contains}
                    onChange={(e) => setCriteriaForm({ ...criteriaForm, contains: e.target.value })}
                    placeholder="Nhập giá trị"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {criteriaForm.type === 'Price' && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Giá từ:</label>
                    <input
                      type="number"
                      value={criteriaForm.minPrice}
                      onChange={(e) => setCriteriaForm({ ...criteriaForm, minPrice: e.target.value ? parseFloat(e.target.value) : '' })}
                      placeholder="Giá tối thiểu"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                     {criteriaForm.minPrice >= criteriaForm.maxPrice && (
                      <p className="text-red-500 text-sm mt-1">Giá tối thiểu phải nhỏ hơn giá tối đa.</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">đến:</label>
                    <input
                      type="number"
                      value={criteriaForm.maxPrice}
                      onChange={(e) => setCriteriaForm({ ...criteriaForm, maxPrice: e.target.value ? parseFloat(e.target.value) : '' })}
                      placeholder="Giá tối đa"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                   {criteriaForm.minPrice >= criteriaForm.maxPrice && (
                      <p className="text-red-500 text-sm mt-1">Giá tối đa phải lớn hơn giá tối thiểu.</p>
                    )}
                  </div>
                </div>
              )}

              {criteriaForm.type !== 'Specification' && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Danh sách thể loại áp dụng:</label>
                  <div className="flex items-center space-x-2">
                    <select
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                      <option value="">Chọn thể loại</option>
                      {categories.filter(cat => !criteriaForm.categories.includes(cat.id)).map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCategoryId && !criteriaForm.categories.includes(selectedCategoryId)) {
                          setCriteriaForm({
                            ...criteriaForm,
                            categories: [...criteriaForm.categories, selectedCategoryId]
                          });
                          setSelectedCategoryId('');
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                      disabled={!selectedCategoryId}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {criteriaForm.categories.map((categoryId) => {
                      const category = categories.find(c => c.id === categoryId);
                      return (
                        <div key={categoryId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{category ? category.name : 'Unknown Category'}</span>
                          <button
                            type="button"
                            onClick={() => setCriteriaForm({
                              ...criteriaForm,
                              categories: criteriaForm.categories.filter(c => c !== categoryId)
                            })}
                            className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCriteriaModal(false);
                    setCriteriaForm({
                      type: 'Name',
                      contains: '',
                      minPrice: '',
                      maxPrice: '',
                      specificationKeyId: '',
                      categories: []
                    });
                    setSelectedCategoryId('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAddCriteria}
                  disabled={!isFormValid()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tạo
                </button>
              </div>
              {!isFormValid() && (
                <div className="text-red-500 text-sm mt-2">
                  {criteriaForm.type === 'Specification' && (!selectedCategoryId || !criteriaForm.specificationKeyId || criteriaForm.contains.trim() === '')}
                  {criteriaForm.type === 'Price' && (criteriaForm.minPrice < 0 || criteriaForm.maxPrice <= criteriaForm.minPrice || criteriaForm.categories.length === 0) }
                  {['Name', 'Description', 'Condition'].includes(criteriaForm.type) && (criteriaForm.contains.trim() === '' || criteriaForm.categories.length === 0)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}