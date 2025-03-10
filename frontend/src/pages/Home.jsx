import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllServices } from '../api';

import ServiceCard from '../components/ServiceCard';
import bannerBg from '../assets/images/banner-bg.jpg';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useAuth();
  const [topRatedServices, setTopRatedServices] = React.useState([]);
  const [trendingServices, setTrendingServices] = React.useState([]);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getAllServices();

        // For now, use latest services as placeholders
        setTopRatedServices(services.slice(0, 3));
        setTrendingServices(services.slice(3, 6));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    
    fetchServices();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center"
        style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Comrades Platform
          </h1>
          <p className="text-lg mb-8">
            {user ? `Hello, ${user.name}!` : 'Join our community of students helping students'}
          </p>
          <div className="space-x-4">
            <a
              href={user ? "/services/new" : "/register"}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-100"
            >
              {user ? 'Offer a Service' : 'Join Now'}
            </a>
            <a
              href="/services"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-100"
            >
              Browse Services
            </a>
          </div>
        </div>
      </div>

      {/* Top Rated Services */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Top Rated Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRatedServices.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </div>

      {/* Trending Services */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Trending Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingServices.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      </div>

      {/* Browse All Services Banner */}
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore All Services
          </h2>
          <a
            href="/services"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100"
          >
            Browse Services
          </a>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest services and updates
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none"
            />
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
