'use client';

import { useState } from 'react';
import { X, BookOpen, Layers } from 'lucide-react';
import { BookSeries } from '@/lib/types';
import toast from 'react-hot-toast';

interface CreateSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeriesCreated: (series: BookSeries) => void;
}

export function CreateSeriesModal({ isOpen, onClose, onSeriesCreated }: CreateSeriesModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'General Fiction',
    type: 'fiction' as 'fiction' | 'nonfiction',
    totalPlannedBooks: 3,
    overallThemes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    'General Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Historical Fiction',
    'Literary Fiction',
    'Horror',
    'Young Adult',
    'Children&apos;s Literature',
    'Biography',
    'Memoir',
    'Self-Help',
    'Business',
    'History',
    'Science',
    'Philosophy',
    'Travel',
    'Health & Wellness'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a series title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a series description');
      return;
    }

    if (formData.totalPlannedBooks < 2) {
      toast.error('A series must have at least 2 books');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          overallThemes: formData.overallThemes.split(',').map(t => t.trim()).filter(t => t.length > 0)
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Series created successfully!');
        onSeriesCreated(data.data);
        setFormData({
          title: '',
          description: '',
          genre: 'General Fiction',
          type: 'fiction',
          totalPlannedBooks: 3,
          overallThemes: ''
        });
      } else {
        toast.error(data.error || 'Failed to create series');
      }
    } catch (error) {
      console.error('Error creating series:', error);
      toast.error('Failed to create series');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Book Series</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Series Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Series Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'fiction' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'fiction'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium text-gray-900">Fiction Series</h3>
                  <p className="text-sm text-gray-600">Multi-book fictional narrative with recurring characters and world</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'nonfiction' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'nonfiction'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium text-gray-900">Non-Fiction Series</h3>
                  <p className="text-sm text-gray-600">Related non-fiction books exploring different aspects of a subject</p>
                </div>
              </button>
            </div>
          </div>

          {/* Series Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Series Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your series title (e.g., 'The Chronicles of Magic')"
              required
            />
          </div>

          {/* Series Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Series Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe the overall story arc, themes, and what connects the books in your series..."
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Genre
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Planned Books */}
          <div>
            <label htmlFor="bookCount" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Planned Books
            </label>
            <input
              type="number"
              id="bookCount"
              value={formData.totalPlannedBooks}
              onChange={(e) => setFormData(prev => ({ ...prev, totalPlannedBooks: parseInt(e.target.value) || 2 }))}
              min="2"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              How many books do you plan for this series? (Minimum: 2, Maximum: 20)
            </p>
          </div>

          {/* Overall Themes */}
          <div>
            <label htmlFor="themes" className="block text-sm font-medium text-gray-700 mb-2">
              Overall Series Themes (Optional)
            </label>
            <input
              type="text"
              id="themes"
              value={formData.overallThemes}
              onChange={(e) => setFormData(prev => ({ ...prev, overallThemes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="good vs evil, coming of age, redemption (comma-separated)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the major themes that will run throughout your entire series
            </p>
          </div>

          {/* Series Planning Features Info */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">What you&apos;ll get with Series Management:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• AI-generated series-wide outline and character arcs</li>
              <li>• Comprehensive world bible for consistency</li>
              <li>• Character development across multiple books</li>
              <li>• Plot thread tracking and continuity checking</li>
              <li>• Timeline management and historical events</li>
              <li>• Book transition planning and cliffhanger suggestions</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Series...' : 'Create Series'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}