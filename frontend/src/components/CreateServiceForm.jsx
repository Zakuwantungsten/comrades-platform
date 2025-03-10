import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createService } from '../api';
import { useNavigate } from 'react-router-dom';

const CreateServiceForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    availability: '',
    image: null,
    contactInfo: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const serviceData = {
        ...formData,
        provider: user._id
      };
      const createdService = await createService(serviceData);
      if (createdService) {
        setSuccess('Service created successfully!');
        // Clear form fields including file input
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          location: '',
          availability: '',
          image: null,
          contactInfo: ''
        });
        // Clear file input value
        document.querySelector('input[type="file"]').value = '';
        // Redirect to profile page after short delay
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      }
    } catch (error) {
      setError(error.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Create a New Service</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"

            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Price (Ksh)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Tutoring">Tutoring</option>
            <option value="Design">Design</option>
            <option value="Delivery">Delivery</option>
            <option value="Writing">Writing</option>
            <option value="Events">Events</option>
            <option value="House Hunting">House Hunting</option>
            <option value="Laundry">Laundry</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Availability</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Contact Info</label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Service Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Service'}
        </button>
      </form>
    </div>
  );
};

export default CreateServiceForm;
