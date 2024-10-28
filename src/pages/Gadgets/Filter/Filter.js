import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Checkbox, Button, Slider, Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';

function Filter({ isVisible, onClose, onApplyFilters }) {
  const location = useLocation();
  const { categoryId } = location.state || {};
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState([0, 200000000]);
  const apiBaseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PRO_API;

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/gadget-filters/category/${categoryId}`);
        setFilters(response.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    if (categoryId) {
      fetchFilters();
    }
  }, [categoryId]);


  const handleCheckboxChange = (specKeyName, filterId) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [specKeyName]: {
        ...prevFilters[specKeyName],
        [filterId]: !prevFilters[specKeyName]?.[filterId],
      },
    }));
  };


  const applyFilters = () => {
    const gadgetFilters = Object.entries(selectedFilters).flatMap(([key, filters]) =>
      Object.keys(filters).filter(filterId => filters[filterId]).map(filterId => filterId)
    );

    onApplyFilters({ 
      GadgetFilters: gadgetFilters,
      MinPrice: priceRange[0], 
      MaxPrice: priceRange[1]
    }); 

    onClose();
  };
  // Choose render function based on category
  const renderFilterGroup = () => (
    <div className="space-y-6">
      <h3 className="text-center font-semibold text-xl mb-4">Filter Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filters.map((filterCategory) => (
          <div key={filterCategory.specificationKeyName} className="filter-group">
            <h4 className="text-lg font-medium mb-2">{filterCategory.specificationKeyName}</h4>
            <div className="space-y-2">
              {filterCategory.gadgetFilters.map((filterOption) => (
                <Checkbox
                  key={filterOption.gadgetFilterId}
                  checked={selectedFilters[filterCategory.specificationKeyName]?.[filterOption.gadgetFilterId] || false}
                  onChange={() => handleCheckboxChange(filterCategory.specificationKeyName, filterOption.gadgetFilterId)}
                >
                  <span className="text-sm">{filterOption.value}</span>
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  

  return (
    <Modal
      title="Filter Products"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={applyFilters}>
          Apply
        </Button>,
      ]}
    >
      <div className="filter-container">
        {renderFilterGroup()}
        
        {/* Thêm bộ lọc MinPrice và MaxPrice */}
        <div className="price-filter my-4">
          <h4 className="text-lg font-semibold mb-2">Price Range</h4>
          <Slider
            range
            min={0}
            max={200000000}
            defaultValue={priceRange}
            onChange={(value) => setPriceRange(value)}
          />
          <div className="flex justify-between">
          <span>Min: {priceRange[0].toLocaleString()} VND</span>
          <span>Max: {priceRange[1].toLocaleString()} VND</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Filter;
