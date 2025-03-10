import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiInstance';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ServiceRequestForm from '../components/ServiceRequestForm';

const ServiceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleDeleteReview = useCallback(async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  }, []);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoadingReviews(true);
      try {
        const [serviceResponse, reviewsResponse] = await Promise.all([
          api.get(`/services/${id}`),
          api.get(`/reviews/service/${id}?page=${currentPage}`)
        ]);
        setService(serviceResponse.data);
        setReviews(reviewsResponse.data.reviews);
        setTotalPages(reviewsResponse.data.totalPages);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };

    fetchServiceDetails();
  }, [id, currentPage]);

  const handleReviewSubmit = (newReview) => {
    setReviews([newReview, ...reviews]);
    setService(prev => ({
      ...prev,
      rating: ((prev.rating * prev.numReviews) + newReview.rating) / (prev.numReviews + 1),
      numReviews: prev.numReviews + 1
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!service) {
    return <div className="text-center py-8">Service not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{service.title}</h1>
          {user && (
            <Link to="/messages" className="text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />

              </svg>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            )}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <img
                src="/images/business1.jpg"
                alt="Business photo 1"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/images/business2.jpg"
                alt="Business photo 2"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.453.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>

                </svg>
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>

                </svg>
              </a>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Price:</span> Ksh{service.price}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {service.location}
              </div>
              <div>
                <span className="font-semibold">Contact:</span> {service.contactInfo}
              </div>
              <div>
                <span className="font-semibold">Business Hours:</span> Mon-Fri 9am-5pm
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showRequestForm ? 'Hide Request Form' : 'Request Service'}
          </button>
          {showRequestForm && (
            <div className="mt-4">
              <ServiceRequestForm serviceId={service._id} />
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          <ReviewForm serviceId={service._id} onReviewSubmit={handleReviewSubmit} />
          <div className="mt-6">
            <ReviewList 
              reviews={reviews}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onDelete={handleDeleteReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
