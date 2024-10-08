import React, { useState } from "react";
import { Breadcrumb, Button, Tag } from "antd";
import { Link } from "react-router-dom";
import fakeData from "./fakeData";
import PhoneCard from "./phoneCard";
import FilterPhoneModal from "../Filter/filterPhone";
import { FilterAltSharp } from "@mui/icons-material";
import FilterLaptopModal from "../Filter/filterLaptop";

export default function Iphone() {
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 53000000],
    ram: [],
    storage: [],
    refreshRate: [],
    resolution: [],
    specialFeatures: [],
    charging: [],
  });
  const [sortOrder, setSortOrder] = useState(null);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Remove individual filter
  const removeFilter = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].filter((item) => item !== value),
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      brands: [],
      priceRange: [0, 53000000],
      ram: [],
      storage: [],
      refreshRate: [],
      resolution: [],
      specialFeatures: [],
      charging: [],
    });
  };

  const Products = () => {
    return (
      fakeData.filter((product) => {
        const brandMatch = filters.brands.length > 0 ? filters.brands.includes(product.brand) : true;
        const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const ramMatch = filters.ram.length > 0 ? filters.ram.includes(product.ram) : true;
        const storageMatch = filters.storage.length > 0 ? filters.storage.includes(product.memory) : true;
        const refreshRateMatch = filters.refreshRate.length > 0 ? filters.refreshRate.includes(product.refreshRate) : true;
        const resolutionMatch = filters.resolution.length > 0 ? filters.resolution.includes(product.screenResolution) : true;
        const specialFeaturesMatch = filters.specialFeatures.length > 0 ? filters.specialFeatures.every((feature) => product.specialFeatures.includes(feature)) : true;
        const chargingMatch = filters.charging.length > 0 ? filters.charging.every((chargingOption) => product.chargingFeatures.includes(chargingOption)) : true;

        return brandMatch && priceMatch && ramMatch && storageMatch && refreshRateMatch && resolutionMatch && specialFeaturesMatch && chargingMatch;
      }) || [] // Always return an empty array if filter fails
    );
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedProducts = (products) => {
    if (sortOrder === "asc") {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      return products.sort((a, b) => b.price - a.price);
    }
    return products;
  };

  // Render selected filters
  const renderSelectedFilters = () => {
    const selectedFilters = [];

    // Ensure brands is an array and has values
    if (Array.isArray(filters.brands) && filters.brands.length > 0) {
      filters.brands.forEach((brand) => {
        selectedFilters.push({ label: `Brand: ${brand}`, filterType: "brands", value: brand });
      });
    }

    // Check price range (avoid default values)
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 53000000) {
      selectedFilters.push({
        label: `Price: ${filters.priceRange[0].toLocaleString("vi-VN")}₫ - ${filters.priceRange[1].toLocaleString("vi-VN")}₫`,
        filterType: "priceRange",
        value: "priceRange",
      });
    }

    // Ensure ram is an array and has values
    if (Array.isArray(filters.ram) && filters.ram.length > 0) {
      filters.ram.forEach((ram) => {
        selectedFilters.push({ label: `RAM: ${ram}`, filterType: "ram", value: ram });
      });
    }

    // Ensure storage is an array and has values
    if (Array.isArray(filters.storage) && filters.storage.length > 0) {
      filters.storage.forEach((storage) => {
        selectedFilters.push({ label: `Storage: ${storage}`, filterType: "storage", value: storage });
      });
    }

    // Ensure refreshRate is an array and has values
    if (Array.isArray(filters.refreshRate) && filters.refreshRate.length > 0) {
      filters.refreshRate.forEach((refreshRate) => {
        selectedFilters.push({ label: `Refresh Rate: ${refreshRate}Hz`, filterType: "refreshRate", value: refreshRate });
      });
    }

    // Ensure resolution is an array and has values
    if (Array.isArray(filters.resolution) && filters.resolution.length > 0) {
      filters.resolution.forEach((resolution) => {
        selectedFilters.push({ label: `Resolution: ${resolution}`, filterType: "resolution", value: resolution });
      });
    }

    // Ensure specialFeatures is an array and has values
    if (Array.isArray(filters.specialFeatures) && filters.specialFeatures.length > 0) {
      filters.specialFeatures.forEach((feature) => {
        selectedFilters.push({ label: `Feature: ${feature}`, filterType: "specialFeatures", value: feature });
      });
    }

    // Ensure charging is an array and has values
    if (Array.isArray(filters.charging) && filters.charging.length > 0) {
      filters.charging.forEach((charging) => {
        selectedFilters.push({ label: `Charging: ${charging}`, filterType: "charging", value: charging });
      });
    }

    return selectedFilters;
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-100 dark:bg-gray-950 dark:text-white">
      <div className="w-full max-w-7xl p-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">Trang chủ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/gadget">Điện thoại</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Apple</Breadcrumb.Item>
        </Breadcrumb>
        <div className="mb-4">
          <div className="flex space-x-4">
            <FilterPhoneModal onFilterChange={handleFilterChange} />
            <FilterLaptopModal/>
            {renderSelectedFilters().length > 0 && (
              <>
                <div className="flex gap-2 flex-wrap">
                  {renderSelectedFilters().map((filter, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => removeFilter(filter.filterType, filter.value)}
                    >
                      {filter.label}
                    </Tag>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Sắp xếp theo:</h4>

          <Button onClick={() => handleSort("asc")} className="mr-2">Giá thấp-cao</Button>
          <Button onClick={() => handleSort("desc")} className="mr-2">Giá cao-thấp</Button>
          <Button className="mr-2">% khuyến mãi hot</Button>
          <Button>Xem nhiều</Button>

        </div>

        {/* Display Selected Filters */}
      

        {/* Main content */}
        <div className="mt-8 min-h-[500px]">
          <h1 className="text-2xl font-bold mb-4">Danh sách iPhone</h1>

          {Products().length > 0 ? (
            <div className="grid grid-cols-5 gap-4">
              {sortedProducts(Products()).map((product) => (
                <PhoneCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-lg font-semibold min-h-[500px] flex items-center justify-center">
              Không tìm thấy sản phẩm phù hợp với tiêu chí lọc.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
