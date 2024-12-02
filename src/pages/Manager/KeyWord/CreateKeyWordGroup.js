

import React, { useState } from 'react'
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa'
import { Navigate, useNavigate } from 'react-router-dom'

const categories = ['Điện thoại', 'Laptop', 'Tai nghe', 'Loa']

export default function CreateKeyWordGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('')
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')
  const [criteria, setCriteria] = useState([])
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [criteriaForm, setCriteriaForm] = useState({
    type: 'name',
    value: '',
    minPrice: '',
    maxPrice: '',
    selectedCategories: []
  })

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, { id: Date.now(), text: newKeyword, isActive: true }])
      setNewKeyword('')
    }
  }

  const removeKeyword = (id) => {
    setKeywords(keywords.filter(keyword => keyword.id !== id))
  }

  const handleAddCriteria = () => {
    const newCriteria = {
      id: Date.now(),
      type: criteriaForm.type,
      categories: criteriaForm.selectedCategories
    }

    if (criteriaForm.type === 'name') {
      newCriteria.value = criteriaForm.value
    } else {
      newCriteria.minPrice = parseFloat(criteriaForm.minPrice)
      newCriteria.maxPrice = parseFloat(criteriaForm.maxPrice)
    }

    setCriteria([...criteria, newCriteria])
    setShowCriteriaModal(false)
    setCriteriaForm({
      type: 'name',
      value: '',
      minPrice: '',
      maxPrice: '',
      selectedCategories: []
    })
  }

  const removeCriteria = (id) => {
    setCriteria(criteria.filter(c => c.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({ groupName, keywords, criteria })
    // After saving, redirect back to the main page
   navigate('/admin/keyword')
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
                    {c.type === 'name' ? (
                      <span>Phải chứa: {c.value}</span>
                    ) : (
                      <span>Giá: {c.minPrice.toLocaleString()} đến {c.maxPrice.toLocaleString()}</span>
                    )}
                    <div className="text-sm text-gray-500">
                      Áp dụng: {c.categories.join(', ')}
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
              onClick={() => navigate('/admin/keyword')}
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
                  onChange={(e) => setCriteriaForm({ ...criteriaForm, type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Tên</option>
                  <option value="price">Giá</option>
                </select>
              </div>

              {criteriaForm.type === 'name' ? (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phải chứa:</label>
                  <input
                    type="text"
                    value={criteriaForm.value}
                    onChange={(e) => setCriteriaForm({ ...criteriaForm, value: e.target.value })}
                    placeholder="Nhập giá trị"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Giá từ:</label>
                    <input
                      type="number"
                      value={criteriaForm.minPrice}
                      onChange={(e) => setCriteriaForm({ ...criteriaForm, minPrice: e.target.value })}
                      placeholder="Giá tối thiểu"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">đến:</label>
                    <input
                      type="number"
                      value={criteriaForm.maxPrice}
                      onChange={(e) => setCriteriaForm({ ...criteriaForm, maxPrice: e.target.value })}
                      placeholder="Giá tối đa"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Danh sách thể loại áp dụng:</label>
                <div className="flex items-center space-x-2">
                  <select
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setCriteriaForm({
                          ...criteriaForm,
                          selectedCategories: [...criteriaForm.selectedCategories, e.target.value]
                        })
                      }
                    }}
                  >
                    <option value="">Chọn thể loại</option>
                    {categories.filter(cat => !criteriaForm.selectedCategories.includes(cat)).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={() => {
                      if (criteriaForm.selectedCategories.length < categories.length) {
                        const availableCategories = categories.filter(cat => !criteriaForm.selectedCategories.includes(cat));
                        const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
                        setCriteriaForm({
                          ...criteriaForm,
                          selectedCategories: [...criteriaForm.selectedCategories, randomCategory]
                        });
                      }
                    }}
                    className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {criteriaForm.selectedCategories.map((category, index) => (
                    <div key={category} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{index + 1}. {category}</span>
                      <button
                        type="button"
                        onClick={() => setCriteriaForm({
                          ...criteriaForm,
                          selectedCategories: criteriaForm.selectedCategories.filter(c => c !== category)
                        })}
                        className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCriteriaModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAddCriteria}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

