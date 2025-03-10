import React, { useState, useEffect } from 'react';
import { getServiceRequestsByUser } from '../api/services'; // Import service request API function

import { Link } from 'react-router-dom'; // Import Link component

import { useAuth } from '../context/AuthContext';
import { getServicesByUser } from '../api'; // Remove duplicate import of getServiceRequestsByUser


const UserDashboard = () => {
  const { user } = useAuth();
  const [servicesCount, setServicesCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]); // State for service requests


  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      const fetchRequests = async () => {
        try {
          const requests = await getServiceRequestsByUser(); // Fetch service requests
          setServiceRequests(requests);
        } catch (error) {
          console.error('Error fetching service requests:', error);
        }
      };

      await fetchRequests(); // Call fetch requests

      try {
        const [services, requests] = await Promise.all([
          getServicesByUser(user._id),
          getServiceRequestsByUser()

        ]);

        setServicesCount(services.length);
        setRequestsCount(requests.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Your Dashboard</h2>
      <div className="mt-4">

        <Link to="/messages" className="text-blue-500 hover:underline">Go to Messages</Link>
      </div>

      
      {loading ? ( 

        <div className="text-center">Loading dashboard data...</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 p-6 rounded-lg"> {/* New section for service requests */}
          <h3 className="text-lg font-semibold text-yellow-600 mb-2">Service Requests</h3>
          <ul>
            {serviceRequests.map((request) => (
              <li key={request._id}>
                <Link to={`/services/${request.serviceId}`} className="text-blue-500 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
                  </svg>

                  {request.serviceTitle} {/* Display service title */}
                </Link>
              </li>
            ))}
          </ul>
        </div>

          <div className="bg-blue-50 p-6 rounded-lg"> 

            <h3 className="text-lg font-semibold text-blue-600 mb-2">Services Offered</h3>
            <p className="text-3xl font-bold">{servicesCount}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg"> 

            <h3 className="text-lg font-semibold text-green-600 mb-2">Service Requests</h3>
            <p className="text-3xl font-bold">{requestsCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
