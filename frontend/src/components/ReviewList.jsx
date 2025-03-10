import React, { useState } from 'react';
import ReviewItem from './ReviewItem';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

const ReviewList = ({ reviews, totalPages, currentPage, onPageChange, onDelete }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div>
      {reviews?.map((review) => (

        <ReviewItem 
          key={review._id} 
          review={review}
          onDelete={onDelete}
        />
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="mx-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
