import React, { useState, useEffect } from 'react'
import { FaChevronDown, FaChevronUp, FaPencilAlt, FaTrash, FaPlus, FaTimes, FaCheck } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AxiosInterceptor from '~/components/api/AxiosInterceptor'

<style jsx>{`
  .toggle-checkbox {
    right: 0;
    left: 0;
    transition: all 0.3s;
  }
  .toggle-checkbox:checked {
    right: 0;
    left: auto;
    border-color: #68D391;
  }
  .toggle-checkbox:not(:checked) {
    right: auto;
    left: 0;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #68D391;
  }
`}</style>

const criteriaTypes = ['Specification', 'Name', 'Description', 'Condition', 'Price']

export default function ManagerKeyWord() {
  const [groups, setGroups] = useState([])
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [criteriaForm, setCriteriaForm] = useState({
    type: 'Name',
    contains: '',
    minPrice: '',
    maxPrice: '',
    specificationKeyId: '',
    categories: []
  })
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [editingGroupName, setEditingGroupName] = useState('')
  const [categories, setCategories] = useState([])
  const [specifications, setSpecifications] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [showAddKeyword, setShowAddKeyword] = useState({})
  const [editingKeyword, setEditingKeyword] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } })

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
      const originalGroup = groups.find(group => group.id === editingGroupId);
      if (originalGroup && originalGroup.name === editingGroupName) {
        setEditingGroupId(null);
        setEditingGroupName('');
        return;
      }

      setConfirmModal({
        isOpen: true,
        title: 'Cập nhật tên nhóm',
        message: 'Bạn có chắc chắn muốn cập nhật tên nhóm này?',
        onConfirm: async () => {
          try {
            await AxiosInterceptor.patch(`/api/natural-language-keyword-groups/${editingGroupId}`, {
              name: editingGroupName
            });
            setGroups(groups.map(group =>
              group.id === editingGroupId ? { ...group, name: editingGroupName } : group
            ));
            setEditingGroupId(null);
            setEditingGroupName('');
            toast.success('Tên nhóm đã được cập nhật thành công');
          } catch (error) {
            console.error('Error updating group name:', error);
            if (error.response && error.response.data && error.response.data.reasons) {
              toast.error(`Lỗi: ${error.response.data.reasons[0].message}`);
            } else {
              toast.error('Đã xảy ra lỗi khi cập nhật tên nhóm');
            }
          }
        }
      });
    }
  };

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
      toast.success('Tiêu chí mới đã được thêm thành công');
      fetchGroups()
      setShowCriteriaModal(false)
      setCriteriaForm({
        type: 'Name',
        contains: '',
        minPrice: '',
        maxPrice: '',
        specificationKeyId: '',
        categories: []
      })
    } catch (error) {
      console.error('Error adding criteria:', error)
    }
  }

  const handleAddKeyword = async (groupId) => {
    if (!newKeyword.trim()) return;

    try {
      if (editingKeyword) {
        await AxiosInterceptor.patch(`/api/natural-language-keyword-groups/natural-language-keywords/${editingKeyword}`, {
          keyword: newKeyword,
          status: "Active"
        });
        toast.success('Từ khóa đã được cập nhật thành công');
      } else {
        await AxiosInterceptor.post(`/api/natural-language-keyword-groups/${groupId}/natural-language-keywords`, {
          keyword: newKeyword
        });
        toast.success('Từ khóa mới đã được thêm thành công');
      }
      fetchGroups();
      setNewKeyword('');
      setShowAddKeyword(prev => ({ ...prev, [groupId]: false }));
      setEditingKeyword(null);
    } catch (error) {
      console.error('Error adding/updating keyword:', error);
      if (error.response && error.response.data && error.response.data.reasons) {
        toast.error(`Lỗi: ${error.response.data.reasons[0].message}`);
      } else {
        toast.error('Đã xảy ra lỗi khi thực hiện thao tác');
      }
    }
  };

  const deleteKeywordGroup = async (groupId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa nhóm từ khóa',
      message: 'Bạn có chắc chắn muốn xóa nhóm từ khóa này?',
      onConfirm: async () => {
        try {
          await AxiosInterceptor.delete(`/api/natual-language-keyword-groups/${groupId}`)
          fetchGroups()
          toast.success('Nhóm từ khóa đã được xóa thành công')
        } catch (error) {
          console.error('Error deleting keyword group:', error)
          if (error.response && error.response.data && error.response.data.reasons) {
            toast.error(`Lỗi: ${error.response.data.reasons[0].message}`);
          } else {
            toast.error('Đã xảy ra lỗi khi thực hiện thao tác');
          }
        }
      }
    })
  }

  const deleteKeyword = async (keywordId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa từ khóa',
      message: 'Bạn có chắc chắn muốn xóa từ khóa này?',
      onConfirm: async () => {
        try {
          await AxiosInterceptor.delete(`/api/natural-language-keyword-groups/natural-language-keywords/${keywordId}`)
          fetchGroups()
          toast.success('Từ khóa đã được xóa thành công')
        } catch (error) {
          console.error('Error deleting keyword:', error)
          if (error.response && error.response.data && error.response.data.reasons) {
            toast.error(`Lỗi: ${error.response.data.reasons[0].message}`);
          } else {
            toast.error('Đã xảy ra lỗi khi thực hiện thao tác');
          }
        }
      }
    })
  }

  const deleteCriteria = async (criteriaId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa tiêu chí',
      message: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
      onConfirm: async () => {
        try {
          await AxiosInterceptor.delete(`/api/natural-language-keyword-groups/criteria/${criteriaId}`)
          fetchGroups()
          toast.success('Tiêu chí đã được xóa thành công')
        } catch (error) {
          console.error('Error deleting criteria:', error)
          if (error.response && error.response.data && error.response.data.reasons) {
            toast.error(`Lỗi: ${error.response.data.reasons[0].message}`);
          } else {
            toast.error('Đã xảy ra lỗi khi thực hiện thao tác');
          }
        }
      }
    })
  }

  const toggleGroupStatus = async (groupId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setConfirmModal({
      isOpen: true,
      title: 'Thay đổi trạng thái nhóm',
      message: `Bạn có chắc chắn muốn ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} nhóm này?`,
      onConfirm: async () => {
        try {
          await AxiosInterceptor.patch(`/api/natural-language-keyword-groups/${groupId}`, {
            status: newStatus
          });
          fetchGroups();
          toast.success('Trạng thái nhóm đã được cập nhật thành công');
        } catch (error) {
          console.error('Error updating group status:', error);
          toast.error('Đã xảy ra lỗi khi cập nhật trạng thái nhóm');
        }
      }
    });
  };

  const toggleKeywordStatus = async (keywordId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setConfirmModal({
      isOpen: true,
      title: 'Thay đổi trạng thái từ khóa',
      message: `Bạn có chắc chắn muốn ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} từ khóa này?`,
      onConfirm: async () => {
        try {
          await AxiosInterceptor.patch(`/api/natural-language-keyword-groups/natural-language-keywords/${keywordId}`, {
            status: newStatus
          });
          fetchGroups();
          toast.success('Trạng thái từ khóa đã được cập nhật thành công');
        } catch (error) {
          console.error('Error updating keyword status:', error);
          toast.error('Đã xảy ra lỗi khi cập nhật trạng thái từ khóa');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <h1 className="text-3xl font-bold text-white">Quản lý từ khóa</h1>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Danh sách nhóm</h2>
            <Link to="/manage-create-keyword-group"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Tạo nhóm mới
            </Link>
          </div>

          <div className="space-y-6">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {editingGroupId === group.id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editingGroupName}
                            onChange={(e) => setEditingGroupName(e.target.value)}
                            className="border rounded px-2 py-1 text-lg text-gray-700 mr-2"
                            autoFocus
                          />
                          <button
                            onClick={saveGroupName}
                            className={`text-green-500 hover:text-green-600 transition duration-300 ease-in-out p-2 ${editingGroupName.trim() === groups.find(g => g.id === editingGroupId)?.name
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                              }`}
                            disabled={editingGroupName.trim() === groups.find(g => g.id === editingGroupId)?.name}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => {
                              setEditingGroupId(null);
                              setEditingGroupName('');
                            }}
                            className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out p-2 ml-2"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium text-lg text-gray-700">{group.name}</span>
                      )}
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                          type="checkbox"
                          name={`toggle-${group.id}`}
                          id={`toggle-${group.id}`}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
                          checked={group.status === 'Active'}
                          onChange={() => toggleGroupStatus(group.id, group.status)}
                        />
                        <label
                          htmlFor={`toggle-${group.id}`}
                          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${group.status === 'Active' ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                        ></label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleGroupNameEdit(group.id, group.name)}
                        className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out p-2"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => deleteKeywordGroup(group.id)}
                        className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out p-2"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out p-2"
                      >
                        {group.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
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
                              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                  type="checkbox"
                                  name={`toggle-keyword-${keyword.id}`}
                                  id={`toggle-keyword-${keyword.id}`}
                                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
                                  checked={keyword.status === 'Active'}
                                  onChange={() => toggleKeywordStatus(keyword.id, keyword.status)}
                                />
                                <label
                                  htmlFor={`toggle-keyword-${keyword.id}`}
                                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${keyword.status === 'Active' ? 'bg-green-400' : 'bg-gray-300'
                                    }`}
                                ></label>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingKeyword(keyword.id);
                                  setNewKeyword(keyword.keyword);
                                  setShowAddKeyword(prev => ({ ...prev, [group.id]: true }));
                                }}
                                className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out p-2"
                              >
                                <FaPencilAlt />
                              </button>
                              <button
                                onClick={() => deleteKeyword(keyword.id)}
                                className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out p-2"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {showAddKeyword[group.id] && (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Nhập từ khóa muốn thêm"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleAddKeyword(group.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            disabled={!newKeyword.trim() || (editingKeyword && newKeyword === group.naturalLanguageKeywords.find(k => k.id === editingKeyword)?.keyword)}
                          >
                            {editingKeyword ? 'Cập Nhật' : 'Tạo'}
                          </button>
                          <button
                            onClick={() => {
                              setShowAddKeyword(prev => ({ ...prev, [group.id]: false }));
                              setNewKeyword('');
                              setEditingKeyword(null);
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                      {!showAddKeyword[group.id] && (
                        <button
                          onClick={() => {
                            setShowAddKeyword(prev => ({ ...prev, [group.id]: true }));
                            setNewKeyword('');
                            setEditingKeyword(null);
                          }}
                          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                        >
                          <FaPlus />
                          <span>Thêm từ khóa</span>
                        </button>
                      )}
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
                                  ? `Giá: ${criteria.minPrice.toLocaleString()}đ đến ${criteria.maxPrice.toLocaleString()}đ`
                                  : criteria.type === 'Specification'
                                    ? `${criteria.specificationKey.name}: ${criteria.contains}`
                                    : `${criteria.type}: ${criteria.contains}`
                                }
                              </span>
                              <div className="text-sm text-gray-500">
                                {criteria.type === 'Specification'
                                  ? `Áp dụng: ${criteria.specificationKey.category.name}`
                                  : `Áp dụng: ${criteria.categories.map(cat => cat.name).join(', ')}`
                                }
                              </div>
                            </div>
                            <button
                              onClick={() => deleteCriteria(criteria.id)}
                              className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out p-2"
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
                    {criteriaForm.minPrice >= criteriaForm.maxPrice && (
                      <p className="text-red-500 text-sm mt-1">Giá tối thiểu phải nhỏ hơn giá tối đa.</p>
                    )}
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
                        if (selectedCategoryId) {
                          setCriteriaForm({
                            ...criteriaForm,
                            categories: [...criteriaForm.categories, selectedCategoryId]
                          });
                          setSelectedCategoryId('');
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out p-2"
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
                            className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out p-2"
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

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{confirmModal.title}</h2>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}

