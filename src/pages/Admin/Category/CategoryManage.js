import React, { useState } from 'react';
import { Button, Input, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);

  // Add category
  const addCategory = (parentId = 0) => {
    const newCategory = { id: Date.now(), parentId, name: '', children: [] };
    if (parentId === 0) {
      setCategories([...categories, newCategory]); // Add root category
    } else {
      setCategories(updateCategories(categories, parentId, newCategory)); // Add child
    }
  };

  // Update categories with new children
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

  // Delete category
  const deleteCategory = (id) => {
    const removeCategory = (cats) => cats.filter(cat => cat.id !== id)
      .map(cat => ({ ...cat, children: removeCategory(cat.children) }));
    setCategories(removeCategory(categories));
  };

  // Handle name change
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

  // Save categories to API
  const saveCategories = async () => {
    const saveCategory = async (category) => {
      console.log("Saving category:", category.name);
      try {
        const payload = {
          name: category.name,
        };

        if (category.parentId !== 0) {
          payload.parentId = category.parentId;
        }
        console.log("Payload being sent:", payload);
        const response = await AxiosInterceptor.post(
          process.env.NODE_ENV === "development"
            ? `${process.env.REACT_APP_DEV_API}/api/categories`
            : `${process.env.REACT_APP_PRO_API}/api/categories`,
          payload
        );

        console.log('Category saved:', response.data);
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
          placeholder="Enter category name"
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => addCategory()} className="mb-4">
        Add Root Category
      </Button>
      <div>
        {categories.map(cat => renderCategory(cat))}
      </div>
      <Button type="primary" onClick={saveCategories} className="mt-4">
        Save Categories
      </Button>
    </div>
  );
};

export default CategoryManage;