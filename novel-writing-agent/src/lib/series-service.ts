import { v4 as uuidv4 } from 'uuid';
import { AIWritingService } from './ai-service';
import { 
  BookSeries, 
  SeriesCharacter, 
  WorldBible, 
  SeriesTimeline, 
  ContinuityNote, 
  SeriesPlotThread,
  SeriesAnalytics,
  WritingSettings,
  CharacterArcNode,
  WorldRule
} from './types';

export class SeriesManagementService {
  private aiService: AIWritingService;

  constructor(openaiApiKey: string) {
    this.aiService = new AIWritingService(openaiApiKey);
  }

  async createBookSeries(seriesData: Partial<BookSeries>): Promise<BookSeries> {
    const series: BookSeries = {
      id: uuidv4(),
      title: seriesData.title || 'Untitled Series',
      description: seriesData.description || '',
      genre: seriesData.genre || 'General Fiction',
      type: seriesData.type || 'fiction',
      status: 'planning',
      totalPlannedBooks: seriesData.totalPlannedBooks || 3,
      currentBookCount: 0,
      overallThemes: seriesData.overallThemes || [],
      worldBible: this.createInitialWorldBible(seriesData.id || uuidv4()),
      seriesTimeline: [],
      books: [],
      seriesCharacters: [],
      continuityNotes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return series;
  }

  async generateSeriesOutline(
    series: BookSeries, 
    settings: WritingSettings
  ): Promise<{
    seriesOverview: string;
    bookOutlines: string[];
    characterArcs: string[];
    worldBuilding: string;
    plotThreads: SeriesPlotThread[];
  }> {
    try {
      const response = await this.aiService.generateOutline(series, settings);
      
      // Parse the response to extract different components
      const parsed = await this.parseSeriesOutline(response, series);
      
      return parsed;
    } catch (error) {
      console.error('Error generating series outline:', error);
      throw new Error('Failed to generate series outline');
    }
  }

  async developSeriesCharacterArc(
    character: SeriesCharacter,
    series: BookSeries,
    settings: WritingSettings
  ): Promise<CharacterArcNode[]> {
    try {
      
      // Generate character arc across multiple books
      const arcNodes: CharacterArcNode[] = [];
      
      for (let bookNum = 1; bookNum <= series.totalPlannedBooks; bookNum++) {
        const arcPrompt = `Develop the character arc for ${character.name} in Book ${bookNum} of ${series.totalPlannedBooks} in the series "${series.title}".
        
        Character background: ${character.background}
        Overall series themes: ${series.overallThemes.join(', ')}
        Character role: ${character.role}
        
        Focus on:
        1. Character's goals and motivations in this book
        2. Key conflicts and challenges
        3. Character growth and development
        4. Relationships with other characters
        5. Emotional journey and transformation
        
        Provide a detailed character arc for this specific book while maintaining series continuity.`;

        const bookArc = await this.generateCharacterBookArc(arcPrompt, settings);
        
        arcNodes.push({
          bookNumber: bookNum,
          chapterRange: `1-${Math.ceil(80000 / 3000)}`, // Estimate chapters
          arcType: this.determineArcType(bookNum, series.totalPlannedBooks),
          description: bookArc.description,
          emotionalState: bookArc.emotionalState,
          goals: bookArc.goals,
          conflicts: bookArc.conflicts
        });
      }
      
      return arcNodes;
    } catch (error) {
      console.error('Error developing character arc:', error);
      throw new Error('Failed to develop character arc');
    }
  }

  async checkSeriesContinuity(
    series: BookSeries,
    focusAreas: string[] = ['plot', 'character', 'world', 'timeline']
  ): Promise<ContinuityNote[]> {
    const continuityIssues: ContinuityNote[] = [];
    
    // Check character consistency across books
    if (focusAreas.includes('character')) {
      for (const character of series.seriesCharacters) {
        const characterIssues = await this.checkCharacterContinuity(character, series);
        continuityIssues.push(...characterIssues);
      }
    }
    
    // Check world consistency
    if (focusAreas.includes('world')) {
      const worldIssues = await this.checkWorldContinuity(series.worldBible, series);
      continuityIssues.push(...worldIssues);
    }
    
    // Check timeline consistency
    if (focusAreas.includes('timeline')) {
      const timelineIssues = await this.checkTimelineContinuity(series.seriesTimeline, series);
      continuityIssues.push(...timelineIssues);
    }
    
    // Check plot thread consistency
    if (focusAreas.includes('plot')) {
      const plotIssues = await this.checkPlotContinuity(series);
      continuityIssues.push(...plotIssues);
    }
    
    return continuityIssues;
  }

  async expandWorldBible(
    worldBible: WorldBible,
    series: BookSeries,
    categories: string[],
    settings: WritingSettings
  ): Promise<WorldBible> {
    const updatedWorldBible = { ...worldBible };
    
    for (const category of categories) {
      try {
        const expansion = await this.generateWorldBibleContent(
          this.buildWorldBiblePrompt(category, series, worldBible, settings), 
          settings
        );
        
        switch (category) {
          case 'locations':
            updatedWorldBible.locations.push(...(expansion.locations as never[]));
            break;
          case 'cultures':
            updatedWorldBible.cultures.push(...(expansion.cultures as never[]));
            break;
          case 'technologies':
            updatedWorldBible.technologies.push(...(expansion.technologies as never[]));
            break;
          case 'magicSystems':
            updatedWorldBible.magicSystems.push(...(expansion.magicSystems as never[]));
            break;
          case 'religions':
            updatedWorldBible.religions.push(...(expansion.religions as never[]));
            break;
          case 'languages':
            updatedWorldBible.languages.push(...(expansion.languages as never[]));
            break;
          case 'timeline':
            updatedWorldBible.timeline.push(...(expansion.historicalEvents as never[]));
            break;
        }
      } catch (error) {
        console.error(`Error expanding ${category}:`, error);
      }
    }
    
    return updatedWorldBible;
  }

  async planBookTransition(
    series: BookSeries,
    fromBook: number,
    toBook: number,
    settings: WritingSettings
  ): Promise<{
    cliffhangers: string[];
    characterTransitions: string[];
    plotAdvancement: string[];
    worldProgression: string[];
    continuityChecks: string[];
  }> {
    const prompt = `Plan the transition from Book ${fromBook} to Book ${toBook} in the series "${series.title}".
    
    Series overview: ${series.description}
    Total planned books: ${series.totalPlannedBooks}
    Series themes: ${series.overallThemes.join(', ')}
    
    Provide detailed planning for:
    1. Cliffhangers and hooks to end Book ${fromBook}
    2. Character state transitions between books
    3. Plot advancement and new conflicts for Book ${toBook}
    4. World progression and changes
    5. Continuity elements to maintain
    
    Ensure smooth narrative flow and reader engagement.`;
    
    try {
      const response = await this.generateTransitionPlan(prompt, settings);
      return response;
    } catch (error) {
      console.error('Error planning book transition:', error);
      throw new Error('Failed to plan book transition');
    }
  }

  async generateSeriesAnalytics(series: BookSeries): Promise<SeriesAnalytics> {
    const totalWords = series.books.reduce((sum, book) => sum + book.currentWordCount, 0);
    const averageBookLength = series.books.length > 0 ? totalWords / series.books.length : 0;
    const charactersIntroduced = series.seriesCharacters.length;
    
    // Count active and resolved plot threads
    const plotThreads = await this.getSeriesPlotThreads(series);
    const activeThreads = plotThreads.filter(thread => 
      thread.status === 'introduced' || thread.status === 'developing'
    ).length;
    const resolvedThreads = plotThreads.filter(thread => 
      thread.status === 'resolved'
    ).length;
    
    const continuityIssues = series.continuityNotes.filter(note => 
      note.status === 'conflicted' || note.status === 'needs_review'
    ).length;
    
    const completionPercentage = (series.currentBookCount / series.totalPlannedBooks) * 100;
    
    // Estimate completion date based on writing velocity
    const writingVelocity = this.calculateWritingVelocity(series);
    const remainingWords = (series.totalPlannedBooks - series.currentBookCount) * 80000; // Estimated words per book
    const daysToComplete = writingVelocity > 0 ? remainingWords / writingVelocity : 365;
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + daysToComplete);
    
    return {
      seriesId: series.id,
      totalWords,
      averageBookLength,
      charactersIntroduced,
      plotThreadsActive: activeThreads,
      plotThreadsResolved: resolvedThreads,
      worldLocations: series.worldBible.locations.length,
      timelineEvents: series.seriesTimeline.length,
      continuityIssues,
      completionPercentage,
      estimatedSeriesCompletion: estimatedCompletion,
      writingVelocity
    };
  }

  // Helper methods

  private createInitialWorldBible(seriesId: string): WorldBible {
    return {
      id: uuidv4(),
      seriesId,
      locations: [],
      cultures: [],
      technologies: [],
      magicSystems: [],
      politicalSystems: [],
      religions: [],
      languages: [],
      timeline: [],
      rules: []
    };
  }

  private buildSeriesOutlinePrompt(series: BookSeries, settings: WritingSettings): string {
    return `Create a comprehensive series outline for "${series.title}", a ${series.totalPlannedBooks}-book ${series.type} series.

Series Details:
- Genre: ${series.genre}
- Description: ${series.description}
- Themes: ${series.overallThemes.join(', ')}
- Writing Style: ${settings.writingStyle}
- Tone: ${settings.tone}

Create:
1. Overall series arc and progression
2. Individual book outlines with unique conflicts and resolutions
3. Character development across the entire series
4. World-building elements and progression
5. Major plot threads that span multiple books
6. Series climax and resolution

Ensure each book can stand alone while contributing to the larger narrative.`;
  }

  private buildCharacterArcPrompt(character: SeriesCharacter, series: BookSeries, settings: WritingSettings): string {
    return `Develop a comprehensive character arc for ${character.name} across the ${series.totalPlannedBooks}-book series "${series.title}".

Character Details:
- Role: ${character.role}
- Background: ${character.background}
- Goals: ${character.goals}
- Conflicts: ${character.conflicts}

Series Context:
- Genre: ${series.genre}
- Themes: ${series.overallThemes.join(', ')}
- Overall story: ${series.description}

Create a detailed character journey showing:
1. Growth and development across all books
2. Changing relationships and dynamics
3. Evolving goals and motivations
4. Internal and external conflicts
5. Transformation and resolution`;
  }

  private determineArcType(bookNumber: number, totalBooks: number): CharacterArcNode['arcType'] {
    if (bookNumber === 1) return 'introduction';
    if (bookNumber === totalBooks) return 'resolution';
    if (bookNumber === Math.ceil(totalBooks * 0.75)) return 'climax';
    return 'development';
  }

  private async generateCharacterBookArc(prompt: string, settings: WritingSettings): Promise<{
    description: string;
    emotionalState: string;
    goals: string;
    conflicts: string;
  }> {
    // Simplified implementation - in production, use AI to generate detailed arc
    return {
      description: 'Character development for this book',
      emotionalState: 'Determined but conflicted',
      goals: 'Achieve personal growth while helping others',
      conflicts: 'Internal doubts vs external challenges'
    };
  }

  private async checkCharacterContinuity(character: SeriesCharacter, series: BookSeries): Promise<ContinuityNote[]> {
    const issues: ContinuityNote[] = [];
    
    // Check for consistency in character traits across appearances
    for (const appearance of character.appearances) {
      // Simplified check - in production, use AI to analyze consistency
      if (appearance.role !== character.role && appearance.role !== 'cameo') {
        issues.push({
          id: uuidv4(),
          type: 'character',
          title: `Role inconsistency for ${character.name}`,
          description: `Character role changes from ${character.role} to ${appearance.role} in book ${appearance.bookNumber}`,
          establishedInBook: 1,
          referencedInBooks: [appearance.bookNumber],
          conflicts: [],
          status: 'needs_review'
        });
      }
    }
    
    return issues;
  }

  private async checkWorldContinuity(worldBible: WorldBible, series: BookSeries): Promise<ContinuityNote[]> {
    const issues: ContinuityNote[] = [];
    
    // Check for contradictory world rules
    const rules = worldBible.rules;
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        if (this.rulesConflict(rules[i], rules[j])) {
          issues.push({
            id: uuidv4(),
            type: 'world',
            title: 'Conflicting world rules',
            description: `Rule "${rules[i].rule}" conflicts with "${rules[j].rule}"`,
            establishedInBook: rules[i].establishedInBook,
            referencedInBooks: [rules[j].establishedInBook],
            conflicts: [],
            status: 'conflicted'
          });
        }
      }
    }
    
    return issues;
  }

  private async checkTimelineContinuity(timeline: SeriesTimeline[], series: BookSeries): Promise<ContinuityNote[]> {
    const issues: ContinuityNote[] = [];
    
    // Check for chronological inconsistencies
    const sortedEvents = timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      
      // Check if consequences of current event conflict with next event
      if (this.eventsConflict(current, next)) {
        issues.push({
          id: uuidv4(),
          type: 'timeline',
          title: 'Timeline inconsistency',
          description: `Event "${current.title}" consequences conflict with "${next.title}"`,
          establishedInBook: 1,
          referencedInBooks: current.affectedBooks.concat(next.affectedBooks),
          conflicts: [],
          status: 'conflicted'
        });
      }
    }
    
    return issues;
  }

  private async checkPlotContinuity(series: BookSeries): Promise<ContinuityNote[]> {
    const issues: ContinuityNote[] = [];
    
    // Check for unresolved plot threads
    const plotThreads = await this.getSeriesPlotThreads(series);
    
    for (const thread of plotThreads) {
      if (thread.status === 'introduced' && thread.introducedInBook < series.currentBookCount - 1) {
        issues.push({
          id: uuidv4(),
          type: 'plot',
          title: 'Unresolved plot thread',
          description: `Plot thread "${thread.title}" introduced in book ${thread.introducedInBook} remains unresolved`,
          establishedInBook: thread.introducedInBook,
          referencedInBooks: [thread.introducedInBook],
          conflicts: [],
          status: 'needs_review'
        });
      }
    }
    
    return issues;
  }

  private buildWorldBiblePrompt(category: string, series: BookSeries, worldBible: WorldBible, settings: WritingSettings): string {
    return `Expand the world bible for the ${series.type} series "${series.title}" in the category: ${category}.

Series Context:
- Genre: ${series.genre}
- Description: ${series.description}
- Themes: ${series.overallThemes.join(', ')}
- Number of books: ${series.totalPlannedBooks}

Existing world elements:
- Locations: ${worldBible.locations.map(l => l.name).join(', ')}
- Cultures: ${worldBible.cultures.map(c => c.name).join(', ')}
- Technologies: ${worldBible.technologies.map(t => t.name).join(', ')}

Create detailed, consistent world-building elements for: ${category}
Ensure all elements support the story and maintain internal consistency.`;
  }

  private async generateWorldBibleContent(prompt: string, settings: WritingSettings): Promise<Record<string, unknown[]>> {
    // Simplified implementation - in production, use AI to generate detailed content
    return {
      locations: [],
      cultures: [],
      technologies: [],
      magicSystems: [],
      religions: [],
      languages: [],
      historicalEvents: []
    };
  }

  private async generateTransitionPlan(prompt: string, settings: WritingSettings): Promise<{
    cliffhangers: string[];
    characterTransitions: string[];
    plotAdvancement: string[];
    worldProgression: string[];
    continuityChecks: string[];
  }> {
    // Simplified implementation - in production, use AI to generate detailed transition plan
    return {
      cliffhangers: ['Shocking revelation about main character', 'New threat emerges'],
      characterTransitions: ['Character gains new abilities', 'Relationship dynamics shift'],
      plotAdvancement: ['New mystery introduced', 'Previous conflict escalates'],
      worldProgression: ['Political landscape changes', 'New locations discovered'],
      continuityChecks: ['Verify character motivations', 'Check timeline consistency']
    };
  }

  private async getSeriesPlotThreads(series: BookSeries): Promise<SeriesPlotThread[]> {
    // In production, this would extract plot threads from the series data
    return [];
  }

  private calculateWritingVelocity(series: BookSeries): number {
    // Calculate words per day based on series history
    if (series.books.length === 0) return 1000; // Default estimate
    
    const totalWords = series.books.reduce((sum, book) => sum + book.currentWordCount, 0);
    const daysSinceStart = Math.ceil(
      (new Date().getTime() - new Date(series.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceStart > 0 ? totalWords / daysSinceStart : 1000;
  }

  private rulesConflict(rule1: WorldRule, rule2: WorldRule): boolean {
    // Simplified conflict detection
    return rule1.category === rule2.category && rule1.rule !== rule2.rule;
  }

  private eventsConflict(event1: SeriesTimeline, event2: SeriesTimeline): boolean {
    // Simplified conflict detection
    return event1.consequences.some(consequence => 
      event2.description.toLowerCase().includes(consequence.toLowerCase())
    );
  }

  private async parseSeriesOutline(response: string, series: BookSeries): Promise<{
    seriesOverview: string;
    bookOutlines: string[];
    characterArcs: string[];
    worldBuilding: string;
    plotThreads: SeriesPlotThread[];
  }> {
    // In production, this would intelligently parse the AI response
    return {
      seriesOverview: response.substring(0, 500),
      bookOutlines: Array(series.totalPlannedBooks).fill('Book outline placeholder'),
      characterArcs: ['Character arc placeholder'],
      worldBuilding: 'World building details',
      plotThreads: []
    };
  }
}