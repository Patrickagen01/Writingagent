export interface NovelProject {
  id: string;
  title: string;
  description: string;
  genre: string;
  type: 'fiction' | 'nonfiction';
  targetWordCount: number;
  currentWordCount: number;
  status: 'planning' | 'writing' | 'editing' | 'complete';
  chapters: Chapter[];
  outline: string;
  characters: Character[];
  settings: Setting[];
  themes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: 'planned' | 'writing' | 'complete';
  summary: string;
  order: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  personality: string;
  background: string;
  goals: string;
  conflicts: string;
}

export interface Setting {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  importance: 'primary' | 'secondary' | 'minor';
}

export interface WritingProgress {
  projectId: string;
  totalWords: number;
  wordsToday: number;
  chaptersCompleted: number;
  totalChapters: number;
  estimatedCompletion: Date;
  writingStreak: number;
}

export interface TranslationRequest {
  id: string;
  projectId: string;
  sourceLanguage: string;
  targetLanguage: string;
  content: string;
  translatedContent?: string;
  status: 'pending' | 'translating' | 'complete' | 'error';
  createdAt: Date;
}

export interface PlagiarismCheck {
  id: string;
  content: string;
  status: 'checking' | 'clean' | 'potential_issues' | 'error';
  confidence: number;
  matches: PlagiarismMatch[];
}

export interface PlagiarismMatch {
  text: string;
  source: string;
  similarity: number;
  startIndex: number;
  endIndex: number;
}

export interface WritingSettings {
  model: 'gpt-4' | 'gpt-4-turbo' | 'claude-3-opus' | 'claude-3-sonnet';
  temperature: number;
  maxTokens: number;
  writingStyle: string;
  tone: string;
  pointOfView: '1st' | '2nd' | '3rd-limited' | '3rd-omniscient';
}

export interface AgentTask {
  id: string;
  type: 'generate_outline' | 'write_chapter' | 'develop_character' | 'translate' | 'plagiarism_check';
  status: 'pending' | 'running' | 'complete' | 'error';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}