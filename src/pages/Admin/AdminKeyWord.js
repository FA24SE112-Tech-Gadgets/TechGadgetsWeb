'use client'

import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaPencilAlt, FaTrash, FaToggleOn, FaToggleOff, FaPlus, FaTimes } from 'react-icons/fa'

// Initial mock data (unchanged)
const initialGroups = [
  {
    id: 1,
    name: 'Văn phòng',
    isActive: true,
    isExpanded: false,
    keywords: [
      { id: 1, text: 'Chạy bộ', isActive: true },
      { id: 2, text: 'Bơi lội', isActive: true },
      { id: 3, text: 'Đi bộ', isActive: false },
    ],
    criteria: [
      { id: 1, type: 'name', value: 'chạy', categories: ['Điện thoại', 'Tai nghe'] },
      { id: 2, type: 'name', value: 'nước', categories: ['Tai nghe'] },
      { id: 3, type: 'price', minPrice: 1000000, maxPrice: 2000000, categories: ['Loa'] },
    ]
  },
  {
    id: 2,
    name: 'Thể thao',
    isActive: true,
    isExpanded: false,
    keywords: [],
    criteria: []
  }
]

const categories = ['Điện thoại', 'Laptop', 'Tai nghe', 'Loa']

export default function AdminKeyWord() {
  const [groups, setGroups] = useState(initialGroups)
  const [newKeyword, setNewKeyword] = useState('')
  const [editingKeywordId, setEditingKeywordId] = useState(null)
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [criteriaForm, setCriteriaForm] = useState({
    type: 'name',
    value: '',
    minPrice: '',
    maxPrice: '',
    selectedCategories: []
  })

  // Toggle group expansion
  const toggleGroup = (groupId) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    ))
  }

  // Toggle active status
  const toggleActive = (groupId, keywordId = null) => {
    setGroups(groups.map(group => {
      if (groupId === group.id) {
        if (keywordId === null) {
          return { ...group, isActive: !group.isActive }
        }
        return {
          ...group,
          keywords: group.keywords.map(keyword =>
            keyword.id === keywordId ? { ...keyword, isActive: !keyword.isActive } : keyword
          )
        }
      }
      return group
    }))
  }

  // Add/Edit keyword
  const handleKeywordSubmit = (groupId) => {
    if (!newKeyword.trim()) return

    setGroups(groups.map(group => {
      if (group.id === groupId) {
        if (editingKeywordId) {
          return {
            ...group,
            keywords: group.keywords.map(keyword =>
              keyword.id === editingKeywordId ? { ...keyword, text: newKeyword } : keyword
            )
          }
        }
        return {
          ...group,
          keywords: [...group.keywords, { id: Date.now(), text: newKeyword, isActive: true }]
        }
      }
      return group
    }))
    setNewKeyword('')
    setEditingKeywordId(null)
  }

  // Delete keyword
  const deleteKeyword = (groupId, keywordId) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? { ...group, keywords: group.keywords.filter(k => k.id !== keywordId) }
        : group
    ))
  }

  // Edit keyword
  const startEditingKeyword = (keyword) => {
    setNewKeyword(keyword.text)
    setEditingKeywordId(keyword.id)
  }

  // Delete criteria
  const deleteCriteria = (groupId, criteriaId) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? { ...group, criteria: group.criteria.filter(c => c.id !== criteriaId) }
        : group
    ))
  }

  // Add new criteria
  const handleAddCriteria = () => {
    if (!selectedGroup) return

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

    setGroups(groups.map(group =>
      group.id === selectedGroup
        ? { ...group, criteria: [...group.criteria, newCriteria] }
        : group
    ))

    setShowCriteriaModal(false)
    setCriteriaForm({
      type: 'name',
      value: '',
      minPrice: '',
      maxPrice: '',
      selectedCategories: []
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <h1 className="text-3xl font-bold text-white">Quản lý từ khóa</h1>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Danh sách nhóm</h2>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              Tạo nhóm mới
            </button>
          </div>

          {/* Groups List */}
          <div className="space-y-6">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-lg text-gray-700">{group.name}</span>
                    <button 
                      onClick={() => toggleActive(group.id)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none ${group.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${group.isActive ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out">
                      <FaTrash />
                    </button>
                    <button 
                      onClick={() => toggleGroup(group.id)}
                      className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                    >
                      {group.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {group.isExpanded && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Keywords Section */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-semibold text-lg mb-4 text-gray-700">Từ khóa</h3>
                      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                        {group.keywords.map(keyword => (
                          <div key={keyword.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-gray-700">{keyword.text}</span>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => toggleActive(group.id, keyword.id)}
                                className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none ${keyword.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                              >
                                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${keyword.isActive ? 'translate-x-5' : ''}`} />
                              </button>
                              <button 
                                className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out"
                                onClick={() => startEditingKeyword(keyword)}
                              >
                                <FaPencilAlt />
                              </button>
                              <button 
                                className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                                onClick={() => deleteKeyword(group.id, keyword.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Nhập từ khóa muốn thêm"
                          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleKeywordSubmit(group.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          {editingKeywordId ? 'Cập nhật' : 'Tạo'}
                        </button>
                      </div>
                    </div>

                    {/* Criteria Section */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-semibold text-lg mb-4 text-gray-700">Tiêu chí</h3>
                      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                        {group.criteria.map(criteria => (
                          <div key={criteria.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div>
                              {criteria.type === 'name' ? (
                                <span className="text-gray-700">Phải chứa: <span className="font-medium">{criteria.value}</span></span>
                              ) : (
                                <span className="text-gray-700">Giá: <span className="font-medium">{criteria.minPrice.toLocaleString()} đến {criteria.maxPrice.toLocaleString()}</span></span>
                              )}
                              <div className="text-sm text-gray-500">
                                Áp dụng: {criteria.categories.join(', ')}
                              </div>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                              onClick={() => deleteCriteria(group.id, criteria.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedGroup(group.id)
                          setShowCriteriaModal(true)
                        }}
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                      >
                        <FaPlus />
                        <span>Thêm tiêu chí</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
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
                  <button className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out">
                    <FaPlus />
                  </button>
                </div>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {criteriaForm.selectedCategories.map((category, index) => (
                    <div key={category} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{index + 1}. {category}</span>
                      <button
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
                  onClick={() => setShowCriteriaModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                >
                  Hủy
                </button>
                <button
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

