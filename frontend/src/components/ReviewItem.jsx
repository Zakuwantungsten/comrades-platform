import React, { useState } from 'react';
import { StarIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import { useAuth } from '../context/AuthContext';
import api from '../api';


const ReviewItem = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${
                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          - {review.user?.name || 'Anonymous'}
        </div>
        {user?._id === review.user?._id && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this review?')) {
                  setIsDeleting(true);
                  try {
                    await api.delete(`/reviews/${review._id}`);
                    onDelete(review._id);
                  } catch (error) {
                    console.error('Error deleting review:', error);
                  } finally {
                    setIsDeleting(false);
                  }
                }
              }}
              className="text-red-500 hover:text-red-600"
              disabled={isDeleting}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewItem;
