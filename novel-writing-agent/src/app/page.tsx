'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Book, FileText, Globe, CheckCircle, Clock, Layers } from 'lucide-react';
import { NovelProject, BookSeries } from '@/lib/types';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { SeriesCard } from '@/components/SeriesCard';
import { CreateSeriesModal } from '@/components/CreateSeriesModal';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [projects, setProjects] = useState<NovelProject[]>([]);
  const [series, setSeries] = useState<BookSeries[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateSeriesModalOpen, setIsCreateSeriesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'series'>('projects');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    await Promise.all([loadProjects(), loadSeries()]);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadSeries = async () => {
    try {
      const response = await fetch('/api/series');
      const data = await response.json();
      if (data.success) {
        setSeries(data.data);
      }
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (project: NovelProject) => {
    setProjects(prev => [...prev, project]);
    setIsCreateModalOpen(false);
  };

  const handleSeriesCreated = (newSeries: BookSeries) => {
    setSeries(prev => [...prev, newSeries]);
    setIsCreateSeriesModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your writing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Book className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Novel Writing Agent</h1>
                <p className="text-gray-600">AI-powered fiction and non-fiction writing assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Plagiarism Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Multi-language Translation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>AI Content Generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Book Series</p>
                <p className="text-2xl font-semibold text-gray-900">{series.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.status === 'complete').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.status === 'writing').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Words</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(projects.reduce((sum, p) => sum + p.currentWordCount, 0) + 
                    series.reduce((sum, s) => sum + s.books.reduce((bookSum, book) => bookSum + book.currentWordCount, 0), 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Book className="w-4 h-4" />
                  <span>Individual Projects ({projects.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('series')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'series'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Book Series ({series.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'projects' ? 'Your Writing Projects' : 'Your Book Series'}
          </h2>
          <div className="flex space-x-3">
            {activeTab === 'projects' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            )}
            {activeTab === 'series' && (
              <button
                onClick={() => setIsCreateSeriesModalOpen(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Series</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {activeTab === 'projects' ? (
          projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Book className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Start your writing journey by creating your first novel project.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  onUpdate={loadProjects}
                />
              ))}
            </div>
          )
        ) : (
          series.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-purple-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Layers className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No book series yet</h3>
              <p className="text-gray-600 mb-6">Create your first book series to manage multi-book projects with AI assistance.</p>
              <button
                onClick={() => setIsCreateSeriesModalOpen(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Series</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.map((seriesItem) => (
                <SeriesCard 
                  key={seriesItem.id} 
                  series={seriesItem}
                  onUpdate={loadSeries}
                />
              ))}
            </div>
          )
        )}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Create Series Modal */}
      <CreateSeriesModal
        isOpen={isCreateSeriesModalOpen}
        onClose={() => setIsCreateSeriesModalOpen(false)}
        onSeriesCreated={handleSeriesCreated}
      />
    </div>
  );
}
