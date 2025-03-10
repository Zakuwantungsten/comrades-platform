import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/solid';


const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">
              <StarIcon className="w-5 h-5" />
            </span>
            <span className="text-gray-800 font-medium mr-2">
              {service.rating.toFixed(1)}
            </span>
            <span className="text-gray-500">({service.numReviews})</span>
          </div>
          <span className="text-gray-800 font-medium">${service.price}</span>

          <Link
            to={`/services/${service._id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
