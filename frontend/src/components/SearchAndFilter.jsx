import React, { useState } from 'react';

const SearchAndFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
      <select
        value={categoryFilter}
        onChange={handleCategoryChange}
        className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      >
        <option value="">All Categories</option>
        <option value="Tutoring">Tutoring</option>
        <option value="Design">Design</option>
        <option value="Delivery">Delivery</option>
        <option value="Writing">Writing</option>
        <option value="Events">Events</option>
        <option value="House Hunting">House Hunting</option>
        <option value="Laundry">Laundry</option>
      </select>
    </div>
  );
};

export default SearchAndFilter;
