import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Messaging from './components/Messaging'; // Import Messaging component

import AdminDashboard from './components/AdminDashboard';



import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Services from './pages/Services';
import CreateServiceForm from './components/CreateServiceForm';
import EditServiceForm from './components/EditServiceForm';



import ServiceDetails from './pages/ServiceDetails';

import Profile from './pages/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';





function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
<Routes>


              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/new" element={<CreateServiceForm />} />
              <Route path="/services/edit/:id" element={<EditServiceForm />} />
          <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/messages/:receiverId" element={<Messaging />} /> {/* Add route for Messaging */}



              <Route path="/services/:id" element={<ServiceDetails />} />








              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />




            </Routes>
          </main>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
