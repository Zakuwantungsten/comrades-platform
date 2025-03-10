import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/solid';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const ReviewForm = ({ serviceId, onReviewSubmit }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    try {
      const response = await api.post('/reviews', {
        service: serviceId,
        rating,
        comment,
        user: user._id
      });

      onReviewSubmit(response.data);
      setRating(0);
      setComment('');
      setError(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Write your review..."
          rows="4"
          required
        />
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 mb-4">
            Review submitted successfully!
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>

      </form>
    </div>
  );
};

export default ReviewForm;
