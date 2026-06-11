import React from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react';

const BookCard = ({book}) => {
  return (
    <Link to={`/book/${book.id}/`}>
        <div className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg'>
            <h2 className='text-xl font-semibold'>{book.title}</h2>
            <p className='text-gray-600'>{book.author}</p>
            <div className='flex items-center mt-2'>
                <span className="text-yellow-500 text-2xl mb-1">★</span>
                <span className='ml-1'>{book.average_rating || 'No ratings'}</span>
                <span className='text-gray-400 text-sm ml-2'>({book.total_ratings})</span>
            </div>
        </div>
    </Link>
  )
}

export default BookCard