'use client';

import { useState } from 'react';
import { Clock, FileText, Users, Globe, Edit, Trash2, Play } from 'lucide-react';
import { NovelProject } from '@/lib/types';
import Link from 'next/link';

interface ProjectCardProps {
  project: NovelProject;
  onUpdate: () => void;
}

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'writing': return 'bg-blue-100 text-blue-800';
      case 'editing': return 'bg-orange-100 text-orange-800';
      case 'complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgress = () => {
    if (project.targetWordCount === 0) return 0;
    return Math.min((project.currentWordCount / project.targetWordCount) * 100, 100);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {project.type === 'fiction' ? 'Fiction' : 'Non-Fiction'}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{project.genre}</p>
            <p className="text-gray-700 text-sm line-clamp-2">{project.description}</p>
          </div>
          
          <div className="flex space-x-1 ml-4">
            <Link href={`/project/${project.id}`}>
              <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
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

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{project.currentWordCount.toLocaleString()} / {project.targetWordCount.toLocaleString()} words</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{getProgress().toFixed(1)}% complete</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">{project.chapters.length}</p>
            <p className="text-xs text-gray-500">Chapters</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">{project.characters.length}</p>
            <p className="text-xs text-gray-500">Characters</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              {Math.ceil((new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-xs text-gray-500">Days old</p>
          </div>
        </div>

        {/* Themes */}
        {project.themes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Themes</p>
            <div className="flex flex-wrap gap-1">
              {project.themes.slice(0, 3).map((theme, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {theme}
                </span>
              ))}
              {project.themes.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{project.themes.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href={`/project/${project.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              <Play className="w-4 h-4" />
              <span>Continue Writing</span>
            </button>
          </Link>
          
          <button className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}