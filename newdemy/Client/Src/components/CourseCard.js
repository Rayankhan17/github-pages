import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{course.title}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {course.discountPercentage}% OFF
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          <span className="text-gray-500 line-through mr-2">${course.originalPrice}</span>
          <span className="text-xl font-bold text-indigo-600">${course.discountedPrice}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {course.enrollmentCount} students
          </span>
          <Link 
            to={`/course/${course.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Get Deal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;