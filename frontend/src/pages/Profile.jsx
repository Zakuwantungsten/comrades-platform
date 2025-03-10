import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getServicesByUser, deleteService } from '../api';
import ServiceCard from '../components/ServiceCard';
import EditServiceForm from '../components/EditServiceForm';
import UserDashboard from '../components/UserDashboard';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const [userServices, setUserServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

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

  useEffect(() => {
    fetchUserServices();
  }, [user]);

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteService(serviceId);
      fetchUserServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
  };

  const handleUpdateService = () => {
    setEditingService(null);
    fetchUserServices();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Your Profile</h2>
          
          <div className="mb-8">
            <UserDashboard />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Name:</label>
                <input
                  type="text"
                  value={user?.name}
                  readOnly
                  className="p-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Email:</label>
                <input
                  type="email"
                  value={user?.email}
                  readOnly
                  className="p-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Student ID:</label>
                <input
                  type="text"
                  value={user?.studentId}
                  readOnly
                  className="p-2 border rounded-lg"
                />
              </div>
              <button
                onClick={() => navigate('/profile/edit')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>


          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Services Offered</h3>
            {editingService ? (
              <EditServiceForm 
                service={editingService} 
                onUpdate={handleUpdateService}
                onCancel={() => setEditingService(null)}
              />
            ) : (
              userServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userServices.map(service => (
                    <div key={service._id} className="relative">
                      <ServiceCard service={service} />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">You haven't posted any services yet.</p>
              )
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Reviews Received</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">No reviews yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
