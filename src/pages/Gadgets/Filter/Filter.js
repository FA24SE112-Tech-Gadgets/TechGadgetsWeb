import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Checkbox, Button, Slider, Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';

function Filter({ isVisible, onClose, onApplyFilters }) {
  const location = useLocation();
  const { categoryId } = location.state || {};
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const apiBaseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PRO_API;

  // Fetch filter data based on categoryId
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

  // Handle checkbox toggle
  const handleCheckboxChange = (specKeyName, filterId) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [specKeyName]: {
        ...prevFilters[specKeyName],
        [filterId]: !prevFilters[specKeyName]?.[filterId],
      },
    }));
  };

  // Apply selected filters and close modal
  const applyFilters = () => {
    const gadgetFilters = Object.entries(selectedFilters).flatMap(([key, filters]) =>
      Object.keys(filters).filter(filterId => filters[filterId]).map(filterId => filterId)
    );

    onApplyFilters({ 
      GadgetFilters: gadgetFilters,
      MinPrice: priceRange[0], 
      MaxPrice: priceRange[1]
    }); // Truyền MinPrice và MaxPrice cùng với GadgetFilters

    onClose();
  };

  // Helper function to render each filter category group
  const renderFilter = (filterCategory) => (
    <div key={filterCategory.specificationKeyName} className="filter-group mb-4">
      <h4 className="text-lg font-semibold mb-2">{filterCategory.specificationKeyName}</h4>
      {filterCategory.gadgetFilters.map((filterOption) => (
        <Checkbox
          key={filterOption.gadgetFilterId}
          checked={selectedFilters[filterCategory.specificationKeyName]?.[filterOption.gadgetFilterId] || false}
          onChange={() => handleCheckboxChange(filterCategory.specificationKeyName, filterOption.gadgetFilterId)}
        >
          {filterOption.value}
        </Checkbox>
      ))}
    </div>
  );

  // Choose render function based on category
  const renderFilterGroup = () => (
    <div>
      <h3 className="text-center font-semibold text-xl mb-4">Filter Options</h3>
      <Row gutter={[24, 24]}>
        {filters.map((filterCategory, index) => (
          <Col span={8} key={filterCategory.specificationKeyName}>
            <div className="filter-group mb-4">
              <h4 className="text-lg font-medium mb-2">{filterCategory.specificationKeyName}</h4>
              {filterCategory.gadgetFilters.map((filterOption) => (
                <Checkbox
                  key={filterOption.gadgetFilterId}
                  checked={selectedFilters[filterCategory.specificationKeyName]?.[filterOption.gadgetFilterId] || false}
                  onChange={() => handleCheckboxChange(filterCategory.specificationKeyName, filterOption.gadgetFilterId)}
                >
                  {filterOption.value}
                </Checkbox>
              ))}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
  

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
            max={100000000}
            defaultValue={priceRange}
            onChange={(value) => setPriceRange(value)}
          />
          <div className="flex justify-between">
            <span>Min: {priceRange[0]}</span>
            <span>Max: {priceRange[1]}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Filter;
