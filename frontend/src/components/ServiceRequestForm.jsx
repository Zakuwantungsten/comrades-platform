import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createServiceRequest, sendMessage } from '../api';
import { useNavigate } from 'react-router-dom';

const ServiceRequestForm = ({ serviceId, serviceProviderId, serviceTitle }) => {
  const { user } = useAuth();
  console.log("User:", user); // Debugging log to check user information

  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const requestData = {
        message,
        date,
        time,
        service: serviceId,
        user: user._id
      };
      console.log("Request Data:", requestData); // Debugging log to check request data
      const request = await createServiceRequest(requestData);
      console.log('Response:', request);

      // Send notification message to service provider
      await sendMessage({
        receiver: serviceProviderId,
        content: `New service request for ${serviceTitle}`,
        serviceRequestId: request._id
      });

      setSuccess('Service request sent successfully!');
    } catch (error) {
      setError('Failed to create service request. Please try again.');
      console.error('Error creating service request:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Request This Service</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Message to Provider</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Preferred Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Preferred Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
