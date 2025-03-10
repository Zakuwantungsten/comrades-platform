import React, { useEffect, useState } from 'react';
import { getAllServices } from '../api';

import ServiceCard from '../components/ServiceCard';
import SearchAndFilter from '../components/SearchAndFilter';

import CreateServiceForm from '../components/CreateServiceForm';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaFilter } from 'react-icons/fa';



const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(6);
  const { user } = useAuth();





  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();

          setServices(data);
          setFilteredServices(data);

          setFilteredServices(data);

      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceCreated = (newService) => {
    setServices([newService, ...services]);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">All Services</h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Tutoring">Tutoring</option>
                <option value="Delivery">Delivery</option>
                <option value="Design">Design</option>
                <option value="Events">Events</option>
                <option value="Writing">Writing</option>
                <option value="Coding">Coding</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>

          {user && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-100 transition duration-300 whitespace-nowrap"
            >
              {showCreateForm ? 'Hide Form' : 'Offer Service'}
            </button>
          )}
        </div>



        {showCreateForm && (
          <div className="mb-8">
            <CreateServiceForm onServiceCreated={handleServiceCreated} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter(service => 
              service.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              (selectedCategory === 'All' || service.category === selectedCategory)
            )
            .sort((a, b) => {
              switch (sortBy) {
                case 'newest':
                  return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                  return new Date(a.createdAt) - new Date(b.createdAt);
                case 'priceLow':
                  return a.price - b.price;
                case 'priceHigh':
                  return b.price - a.price;
                default:
                  return 0;
              }
            })
            .slice((currentPage - 1) * servicesPerPage, currentPage * servicesPerPage)
            .map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
        </div>


        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="bg-white text-blue-600 px-4 py-2 rounded-lg">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * servicesPerPage >= services.length}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>


      </div>
    </div>
  );
};

export default Services;
