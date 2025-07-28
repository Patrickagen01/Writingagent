'use client';

import { useState } from 'react';
import { X, Book, FileText } from 'lucide-react';
import { NovelProject } from '@/lib/types';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: NovelProject) => void;
}

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'General Fiction',
    type: 'fiction' as 'fiction' | 'nonfiction',
    targetWordCount: 80000,
    themes: ''
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
      toast.error('Please enter a project title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          themes: formData.themes.split(',').map(t => t.trim()).filter(t => t.length > 0)
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Project created successfully!');
        onProjectCreated(data.data);
        setFormData({
          title: '',
          description: '',
          genre: 'General Fiction',
          type: 'fiction',
          targetWordCount: 80000,
          themes: ''
        });
      } else {
        toast.error(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
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
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Book className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
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
          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Project Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'fiction' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'fiction'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Book className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                  <h3 className="font-medium text-gray-900">Fiction</h3>
                  <p className="text-sm text-gray-600">Creative storytelling with imaginary characters and events</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'nonfiction' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'nonfiction'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                  <h3 className="font-medium text-gray-900">Non-Fiction</h3>
                  <p className="text-sm text-gray-600">Factual content based on real events and information</p>
                </div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your novel's title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your novel's plot, theme, or main idea..."
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Target Word Count */}
          <div>
            <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 mb-2">
              Target Word Count
            </label>
            <input
              type="number"
              id="wordCount"
              value={formData.targetWordCount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetWordCount: parseInt(e.target.value) || 0 }))}
              min="1000"
              max="500000"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="80000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Typical novel lengths: Short novel (40k-60k), Standard novel (70k-100k), Epic novel (100k+)
            </p>
          </div>

          {/* Themes */}
          <div>
            <label htmlFor="themes" className="block text-sm font-medium text-gray-700 mb-2">
              Themes (Optional)
            </label>
            <input
              type="text"
              id="themes"
              value={formData.themes}
              onChange={(e) => setFormData(prev => ({ ...prev, themes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="love, redemption, coming of age (comma-separated)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter themes separated by commas (e.g., &quot;love, betrayal, redemption&quot;)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}