import React, { useState } from 'react';
import { Laptop, Headphones, Speaker, Smartphone } from 'lucide-react';
import GadgetManagement from './GadgetManagement';
import { ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const categoryIds = {
  laptop: "458d7752-e45e-444a-adf9-f7201c07acd1",
  headphones: "9f6ac480-e673-49ec-9bc0-7566cca80b86",
  speakers: "bb65a310-e28e-4226-a562-0b6ea27f4faa",
  phones: "ea4183e8-5a94-401c-865d-e000b5d2b72d"
};

const categoryNames = {
  "458d7752-e45e-444a-adf9-f7201c07acd1": "Laptop",
  "9f6ac480-e673-49ec-9bc0-7566cca80b86": "Tai nghe",
  "bb65a310-e28e-4226-a562-0b6ea27f4faa": "Loa",
  "ea4183e8-5a94-401c-865d-e000b5d2b72d": "Điện thoại"
};

const GadgetManagementPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categoryIds.laptop);
const navigate = useNavigate();
  const categoryIcons = {
    [categoryIds.laptop]: Laptop,
    [categoryIds.headphones]: Headphones,
    [categoryIds.speakers]: Speaker,
    [categoryIds.phones]: Smartphone
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex space-x-4 mb-6 justify-end">
          {Object.entries(categoryIds).map(([key, id]) => {
            const IconComponent = categoryIcons[id];
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(id)}
                className={`px-4 py-2 rounded flex items-center ${
                  selectedCategory === id 
                    ? "bg-primary/80 text-white" 
                    : "bg-gray-100"
                }`}
              >
                <IconComponent className="inline-block mr-2" />
                {categoryNames[id]}
              </button>
            );
          })}
          <button onClick={()=>navigate("/seller/gadgets/create")} className="px-4 py-2 bg-primary/80 text-white rounded"
          >Tạo sản phẩm</button>
        </div>
      </div>
      <GadgetManagement categoryId={selectedCategory} />
    </div>
  );
};

export default GadgetManagementPage;