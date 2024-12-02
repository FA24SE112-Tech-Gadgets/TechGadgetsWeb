'use client'

import React, { useState, useEffect } from 'react'
import { FaChevronDown, FaChevronUp, FaPencilAlt, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import AxiosInterceptor from "~/components/api/AxiosInterceptor"

const criteriaTypes = ['Specification', 'Name', 'Description', 'Condition', 'Price']

export default function ManagerKeyWord() {
  const [groups, setGroups] = useState([])
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [criteriaForm, setCriteriaForm] = useState({
    type: 'Name',
    contains: '',
    minPrice: 0,
    maxPrice: 0,
    specificationKeyId: '',
    categories: []
  })
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [editingGroupName, setEditingGroupName] = useState('')
  const [categories, setCategories] = useState([])
  const [specifications, setSpecifications] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  useEffect(() => {
    fetchGroups()
    fetchCategories()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await AxiosInterceptor.get('/api/natual-language-keyword-groups')
      setGroups(response.data.items)
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await AxiosInterceptor.get('/api/categories')
      setCategories(response.data.items)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSpecifications = async (categoryId) => {
    try {
      const response = await AxiosInterceptor.get(`/api/specification-keys/categories/${categoryId}?Page=1&PageSize=100`)
      setSpecifications(response.data.items)
    } catch (error) {
      console.error('Error fetching specifications:', error)
    }
  }

  const toggleGroup = (groupId) => {
    setGroups(groups.map(group =>
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    ))
  }

  const handleGroupNameEdit = (groupId, name) => {
    setEditingGroupId(groupId)
    setEditingGroupName(name)
  }

  const saveGroupName = async () => {
    if (editingGroupId && editingGroupName.trim()) {
      try {
        await AxiosInterceptor.patch(`/api/natural-language-keyword-groups/${editingGroupId}`, {
          name: editingGroupName
        })
        setGroups(groups.map(group =>
          group.id === editingGroupId ? { ...group, name: editingGroupName } : group
        ))
        setEditingGroupId(null)
        setEditingGroupName('')
      } catch (error) {
        console.error('Error updating group name:', error)
      }
    }
  }

  const handleAddCriteria = async () => {
    if (!selectedGroup) return

    let criteriaData = {
      type: criteriaForm.type,
      categories: criteriaForm.categories
    }

    switch (criteriaForm.type) {
      case 'Specification':
        criteriaData.specificationKeyId = criteriaForm.specificationKeyId
        criteriaData.contains = criteriaForm.contains
        criteriaData.categories = []
        break
      case 'Name':
      case 'Description':
      case 'Condition':
        criteriaData.contains = criteriaForm.contains
        break
      case 'Price':
        criteriaData.minPrice = criteriaForm.minPrice
        criteriaData.maxPrice = criteriaForm.maxPrice
        break
    }

    try {
      await AxiosInterceptor.post(`/api/natural-language-keyword-groups/${selectedGroup}/criteria`, criteriaData)
      fetchGroups() // Refresh the groups data
      setShowCriteriaModal(false)
      setCriteriaForm({
        type: 'Name',
        contains: '',
        minPrice: 0,
        maxPrice: 0,
        specificationKeyId: '',
        categories: []
      })
    } catch (error) {
      console.error('Error adding criteria:', error)
    }
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
            <Link to="/admin/create-keyword-group"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Tạo nhóm mới
            </Link>
          </div>

          {/* Groups List */}
          <div className="space-y-6">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                  <div className="flex items-center space-x-4">
                    {editingGroupId === group.id ? (
                      <input
                        type="text"
                        value={editingGroupName}
                        onChange={(e) => setEditingGroupName(e.target.value)}
                        className="border rounded px-2 py-1 text-lg text-gray-700"
                        onBlur={saveGroupName}
                        onKeyPress={(e) => e.key === 'Enter' && saveGroupName()}
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-lg text-gray-700">{group.name}</span>
                    )}
                    <div className={`w-3 h-3 rounded-full ${group.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleGroupNameEdit(group.id, group.name)}
                      className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out"
                    >
                      <FaPencilAlt />
                    </button>
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
                        {group.naturalLanguageKeywords.map(keyword => (
                          <div key={keyword.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-gray-700">{keyword.keyword}</span>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${keyword.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                              <button className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out">
                                <FaPencilAlt />
                              </button>
                              <button className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Add keyword functionality can be implemented here */}
                    </div>

                    {/* Criteria Section */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-semibold text-lg mb-4 text-gray-700">Tiêu chí</h3>
                      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                        {group.criteria.map(criteria => (
                          <div key={criteria.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div>
                              <span className="text-gray-700">
                                {criteria.type === 'Price' 
                                  ? `Giá: ${criteria.minPrice.toLocaleString()} đến ${criteria.maxPrice.toLocaleString()}`
                                  : `${criteria.type}: ${criteria.contains || criteria.specificationKey}`
                                }
                              </span>
                              <div className="text-sm text-gray-500">
                                Áp dụng: {criteria.categories.map(cat => cat.name).join(', ')}
                              </div>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
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
                      onChange={(e) => setCriteriaForm({ ...criteriaForm, minPrice: parseInt(e.target.value) })}
                      placeholder="Giá tối thiểu"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="150000000"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">đến:</label>
                    <input
                      type="number"
                      value={criteriaForm.maxPrice}
                      onChange={(e) => setCriteriaForm({ ...criteriaForm, maxPrice: parseInt(e.target.value) })}
                      placeholder="Giá tối đa"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="150000000"
                    />
                  </div>
                </div>
              )}

              {criteriaForm.type !== 'Specification' && (
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
                            categories: [...criteriaForm.categories, e.target.value]
                          })
                        }
                      }}
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
                        const availableCategories = categories.filter(cat => !criteriaForm.categories.includes(cat.id));
                        if (availableCategories.length > 0) {
                          const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
                          setCriteriaForm({
                            ...criteriaForm,
                            categories: [...criteriaForm.categories, randomCategory.id]
                          });
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
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

