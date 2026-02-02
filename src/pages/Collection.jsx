import React from "react";
import { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/productItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Categories data
  const categories = [
    "Fashion",
    "Electronics", 
    "Books",
    "Beauty & Personal Care",
    "Toys",
    "Sports",
    "Grocery",
    "Home & Kitchen"
  ];

  const subCategories = [
    "Topwear",
    "Bottomwear", 
    "Winterwear"
  ];

  // Filter product by category and subcategory
  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubCategory(subCategory.filter((item) => item !== value));
    } else {
      setSubCategory([...subCategory, value]);
    }
  };

  const applyFilter = () => {
    let productCopy = [...products];

    if (showSearch && search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    
    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    sortProducts(productCopy);
  };

  const sortProducts = (productsToSort = filterProducts) => {
    let sortedProducts = [...productsToSort];

    switch (sortType) {
      case "low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilterProducts(sortedProducts);
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relevant");
  };

  // Initialize products on mount
  useEffect(() => {
    if (products && products.length > 0) {
      applyFilter();
    }
  }, [products]);

  useEffect(() => {
    if (products && products.length > 0) {
      applyFilter();
    }
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    if (filterProducts.length > 0) {
      sortProducts();
    }
  }, [sortType]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Product Collection</h1>
              <p className="mt-2 text-gray-600">
                {filterProducts.length} products found
              </p>
            </div>
            
            {/* Desktop Sort Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevant">Relevance</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center justify-between w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left"
              >
                <span className="font-medium text-gray-900">Filters</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    showFilter ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Filter Panel */}
            <div className={`bg-white rounded-lg border border-gray-200 ${showFilter ? 'block' : 'hidden'} lg:block`}>
              {/* Filter Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {(category.length > 0 || subCategory.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Mobile Sort (inside filter panel) */}
              <div className="lg:hidden p-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevant">Relevance</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="checkbox"
                        value={cat}
                        checked={category.includes(cat)}
                        onChange={toggleCategory}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sub Category Filter */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Type</h4>
                <div className="space-y-3">
                  {subCategories.map((subCat) => (
                    <label key={subCat} className="flex items-center">
                      <input
                        type="checkbox"
                        value={subCat}
                        checked={subCategory.includes(subCat)}
                        onChange={toggleSubCategory}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{subCat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(category.length > 0 || subCategory.length > 0) && (
              <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {category.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {cat}
                      <button
                        onClick={() => setCategory(category.filter(c => c !== cat))}
                        className="ml-2 hover:text-blue-600"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  {subCategory.map((subCat) => (
                    <span
                      key={subCat}
                      className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {subCat}
                      <button
                        onClick={() => setSubCategory(subCategory.filter(sc => sc !== subCat))}
                        className="ml-2 hover:text-green-600"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filterProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterProducts.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <ProductItem
                      name={item.name}
                      id={item._id}
                      price={item.price}
                      image={item.image}
                      imageStyle={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button (if needed) */}
            {filterProducts.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Showing {filterProducts.length} of {filterProducts.length} products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;