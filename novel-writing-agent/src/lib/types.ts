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

export interface BookSeries {
  id: string;
  title: string;
  description: string;
  genre: string;
  type: 'fiction' | 'nonfiction';
  status: 'planning' | 'writing' | 'publishing' | 'complete';
  totalPlannedBooks: number;
  currentBookCount: number;
  overallThemes: string[];
  worldBible: WorldBible;
  seriesTimeline: SeriesTimeline[];
  books: NovelProject[];
  seriesCharacters: SeriesCharacter[];
  continuityNotes: ContinuityNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorldBible {
  id: string;
  seriesId: string;
  locations: WorldLocation[];
  cultures: Culture[];
  technologies: Technology[];
  magicSystems: MagicSystem[];
  politicalSystems: PoliticalSystem[];
  religions: Religion[];
  languages: Language[];
  timeline: HistoricalEvent[];
  rules: WorldRule[];
}

export interface WorldLocation {
  id: string;
  name: string;
  type: 'city' | 'country' | 'continent' | 'planet' | 'dimension' | 'building' | 'landmark';
  description: string;
  geography: string;
  climate: string;
  population: number;
  government: string;
  economy: string;
  culture: string;
  history: string;
  notableFeatures: string[];
  connectedLocations: string[];
  firstAppearance: string; // Book and chapter
  importance: 'major' | 'minor' | 'background';
}

export interface SeriesCharacter {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor' | 'recurring';
  personality: string;
  background: string;
  physicalDescription: string;
  goals: string;
  conflicts: string;
  relationships: CharacterRelationship[];
  characterArc: CharacterArcNode[];
  appearances: BookAppearance[];
  development: CharacterDevelopment[];
  secrets: string[];
  abilities: string[];
  weaknesses: string[];
}

export interface CharacterRelationship {
  characterId: string;
  relationshipType: 'family' | 'friend' | 'enemy' | 'romantic' | 'mentor' | 'rival' | 'ally';
  description: string;
  development: RelationshipDevelopment[];
}

export interface CharacterArcNode {
  bookNumber: number;
  chapterRange: string;
  arcType: 'introduction' | 'development' | 'climax' | 'resolution' | 'transformation';
  description: string;
  emotionalState: string;
  goals: string;
  conflicts: string;
}

export interface BookAppearance {
  bookId: string;
  bookNumber: number;
  role: 'main' | 'supporting' | 'cameo' | 'mentioned';
  introductionChapter?: string;
  lastAppearance?: string;
  screenTime: 'major' | 'moderate' | 'minor';
}

export interface SeriesTimeline {
  id: string;
  title: string;
  date: string; // In-universe date
  description: string;
  type: 'historical' | 'character' | 'plot' | 'world';
  importance: 'critical' | 'major' | 'minor';
  affectedBooks: number[];
  affectedCharacters: string[];
  consequences: string[];
}

export interface ContinuityNote {
  id: string;
  type: 'plot' | 'character' | 'world' | 'timeline' | 'technology';
  title: string;
  description: string;
  establishedInBook: number;
  referencedInBooks: number[];
  conflicts: ContinuityConflict[];
  resolution?: string;
  status: 'consistent' | 'needs_review' | 'conflicted' | 'resolved';
}

export interface ContinuityConflict {
  bookNumber: number;
  chapter: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  suggestedResolution: string;
}

export interface Culture {
  id: string;
  name: string;
  description: string;
  values: string[];
  traditions: string[];
  socialStructure: string;
  technology: string;
  conflicts: string[];
  alliances: string[];
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  type: 'transportation' | 'communication' | 'weapon' | 'medical' | 'industrial' | 'domestic';
  developmentLevel: string;
  limitations: string[];
  impact: string;
}

export interface MagicSystem {
  id: string;
  name: string;
  description: string;
  rules: string[];
  limitations: string[];
  costs: string[];
  practitioners: string[];
  culturalImpact: string;
}

export interface PoliticalSystem {
  id: string;
  name: string;
  type: 'monarchy' | 'democracy' | 'oligarchy' | 'theocracy' | 'anarchy' | 'federation' | 'empire';
  description: string;
  leaders: string[];
  structure: string;
  laws: string[];
  relationships: string[];
}

export interface Religion {
  id: string;
  name: string;
  description: string;
  beliefs: string[];
  practices: string[];
  hierarchy: string;
  followers: string[];
  influence: string;
  conflicts: string[];
}

export interface Language {
  id: string;
  name: string;
  type: 'spoken' | 'written' | 'sign' | 'telepathic';
  speakers: string[];
  script: string;
  grammar: string;
  vocabulary: LanguageVocabulary[];
  culturalSignificance: string;
}

export interface LanguageVocabulary {
  word: string;
  translation: string;
  partOfSpeech: string;
  context: string;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  participants: string[];
  consequences: string[];
  impact: 'local' | 'regional' | 'global' | 'universal';
  referencedInBooks: number[];
}

export interface WorldRule {
  id: string;
  category: 'physics' | 'magic' | 'social' | 'economic' | 'political' | 'biological';
  rule: string;
  description: string;
  exceptions: string[];
  establishedInBook: number;
  importance: 'fundamental' | 'important' | 'minor';
}

export interface CharacterDevelopment {
  bookNumber: number;
  development: string;
  skills: string[];
  personalityChanges: string[];
  relationships: string[];
  goals: string[];
}

export interface RelationshipDevelopment {
  bookNumber: number;
  status: string;
  development: string;
  conflicts: string[];
  resolutions: string[];
}

export interface SeriesPlotThread {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'subplot' | 'character' | 'mystery' | 'romance' | 'political';
  status: 'introduced' | 'developing' | 'climax' | 'resolved' | 'abandoned';
  introducedInBook: number;
  resolvedInBook?: number;
  affectedCharacters: string[];
  plotPoints: PlotPoint[];
  importance: 'critical' | 'major' | 'minor';
}

export interface PlotPoint {
  bookNumber: number;
  chapter: string;
  description: string;
  type: 'introduction' | 'development' | 'twist' | 'climax' | 'resolution';
  impact: string;
}

export interface SeriesAnalytics {
  seriesId: string;
  totalWords: number;
  averageBookLength: number;
  charactersIntroduced: number;
  plotThreadsActive: number;
  plotThreadsResolved: number;
  worldLocations: number;
  timelineEvents: number;
  continuityIssues: number;
  completionPercentage: number;
  estimatedSeriesCompletion: Date;
  writingVelocity: number; // words per day
}

export interface SeriesWritingTask extends AgentTask {
  seriesId?: string;
  bookNumber?: number;
  taskSpecifics: {
    generateSeriesOutline?: boolean;
    developCharacterArc?: {
      characterId: string;
      acrossBooks: number[];
    };
    checkContinuity?: {
      focusAreas: string[];
    };
    expandWorldBible?: {
      categories: string[];
    };
    planBookTransition?: {
      fromBook: number;
      toBook: number;
    };
  };
}