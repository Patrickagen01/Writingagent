'use client';

import { useState } from 'react';
import { 
  Edit, 
  Brain, 
  Wand2, 
  CheckCircle, 
  FileText, 
  Play,
  Settings
} from 'lucide-react';
import { NovelProject, Chapter, WritingSettings } from '@/lib/types';
import toast from 'react-hot-toast';

interface ProjectWorkspaceProps {
  project: NovelProject;
  onUpdate: () => void;
}

export function ProjectWorkspace({ project, onUpdate }: ProjectWorkspaceProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [showWritingSettings, setShowWritingSettings] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterSummary, setNewChapterSummary] = useState('');
  const [writingSettings, setWritingSettings] = useState<WritingSettings>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4000,
    writingStyle: 'descriptive',
    tone: 'neutral',
    pointOfView: '3rd-limited'
  });

  const handleGenerateOutline = async () => {
    setIsGeneratingOutline(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/outline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: writingSettings }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Outline generated successfully!');
        onUpdate();
      } else {
        toast.error(data.error || 'Failed to generate outline');
      }
    } catch (error) {
      console.error('Error generating outline:', error);
      toast.error('Failed to generate outline');
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleWriteChapter = async () => {
    if (!newChapterTitle.trim()) {
      toast.error('Please enter a chapter title');
      return;
    }

    setIsWriting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newChapterTitle,
          summary: newChapterSummary,
          order: project.chapters.length + 1,
          settings: writingSettings
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Chapter written successfully!');
        setNewChapterTitle('');
        setNewChapterSummary('');
        onUpdate();
      } else {
        toast.error(data.error || 'Failed to write chapter');
      }
    } catch (error) {
      console.error('Error writing chapter:', error);
      toast.error('Failed to write chapter');
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Writing Tools Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Writing Workspace</h2>
          <button
            onClick={() => setShowWritingSettings(!showWritingSettings)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Writing Settings Panel */}
        {showWritingSettings && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">AI Writing Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                <select
                  value={writingSettings.model}
                  onChange={(e) => setWritingSettings(prev => ({ ...prev, model: e.target.value as WritingSettings['model'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Writing Style</label>
                <select
                  value={writingSettings.writingStyle}
                  onChange={(e) => setWritingSettings(prev => ({ ...prev, writingStyle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="descriptive">Descriptive</option>
                  <option value="concise">Concise</option>
                  <option value="lyrical">Lyrical</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={writingSettings.tone}
                  onChange={(e) => setWritingSettings(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="neutral">Neutral</option>
                  <option value="serious">Serious</option>
                  <option value="lighthearted">Lighthearted</option>
                  <option value="dark">Dark</option>
                  <option value="suspenseful">Suspenseful</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* AI Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleGenerateOutline}
            disabled={isGeneratingOutline}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Brain className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">
              {isGeneratingOutline ? 'Generating...' : 'Generate Outline'}
            </h3>
            <p className="text-sm text-gray-600">Create a detailed story outline</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
            <Wand2 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Enhance Text</h3>
            <p className="text-sm text-gray-600">Improve existing content</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
            <CheckCircle className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Check Originality</h3>
            <p className="text-sm text-gray-600">Plagiarism detection</p>
          </button>
        </div>
      </div>

      {/* Project Outline */}
      {project.outline && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Outline</h3>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{project.outline}</div>
          </div>
        </div>
      )}

      {/* Chapter Writing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Write New Chapter</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="chapterTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Chapter Title
            </label>
            <input
              type="text"
              id="chapterTitle"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter chapter title"
            />
          </div>
          
          <div>
            <label htmlFor="chapterSummary" className="block text-sm font-medium text-gray-700 mb-2">
              Chapter Summary (optional)
            </label>
            <textarea
              id="chapterSummary"
              value={newChapterSummary}
              onChange={(e) => setNewChapterSummary(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief summary of what happens in this chapter"
            />
          </div>
          
          <button
            onClick={handleWriteChapter}
            disabled={isWriting || !newChapterTitle.trim()}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWriting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Writing Chapter...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Write Chapter with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Chapters</h3>
          <span className="text-sm text-gray-600">{project.chapters.length} chapters</span>
        </div>
        
        {project.chapters.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No chapters yet</h4>
            <p className="text-gray-600">Use the AI writing tools above to create your first chapter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {project.chapters
              .sort((a, b) => a.order - b.order)
              .map((chapter) => (
                <div
                  key={chapter.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedChapter?.id === chapter.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                      <p className="text-sm text-gray-600">
                        {chapter.wordCount} words • Chapter {chapter.order} • {chapter.status}
                      </p>
                      {chapter.summary && (
                        <p className="text-sm text-gray-500 mt-1">{chapter.summary}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Chapter Content Viewer */}
      {selectedChapter && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{selectedChapter.title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedChapter.wordCount} words</span>
              <button className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-500">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {selectedChapter.content || 'No content yet. Click "Write Chapter with AI" to generate content.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}