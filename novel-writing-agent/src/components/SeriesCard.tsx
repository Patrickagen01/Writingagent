'use client';

import { useState } from 'react';
import { Layers, BookOpen, Users, Globe, Edit, Trash2, Target, Calendar } from 'lucide-react';
import { BookSeries } from '@/lib/types';
import Link from 'next/link';

interface SeriesCardProps {
  series: BookSeries;
  onUpdate: () => void;
}

export function SeriesCard({ series, onUpdate }: SeriesCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'writing': return 'bg-blue-100 text-blue-800';
      case 'publishing': return 'bg-orange-100 text-orange-800';
      case 'complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgress = () => {
    if (series.totalPlannedBooks === 0) return 0;
    return Math.min((series.currentBookCount / series.totalPlannedBooks) * 100, 100);
  };

  const getTotalWords = () => {
    return series.books.reduce((sum, book) => sum + book.currentWordCount, 0);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the series "${series.title}"? This will also delete all books in the series. This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/series/${series.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting series:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-purple-500">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(series.status)}`}>
                {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {series.type === 'fiction' ? 'Fiction Series' : 'Non-Fiction Series'}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {series.totalPlannedBooks} Books Planned
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{series.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{series.genre}</p>
            <p className="text-gray-700 text-sm line-clamp-2">{series.description}</p>
          </div>
          
          <div className="flex space-x-1 ml-4">
            <Link href={`/series/${series.id}`}>
              <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </Link>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Series Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Series Progress</span>
            <span>{series.currentBookCount} / {series.totalPlannedBooks} books</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{getProgress().toFixed(1)}% complete</p>
        </div>

        {/* Series Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">{series.books.length}</p>
            <p className="text-xs text-gray-500">Books Written</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">{series.seriesCharacters.length}</p>
            <p className="text-xs text-gray-500">Characters</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">{series.worldBible.locations.length}</p>
            <p className="text-xs text-gray-500">Locations</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">{series.seriesTimeline.length}</p>
            <p className="text-xs text-gray-500">Timeline Events</p>
          </div>
        </div>

        {/* Word Count */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Words Written:</span>
            <span className="text-sm font-bold text-gray-900">{getTotalWords().toLocaleString()}</span>
          </div>
          {series.books.length > 0 && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">Average per book:</span>
              <span className="text-xs text-gray-600">{Math.round(getTotalWords() / series.books.length).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Themes */}
        {series.overallThemes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Series Themes</p>
            <div className="flex flex-wrap gap-1">
              {series.overallThemes.slice(0, 3).map((theme, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                  {theme}
                </span>
              ))}
              {series.overallThemes.length > 3 && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                  +{series.overallThemes.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Recent Books */}
        {series.books.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Recent Books</p>
            <div className="space-y-2">
              {series.books.slice(-2).map((book) => (
                <div key={book.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.currentWordCount.toLocaleString()} words</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(book.status)}`}>
                    {book.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continuity Issues */}
        {series.continuityNotes.length > 0 && (
          <div className="mb-4 p-2 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-xs font-medium text-yellow-800">
              {series.continuityNotes.filter(note => note.status === 'conflicted' || note.status === 'needs_review').length} continuity issues need attention
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href={`/series/${series.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
              <Layers className="w-4 h-4" />
              <span>Manage Series</span>
            </button>
          </Link>
          
          <button className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
            <Globe className="w-4 h-4" />
          </button>
        </div>

        {/* Creation Date */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Created {new Date(series.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}