import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from '../api';
import { CSVLink } from 'react-csv';
import { FiDownload, FiSearch } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend);


const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardStyle = "bg-white shadow-md rounded-lg p-4 mb-4";
  const titleStyle = "text-xl font-semibold text-blue-600";
  const statStyle = "text-2xl font-bold text-gray-800";

  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalServices: 0, 
    totalRequests: 0,
    activeUsers: 0,
    pendingServices: 0
  });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  
  // Pagination state
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
const fetchDashboardData = async () => {
  // Fetch additional data if needed

      setIsLoading(true);
      try {
  const statsResponse = await api.get('/admin/dashboard'); // Updated endpoint if necessary

        setStats(statsResponse.data);

  const [usersResponse, servicesResponse, requestsResponse, newDataResponse] = await Promise.all([

          api.get('/admin/users'),
          api.get('/admin/services'),
          api.get('/admin/requests')
        ]);

        setUsers(usersResponse.data);
        setServices(servicesResponse.data);
  setRequests(requestsResponse.data);
  // Handle new data if applicable

        setFilteredUsers(usersResponse.data);
        setFilteredServices(servicesResponse.data);
        setFilteredRequests(requestsResponse.data);
      } catch (err) {
        setError('Error fetching admin data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      setFilteredUsers(
        users.filter(user => 
          (user?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (user?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        )

      );
      setFilteredServices(
        services.filter(service => 
          (service?.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        )

      );
      setFilteredRequests(
        requests.filter(request => 
          (request?.service?.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (request?.user?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        )

      );
    };

    filterData();
  }, [searchQuery, users, services, requests]);


  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/admin/services/${serviceId}`);
        setServices(services.filter(service => service._id !== serviceId));
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await api.delete(`/admin/requests/${requestId}`);
        setRequests(requests.filter(request => request._id !== requestId));
      } catch (err) {
        console.error('Error deleting request:', err);
      }
    }
  };

  return (
    <div className="p-4">
<h1 className={titleStyle}>Admin Dashboard - Updated</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={cardStyle}>
          <h2 className={statStyle}>Total Users: {stats.totalUsers}</h2>
          <p className="text-gray-600">Active: {stats.activeUsers}</p>
        </div>
        <div className={cardStyle}>
          <h2 className={statStyle}>Total Services: {stats.totalServices}</h2>
          <p className="text-gray-600">Pending: {stats.pendingServices}</p>
        </div>
        <div className={cardStyle}>
          <h2 className={statStyle}>Total Requests: {stats.totalRequests}</h2>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
          <div className="w-64 mx-auto">
            <Pie 
              data={{
                labels: ['Active Users', 'Inactive Users'],
                datasets: [{
                  label: 'Users',
                  data: [stats.activeUsers, stats.totalUsers - stats.activeUsers],
                  backgroundColor: ['#3b82f6', '#e5e7eb'],
                  borderWidth: 0,
                }]
              }}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <CSVLink 
          data={[...filteredUsers, ...filteredServices, ...filteredRequests]}
          filename="admin-data.csv"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <FiDownload className="mr-2" />
          Export Data
        </CSVLink>
      </div>


      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>} 

      <div className="mt-4">
        <h2 className={titleStyle}>Users</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>

              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.slice((currentUserPage - 1) * itemsPerPage, currentUserPage * itemsPerPage).map((user, index) => (

              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-red-500" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => setCurrentUserPage(currentUserPage - 1)} 
            disabled={currentUserPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentUserPage(currentUserPage + 1)} 
            disabled={currentUserPage * itemsPerPage >= filteredUsers.length}

            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h2 className={titleStyle}>Services</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.slice((currentServicePage - 1) * itemsPerPage, currentServicePage * itemsPerPage).map(service => (

              <tr key={service._id}>
                <td className="py-2 px-4 border-b">{service.title}</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-red-500" onClick={() => handleDeleteService(service._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => setCurrentServicePage(currentServicePage - 1)} 
            disabled={currentServicePage === 1}
            className="bg-blue-极 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentServicePage(currentServicePage + 1)} 
            disabled={currentServicePage * itemsPerPage >= filteredServices.length}

            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h2 className={titleStyle}>Service Requests</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Service Title</th>
              <th className="py-2 px-4 border-b">Requested By</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.slice((currentRequestPage - 1) * itemsPerPage, currentRequestPage * itemsPerPage).map(request => (

              <tr key={request._id}>
                <td className="py-2 px-4 border-b">{request.service.title}</td>
                <td className="py-2 px-4 border-b">{request.user.name}</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-red-500" onClick={() => handleDeleteRequest(request._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => setCurrentRequestPage(currentRequestPage - 1)} 
            disabled={currentRequestPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentRequestPage(currentRequestPage + 1)} 
            disabled={currentRequestPage * itemsPerPage >= filteredRequests.length}

            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
