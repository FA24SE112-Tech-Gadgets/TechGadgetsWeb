import React, { useState } from 'react';
import { Button, Input, Space, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';

const CategoryManage = ({ visible, onClose }) => {
  const [categories, setCategories] = useState([]);

  const addCategory = (parentId = 0) => {
    const newCategory = { id: Date.now(), parentId, name: '', children: [] };
    if (parentId === 0) {
      setCategories([...categories, newCategory]); // Add root category
    } else {
      setCategories(updateCategories(categories, parentId, newCategory)); // Add child
    }
  };

  const updateCategories = (cats, parentId, newCat) => {
    return cats.map(cat => {
      if (cat.id === parentId) {
        return { ...cat, children: [...cat.children, newCat] };
      }
      if (cat.children.length > 0) {
        return { ...cat, children: updateCategories(cat.children, parentId, newCat) };
      }
      return cat;
    });
  };

  const deleteCategory = (id) => {
    const removeCategory = (cats) => cats.filter(cat => cat.id !== id)
      .map(cat => ({ ...cat, children: removeCategory(cat.children) }));
    setCategories(removeCategory(categories));
  };

  const handleNameChange = (id, name) => {
    const updateName = (cats) => cats.map(cat => {
      if (cat.id === id) {
        return { ...cat, name };
      }
      if (cat.children.length > 0) {
        return { ...cat, children: updateName(cat.children) };
      }
      return cat;
    });
    setCategories(updateName(categories));
  };

  const saveCategories = async () => {
    const saveCategory = async (category) => {
      try {
        const payload = {
          name: category.name,
        };

        if (category.parentId !== 0) {
          payload.parentId = category.parentId;
        }
        console.log("hello");

        const response = await AxiosInterceptor.post(
          process.env.NODE_ENV === "development"
            ? `${process.env.REACT_APP_DEV_API}/api/categories`
            : `${process.env.REACT_APP_PRO_API}/api/categories`,
          payload
        );

        return response.data.id;
      } catch (error) {
        console.error('Error saving category:', error);
        return null;
      }
    };

    const saveAllCategories = async (cats, parentId = 0) => {
      for (const cat of cats) {
        const newId = await saveCategory({ ...cat, parentId });
        if (newId && cat.children && cat.children.length > 0) {
          await saveAllCategories(cat.children, newId);
        }
      }
    };

    await saveAllCategories(categories);
  };

  const renderCategory = (cat) => (
    <div key={cat.id} className="ml-4">
      <Space>
        <Input
          value={cat.name}
          onChange={(e) => handleNameChange(cat.id, e.target.value)}
          placeholder="Nhập danh mục"
          className="w-64"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addCategory(cat.id)} />
        <Button type="danger" icon={<DeleteOutlined />} onClick={() => deleteCategory(cat.id)} />
      </Space>
      <div className="mt-2">
        {cat.children.map(child => renderCategory(child))}
      </div>
    </div>
  );

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={saveCategories}>
         Lưu
        </Button>,
      ]}
    >
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addCategory()} className="mb-4">
          thêm danh mục con
        </Button>
        <div>
          {categories.map(cat => renderCategory(cat))}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryManage;