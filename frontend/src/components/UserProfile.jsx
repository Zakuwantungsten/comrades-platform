import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getServicesByUser } from '../api';

const UserProfile = () => {
  const { user } = useAuth();
  const [userServices, setUserServices] = useState([]);

  useEffect(() => {
    const fetchUserServices = async () => {
      if (user) {
        try {
          const services = await getServicesByUser(user._id);
          setUserServices(services);
        } catch (error) {
          console.error('Error fetching user services:', error);
        }
      }
    };

    fetchUserServices();
  }, [user]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Your Profile</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Student ID:</span> {user?.studentId}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Services</h3>
        {userServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userServices.map(service => (
              <div key={service._id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{service.title}</h4>
                <p className="text-sm text-gray-600">{service.description}</p>
                <p className="text-sm text-gray-600">Price: KES {service.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't posted any services yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
