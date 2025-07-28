'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Book, 
  FileText, 
  Users, 
  Settings, 
  Globe, 
  CheckCircle, 
  Plus,
  Brain,
  Wand2,
  ArrowLeft
} from 'lucide-react';
import { NovelProject } from '@/lib/types';
import { ProjectWorkspace } from '@/components/ProjectWorkspace';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<NovelProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'writing' | 'characters' | 'settings' | 'translate'>('overview');

  const loadProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();
      
      if (data.success) {
        setProject(data.data);
      } else {
        console.error('Project not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const getProgress = () => {
    if (!project || project.targetWordCount === 0) return 0;
    return Math.min((project.currentWordCount / project.targetWordCount) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'writing': return 'bg-blue-100 text-blue-800';
      case 'editing': return 'bg-orange-100 text-orange-800';
      case 'complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Book className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600">{project.genre}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {project.currentWordCount.toLocaleString()} / {project.targetWordCount.toLocaleString()} words
                </p>
                <p className="text-xs text-gray-500">{getProgress().toFixed(1)}% complete</p>
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Book },
              { id: 'writing', label: 'Writing', icon: FileText },
              { id: 'characters', label: 'Characters', icon: Users },
              { id: 'settings', label: 'World Building', icon: Settings },
              { id: 'translate', label: 'Translation', icon: Globe }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'writing' | 'characters' | 'settings' | 'translate')}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Project Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{project.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Type:</dt>
                      <dd className="font-medium">{project.type === 'fiction' ? 'Fiction' : 'Non-Fiction'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Genre:</dt>
                      <dd className="font-medium">{project.genre}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Chapters:</dt>
                      <dd className="font-medium">{project.chapters.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Characters:</dt>
                      <dd className="font-medium">{project.characters.length}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* AI Tools */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Writing Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <Brain className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Generate Outline</h3>
                  <p className="text-sm text-gray-600">Create a detailed story outline</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <Wand2 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Write Chapter</h3>
                  <p className="text-sm text-gray-600">AI-assisted chapter writing</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <CheckCircle className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Check Originality</h3>
                  <p className="text-sm text-gray-600">Plagiarism detection</p>
                </button>
              </div>
            </div>

            {/* Recent Chapters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Chapters</h2>
                <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500">
                  <Plus className="w-4 h-4" />
                  <span>Add Chapter</span>
                </button>
              </div>
              
              {project.chapters.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters yet</h3>
                  <p className="text-gray-600 mb-4">Start writing your first chapter</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Create First Chapter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.chapters.slice(0, 5).map((chapter) => (
                    <div key={chapter.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                        <p className="text-sm text-gray-600">{chapter.wordCount} words • {chapter.status}</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-500">Edit</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'writing' && (
          <ProjectWorkspace project={project} onUpdate={loadProject} />
        )}

        {activeTab === 'characters' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Characters</h2>
              <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
                <span>Add Character</span>
              </button>
            </div>
            
            {project.characters.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No characters yet</h3>
                <p className="text-gray-600">Create your first character to start building your story world.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.characters.map((character) => (
                  <div key={character.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{character.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{character.role}</p>
                    <p className="text-gray-700 text-sm line-clamp-3">{character.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">World Building</h2>
              <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
                <span>Add Setting</span>
              </button>
            </div>
            
            {project.settings.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No settings yet</h3>
                <p className="text-gray-600">Create locations and environments for your story.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {project.settings.map((setting) => (
                  <div key={setting.id} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-2">{setting.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{setting.timeframe}</p>
                    <p className="text-gray-700">{setting.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'translate' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Translation</h2>
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Translation Feature</h3>
              <p className="text-gray-600">Translate your novel into multiple languages with AI assistance.</p>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Start Translation
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}