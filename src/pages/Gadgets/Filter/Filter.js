import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Checkbox, Button } from 'antd';
import { useLocation } from 'react-router-dom';

function Filter({ isVisible, onClose, onApplyFilters }) {
  const location = useLocation();
  const { categoryId } = location.state || {};
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
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
    onApplyFilters(selectedFilters);
    onClose();
  };

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
        {filters.map((filterCategory) => (
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
        ))}
      </div>
    </Modal>
  );
}

export default Filter;
