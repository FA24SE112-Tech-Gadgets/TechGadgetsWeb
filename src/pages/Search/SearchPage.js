import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import { allProducts } from "./Data";
import { FaFilter } from "react-icons/fa"; // Import icon filter

const SearchPage = () => {
  // const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    price: "",
    features: "",
    hot: false
  });
  const [showSortModal, setShowSortModal] = useState(false); // Modal state
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");
  useEffect(() => {
    const fetchResults = async () => {
      let results = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      applyFilters(results);
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [searchQuery, filters]);

  const applyFilters = (products) => {
    let filtered = [...products];

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }
    if (filters.price) {
      if (filters.price === "Below $150") {
        filtered = filtered.filter(product => product.price < 150);
      } else if (filters.price === "$150 - $200") {
        filtered = filtered.filter(product => product.price >= 150 && product.price <= 200);
      } else if (filters.price === "Above $200") {
        filtered = filtered.filter(product => product.price > 200);
      }
    }

    if (filters.features) {
      filtered = filtered.filter(product => product.features === filters.features);
    }
    if (filters.hot) {
      // Assuming hot products are defined somehow, e.g., a boolean property in the product object
      filtered = filtered.filter(product => product.hot);
    }

    setFilteredResults(filtered);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const clearFilter = (filterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: "",
    }));
  };
  // const toggleHotFilter = () => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     hot: !prevFilters.hot,
  //   }));
  // };

  const handleSortChange = (sortType) => {
    let sortedResults = [...filteredResults];

    switch (sortType) {
      case "topRated":
        sortedResults.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        sortedResults.sort((a, b) => b.popularity - a.popularity);
        break;
      case "priceHighToLow":
        sortedResults.sort((a, b) => b.price - a.price);
        break;
      case "priceLowToHigh":
        sortedResults.sort((a, b) => a.price - b.price);
        break;
      case "latestArrival":
        sortedResults.sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate));
        break;
      case "discount":
        sortedResults.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    setFilteredResults(sortedResults);
    setShowSortModal(false); // Close modal after sorting
  };

  const brandOptions = [
    { value: "Brand A", label: "Brand A" },
    { value: "Brand B", label: "Brand B" },
    { value: "Brand C", label: "Brand C" },
  ];

  const priceOptions = [
    { value: "Below $150", label: "Below $150" },
    { value: "$150 - $200", label: "$150 - $200" },
    { value: "Above $200", label: "Above $200" },
  ];

  const featuresOptions = [
    { value: "Leather", label: "Leather" },
    { value: "Cotton", label: "Cotton" },
    { value: "Polyester", label: "Polyester" },
  ];

  return (
    <div className="container mx-auto my-8 flex relative bg-white dark:bg-gray-900 dark:text-white duration-200">

      <div className="w-1/4 pr-8">
        <div className=" mb-6">
          <h1 className="text-xl font-thin">Results for "{searchQuery}"</h1>
        </div>
        {Object.values(filters).some((value) => value) && (
          <div className="p-4 border rounded-lg shadow-md my-8">
            <h2 className="text-lg mb-4">Applied Filters</h2>

            <div className="mb-4">
              {Object.entries(filters).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="mb-2 flex items-center justify-between">
                      <span className="capitalize border border-gray-300 rounded px-2 py-1"> {value}</span>
                      <button
                        onClick={() => clearFilter(key)}
                        className="text-red-500 ml-2"
                      >
                        x
                      </button>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        {/* Brand Filter */}
        <div className="mb-6">
          <CreatableSelect
            options={brandOptions}
            onChange={(selectedOption) =>
              handleFilterChange("brand", selectedOption ? selectedOption.value : "")
            }
            placeholder="Brand"
            isClearable
            className="mb-2"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '30px',
              }),
            }}
          />
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <Select
            options={priceOptions}
            onChange={(selectedOption) =>
              handleFilterChange("price", selectedOption ? selectedOption.value : "")
            }
            placeholder="Price"
            isClearable
            className="mb-2"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '30px',
              }),
            }}
          />
        </div>

        {/* Features Filter */}
        <div className="mb-6">
          <CreatableSelect
            options={featuresOptions}
            onChange={(selectedOption) =>
              handleFilterChange("features", selectedOption ? selectedOption.value : "")
            }
            placeholder="Features"
            isClearable
            className="mb-2"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '30px',
              }),
            }}
          />
        </div>
      </div>

      {/* Hot Filter Button */}
      <div className="absolute top-0 right-0 flex space-x-4 mt-4 mr-4">
        {/* <button
          onClick={toggleHotFilter}
          className={`w-10 h-10 rounded-full ${filters.hot ? 'bg-red-500' : 'bg-gray-300'} flex items-center justify-center`}
          title="Filter by Hot Items"
        >
          🔥
        </button> */}

        <button onClick={() => setShowSortModal(true)}>
          <FaFilter />
        </button>
      </div>

      {/* Results Section */}
      <div className="w-3/4 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredResults.length > 0 ? (
            filteredResults.map((product) => (
              <div
                key={product.id}
                className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-md transition-transform transform hover:scale-105"
                />
                <h2 className="text-lg font-semibold mt-4">{product.brand}</h2>
                <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            ))
          ) : (
            <p>No results found for the selected filters.</p>
          )}
        </div>
      </div>

      {/* Sort Modal */}
      {showSortModal && (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg p-6 z-50 transition-transform transform translate-x-0">
          <h2 className="text-lg font-bold mb-4">Sort By</h2>
          <ul className="space-y-4">
            <li className="cursor-pointer hover:underline" onClick={() => handleSortChange("topRated")}>Top Rated</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleSortChange("popularity")}>Popularity</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleSortChange("priceHighToLow")}>Price High to Low</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleSortChange("priceLowToHigh")}>Price Low to High</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleSortChange("latestArrival")}>Latest Arrival</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleSortChange("discount")}>Discount</li>
          </ul>
          <button
            className="mt-6 text-red-500"
            onClick={() => setShowSortModal(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
