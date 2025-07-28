import { v4 as uuidv4 } from 'uuid';
import { AIWritingService } from './ai-service';
import { PlagiarismDetectionService } from './plagiarism-service';
import { SeriesManagementService } from './series-service';
import { 
  NovelProject, 
  Chapter, 
  Character, 
  Setting, 
  WritingSettings, 
  AgentTask, 
  WritingProgress,
  TranslationRequest,
  BookSeries,
  SeriesCharacter,
  SeriesAnalytics,
  ContinuityNote,
  WorldBible,
  CharacterArcNode
} from './types';

export class NovelWritingAgent {
  private aiService: AIWritingService;
  private plagiarismService: PlagiarismDetectionService;
  private seriesService: SeriesManagementService;
  private tasks: Map<string, AgentTask> = new Map();
  private projects: Map<string, NovelProject> = new Map();
  private series: Map<string, BookSeries> = new Map();

  constructor(openaiApiKey: string, plagiarismApiKey?: string) {
    this.aiService = new AIWritingService(openaiApiKey);
    this.plagiarismService = new PlagiarismDetectionService(plagiarismApiKey);
    this.seriesService = new SeriesManagementService(openaiApiKey);
  }

  async createProject(projectData: Partial<NovelProject>): Promise<NovelProject> {
    const project: NovelProject = {
      id: uuidv4(),
      title: projectData.title || 'Untitled Novel',
      description: projectData.description || '',
      genre: projectData.genre || 'General Fiction',
      type: projectData.type || 'fiction',
      targetWordCount: projectData.targetWordCount || 80000,
      currentWordCount: 0,
      status: 'planning',
      chapters: [],
      outline: '',
      characters: [],
      settings: [],
      themes: projectData.themes || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.set(project.id, project);
    return project;
  }

  async generateProjectOutline(
    projectId: string, 
    settings: WritingSettings
  ): Promise<{ taskId: string; outline?: string }> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'generate_outline',
      status: 'pending',
      input: { projectId, settings },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';
      const outline = await this.aiService.generateOutline(project, settings);
      
      // Check for originality
      const originalityCheck = await this.plagiarismService.checkOriginality(outline);
      if (!originalityCheck.isOriginal) {
        throw new Error(`Outline may contain non-original content. Confidence: ${originalityCheck.confidence}`);
      }

      project.outline = outline;
      project.updatedAt = new Date();
      this.projects.set(projectId, project);

      task.status = 'complete';
      task.output = { outline, originalityCheck };
      task.completedAt = new Date();

      return { taskId, outline };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async writeChapter(
    projectId: string,
    chapterData: Partial<Chapter>,
    settings: WritingSettings
  ): Promise<{ taskId: string; chapter?: Chapter }> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'write_chapter',
      status: 'pending',
      input: { projectId, chapterData, settings },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';

      const chapter: Chapter = {
        id: chapterData.id || uuidv4(),
        title: chapterData.title || `Chapter ${project.chapters.length + 1}`,
        content: '',
        wordCount: 0,
        status: 'writing',
        summary: chapterData.summary || '',
        order: chapterData.order || project.chapters.length + 1
      };

      const content = await this.aiService.writeChapter(
        chapter,
        project,
        settings,
        project.chapters.filter(ch => ch.order < chapter.order)
      );

      // Check for plagiarism
      const plagiarismCheck = await this.plagiarismService.checkPlagiarism(content, taskId);
      if (plagiarismCheck.status === 'potential_issues' && plagiarismCheck.confidence < 0.7) {
        throw new Error('Generated content may contain plagiarized material');
      }

      chapter.content = content;
      chapter.wordCount = this.countWords(content);
      chapter.status = 'complete';

      // Update project
      const existingChapterIndex = project.chapters.findIndex(ch => ch.id === chapter.id);
      if (existingChapterIndex >= 0) {
        project.chapters[existingChapterIndex] = chapter;
      } else {
        project.chapters.push(chapter);
      }

      project.currentWordCount = project.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
      project.updatedAt = new Date();
      this.projects.set(projectId, project);

      task.status = 'complete';
      task.output = { chapter, plagiarismCheck };
      task.completedAt = new Date();

      return { taskId, chapter };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async developCharacter(
    projectId: string,
    characterData: Partial<Character>,
    settings: WritingSettings
  ): Promise<{ taskId: string; character?: Character }> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'develop_character',
      status: 'pending',
      input: { projectId, characterData, settings },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';

      const character = await this.aiService.developCharacter(
        {
          id: characterData.id || uuidv4(),
          name: characterData.name || 'Unnamed Character',
          ...characterData
        },
        project,
        settings
      );

      // Update project
      const existingCharacterIndex = project.characters.findIndex(ch => ch.id === character.id);
      if (existingCharacterIndex >= 0) {
        project.characters[existingCharacterIndex] = character;
      } else {
        project.characters.push(character);
      }

      project.updatedAt = new Date();
      this.projects.set(projectId, project);

      task.status = 'complete';
      task.output = { character };
      task.completedAt = new Date();

      return { taskId, character };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async translateContent(
    projectId: string,
    content: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<{ taskId: string; translationId?: string }> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const taskId = uuidv4();
    const translationId = uuidv4();

    const task: AgentTask = {
      id: taskId,
      type: 'translate',
      status: 'pending',
      input: { projectId, content, targetLanguage, sourceLanguage },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';

      const translatedContent = await this.aiService.translateText(
        content,
        targetLanguage,
        sourceLanguage
      );

      const translation: TranslationRequest = {
        id: translationId,
        projectId,
        sourceLanguage,
        targetLanguage,
        content,
        translatedContent,
        status: 'complete',
        createdAt: new Date()
      };

      task.status = 'complete';
      task.output = { translation };
      task.completedAt = new Date();

      return { taskId, translationId };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async getWritingProgress(projectId: string): Promise<WritingProgress> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const completedChapters = project.chapters.filter(ch => ch.status === 'complete').length;
    const averageWordsPerDay = 1000; // This would be calculated based on actual writing history
    const remainingWords = project.targetWordCount - project.currentWordCount;
    const estimatedDays = Math.ceil(remainingWords / averageWordsPerDay);
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedDays);

    return {
      projectId,
      totalWords: project.currentWordCount,
      wordsToday: 0, // This would be tracked in a real implementation
      chaptersCompleted: completedChapters,
      totalChapters: project.chapters.length,
      estimatedCompletion,
      writingStreak: 0 // This would be tracked in a real implementation
    };
  }

  async enhanceText(
    content: string,
    enhancement: 'grammar' | 'style' | 'flow' | 'dialogue',
    settings: WritingSettings
  ): Promise<string> {
    return await this.aiService.enhanceText(content, enhancement, settings);
  }

  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  getProject(projectId: string): NovelProject | undefined {
    return this.projects.get(projectId);
  }

  listProjects(): NovelProject[] {
    return Array.from(this.projects.values());
  }

  listTasks(projectId?: string): AgentTask[] {
    const tasks = Array.from(this.tasks.values());
    if (projectId) {
      return tasks.filter(task => 
        task.input && typeof task.input === 'object' && task.input.projectId === projectId
      );
    }
    return tasks;
  }

  async deleteProject(projectId: string): Promise<boolean> {
    const deleted = this.projects.delete(projectId);
    
    // Clean up related tasks
    const tasksToDelete = this.listTasks(projectId);
    tasksToDelete.forEach(task => this.tasks.delete(task.id));
    
    return deleted;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  async addSetting(projectId: string, setting: Partial<Setting>): Promise<Setting> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const newSetting: Setting = {
      id: setting.id || uuidv4(),
      name: setting.name || 'Unnamed Setting',
      description: setting.description || '',
      timeframe: setting.timeframe || 'Present day',
      importance: setting.importance || 'secondary'
    };

    project.settings.push(newSetting);
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return newSetting;
  }

  async updateProjectStatus(projectId: string, status: NovelProject['status']): Promise<void> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    project.status = status;
    project.updatedAt = new Date();
    this.projects.set(projectId, project);
  }

  // Series Management Methods

  async createBookSeries(seriesData: Partial<BookSeries>): Promise<BookSeries> {
    const series = await this.seriesService.createBookSeries(seriesData);
    this.series.set(series.id, series);
    return series;
  }

  async generateSeriesOutline(seriesId: string, settings: WritingSettings): Promise<{ taskId: string; outline?: Record<string, unknown> }> {
    const series = this.series.get(seriesId);
    if (!series) throw new Error('Series not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'generate_outline',
      status: 'pending',
      input: { seriesId, settings },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';
      const outline = await this.seriesService.generateSeriesOutline(series, settings);
      
      task.status = 'complete';
      task.output = { outline };
      task.completedAt = new Date();

      return { taskId, outline };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async developSeriesCharacter(
    seriesId: string,
    characterData: Partial<SeriesCharacter>,
    settings: WritingSettings
  ): Promise<{ taskId: string; characterArc?: CharacterArcNode[] }> {
    const series = this.series.get(seriesId);
    if (!series) throw new Error('Series not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'develop_character',
      status: 'pending',
      input: { seriesId, characterData, settings },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';

      const character: SeriesCharacter = {
        id: characterData.id || uuidv4(),
        name: characterData.name || 'Unnamed Character',
        aliases: characterData.aliases || [],
        description: characterData.description || '',
        role: characterData.role || 'supporting',
        personality: characterData.personality || '',
        background: characterData.background || '',
        physicalDescription: characterData.physicalDescription || '',
        goals: characterData.goals || '',
        conflicts: characterData.conflicts || '',
        relationships: characterData.relationships || [],
        characterArc: [],
        appearances: characterData.appearances || [],
        development: characterData.development || [],
        secrets: characterData.secrets || [],
        abilities: characterData.abilities || [],
        weaknesses: characterData.weaknesses || []
      };

      const characterArc = await this.seriesService.developSeriesCharacterArc(character, series, settings);

      // Update series with character
      character.characterArc = characterArc;
      const existingCharacterIndex = series.seriesCharacters.findIndex(ch => ch.id === character.id);
      if (existingCharacterIndex >= 0) {
        series.seriesCharacters[existingCharacterIndex] = character;
      } else {
        series.seriesCharacters.push(character);
      }

      series.updatedAt = new Date();
      this.series.set(seriesId, series);

      task.status = 'complete';
      task.output = { character, characterArc };
      task.completedAt = new Date();

      return { taskId, characterArc };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async checkSeriesContinuity(seriesId: string, focusAreas?: string[]): Promise<{ taskId: string; continuityReport?: ContinuityNote[] }> {
    const series = this.series.get(seriesId);
    if (!series) throw new Error('Series not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'plagiarism_check', // Reusing for continuity check
      status: 'pending',
      input: { seriesId, focusAreas },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';
      const continuityReport = await this.seriesService.checkSeriesContinuity(series, focusAreas);
      
      // Update series with continuity notes
      series.continuityNotes = continuityReport;
      series.updatedAt = new Date();
      this.series.set(seriesId, series);

      task.status = 'complete';
      task.output = { continuityReport };
      task.completedAt = new Date();

      return { taskId, continuityReport };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async expandSeriesWorldBible(
    seriesId: string,
    categories: string[],
    settings: WritingSettings
  ): Promise<{ taskId: string; worldBible?: WorldBible }> {
    const series = this.series.get(seriesId);
    if (!series) throw new Error('Series not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'generate_outline', // Reusing for world bible expansion
      status: 'pending',
      input: { seriesId, categories, settings },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';
      const expandedWorldBible = await this.seriesService.expandWorldBible(
        series.worldBible,
        series,
        categories,
        settings
      );
      
      // Update series with expanded world bible
      series.worldBible = expandedWorldBible;
      series.updatedAt = new Date();
      this.series.set(seriesId, series);

      task.status = 'complete';
      task.output = { worldBible: expandedWorldBible };
      task.completedAt = new Date();

      return { taskId, worldBible: expandedWorldBible };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async planBookTransition(
    seriesId: string,
    fromBook: number,
    toBook: number,
    settings: WritingSettings
  ): Promise<{ taskId: string; transitionPlan?: Record<string, unknown> }> {
    const series = this.series.get(seriesId);
    if (!series) throw new Error('Series not found');

    const taskId = uuidv4();
    const task: AgentTask = {
      id: taskId,
      type: 'generate_outline',
      status: 'pending',
      input: { seriesId, fromBook, toBook, settings },
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);

    try {
      task.status = 'running';
      const transitionPlan = await this.seriesService.planBookTransition(series, fromBook, toBook, settings);

      task.status = 'complete';
      task.output = { transitionPlan };
      task.completedAt = new Date();

      return { taskId, transitionPlan };
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async addBookToSeries(seriesId: string, projectData: Partial<NovelProject>): Promise<NovelProject> {
    const series = this.series.get(seriesId);
    if (!series) throw new Error('Series not found');

    // Create project with series context
    const project = await this.createProject({
      ...projectData,
      title: projectData.title || `${series.title} - Book ${series.currentBookCount + 1}`,
      genre: projectData.genre || series.genre,
      type: projectData.type || series.type
    });

    // Link project to series
    series.books.push(project);
    series.currentBookCount = series.books.length;
    series.updatedAt = new Date();
    this.series.set(seriesId, series);

    return project;
  }

  async getSeriesAnalytics(seriesId: string): Promise<SeriesAnalytics> {
    const series = this.series.get(seriesId);
    if (!series) throw new Error('Series not found');

    return await this.seriesService.generateSeriesAnalytics(series);
  }

  getSeries(seriesId: string): BookSeries | undefined {
    return this.series.get(seriesId);
  }

  listSeries(): BookSeries[] {
    return Array.from(this.series.values());
  }

  async deleteSeries(seriesId: string): Promise<boolean> {
    const series = this.series.get(seriesId);
    if (!series) return false;

    // Delete all books in the series
    for (const book of series.books) {
      await this.deleteProject(book.id);
    }

    // Delete series tasks
    const seriesToDelete = this.listTasks().filter(task => 
      task.input && typeof task.input === 'object' && 
      'seriesId' in task.input && task.input.seriesId === seriesId
    );
    seriesToDelete.forEach(task => this.tasks.delete(task.id));

    return this.series.delete(seriesId);
  }
}