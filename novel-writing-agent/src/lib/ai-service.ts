import OpenAI from 'openai';
import { WritingSettings, Chapter, Character, NovelProject, BookSeries } from './types';

export class AIWritingService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

  async generateOutline(project: Partial<NovelProject> | BookSeries, settings: WritingSettings): Promise<string> {
    const prompt = this.buildOutlinePrompt(project, settings);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: settings.model === 'gpt-4-turbo' ? 'gpt-4-1106-preview' : 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional novel writing assistant. Create detailed, engaging outlines that ensure originality and avoid any similarities to existing works.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating outline:', error);
      throw new Error('Failed to generate outline');
    }
  }

  async writeChapter(
    chapter: Partial<Chapter>,
    project: NovelProject,
    settings: WritingSettings,
    previousChapters: Chapter[] = []
  ): Promise<string> {
    const prompt = this.buildChapterPrompt(chapter, project, settings, previousChapters);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: settings.model === 'gpt-4-turbo' ? 'gpt-4-1106-preview' : 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional ${project.type} writer. Write engaging, original content that maintains consistency with the established narrative. Ensure complete originality and avoid any similarities to existing published works.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error writing chapter:', error);
      throw new Error('Failed to write chapter');
    }
  }

  async developCharacter(character: Partial<Character>, project: NovelProject, settings: WritingSettings): Promise<Character> {
          const prompt = this.buildCharacterPrompt(character, project);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: settings.model === 'gpt-4-turbo' ? 'gpt-4-1106-preview' : 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a character development specialist. Create rich, complex, and original characters that fit the story world.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: settings.temperature,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content || '';
      return this.parseCharacterResponse(content, character);
    } catch (error) {
      console.error('Error developing character:', error);
      throw new Error('Failed to develop character');
    }
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'en'): Promise<string> {
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Maintain the literary style, tone, and emotional impact of the original. Ensure cultural nuances are appropriately adapted while preserving the author's voice:

${text}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional literary translator with expertise in maintaining artistic integrity across languages.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Failed to translate text');
    }
  }

  async enhanceText(text: string, enhancement: 'grammar' | 'style' | 'flow' | 'dialogue', settings: WritingSettings): Promise<string> {
    const prompts = {
      grammar: 'Improve the grammar and sentence structure while maintaining the original meaning and style.',
      style: `Enhance the writing style to be more engaging and ${settings.writingStyle}. Maintain the ${settings.tone} tone.`,
      flow: 'Improve the narrative flow and transitions between paragraphs and scenes.',
      dialogue: 'Enhance the dialogue to be more natural, engaging, and character-appropriate.'
    };

    const prompt = `${prompts[enhancement]}

Original text:
${text}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional editor specializing in literary enhancement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error enhancing text:', error);
      throw new Error('Failed to enhance text');
    }
  }

  private buildOutlinePrompt(project: Partial<NovelProject> | BookSeries, settings: WritingSettings): string {
    const isSeries = 'totalPlannedBooks' in project;
    const targetWords = isSeries ? '80000 per book' : (project as NovelProject).targetWordCount;
    const themes = isSeries ? (project as BookSeries).overallThemes : (project as NovelProject).themes;
    
    return `Create a detailed outline for a ${project.type} ${isSeries ? 'series' : 'novel'} with the following specifications:

Title: ${project.title}
Genre: ${project.genre}
Description: ${project.description}
Target Word Count: ${targetWords} words
${isSeries ? `Total Books Planned: ${(project as BookSeries).totalPlannedBooks}` : ''}
Writing Style: ${settings.writingStyle}
Tone: ${settings.tone}
Point of View: ${settings.pointOfView}
Themes: ${themes?.join(', ') || 'To be determined'}

Please create:
${isSeries ? '1. Overall series arc across all books' : '1. A compelling premise and central conflict'}
${isSeries ? '2. Individual book outlines with unique conflicts' : '2. Detailed chapter-by-chapter breakdown'}
3. Character arcs and development${isSeries ? ' across the series' : ''}
4. Major plot points and turning moments
5. Thematic elements and their integration
6. Pacing and structure recommendations
${isSeries ? '7. Plot threads that span multiple books' : ''}
${isSeries ? '8. Character development across the entire series' : ''}

Ensure the outline is completely original and avoids any similarities to existing published works${isSeries ? ' across the entire series' : ''}.`;
  }

  private buildChapterPrompt(
    chapter: Partial<Chapter>,
    project: NovelProject,
    settings: WritingSettings,
    previousChapters: Chapter[]
  ): string {
    const contextSummary = previousChapters.length > 0 
      ? `Previous chapters summary: ${previousChapters.map(ch => ch.summary).join(' ')}`
      : 'This is the opening chapter.';

    return `Write Chapter ${chapter.order}: "${chapter.title}" for the ${project.type} novel "${project.title}".

Project Details:
- Genre: ${project.genre}
- Overall plot: ${project.description}
- Writing style: ${settings.writingStyle}
- Tone: ${settings.tone}
- Point of view: ${settings.pointOfView}

Chapter specifications:
- Title: ${chapter.title}
- Summary: ${chapter.summary}
- Target length: Approximately 2000-3000 words

Context:
${contextSummary}

Characters involved:
${project.characters.map(char => `- ${char.name}: ${char.description}`).join('\n')}

Settings:
${project.settings.map(setting => `- ${setting.name}: ${setting.description}`).join('\n')}

Write a compelling, original chapter that advances the plot and develops characters naturally. Ensure complete originality and avoid any similarities to existing works.`;
  }

  private buildCharacterPrompt(character: Partial<Character>, project: NovelProject): string {
    return `Develop a detailed character profile for "${character.name}" in the ${project.type} novel "${project.title}".

Basic Information:
- Name: ${character.name}
- Role: ${character.role}
- Initial description: ${character.description}

Project context:
- Genre: ${project.genre}
- Setting: ${project.settings?.[0]?.name} (${project.settings?.[0]?.timeframe})
- Themes: ${project.themes?.join(', ')}

Please provide a comprehensive character development including:
1. Physical description and distinctive features
2. Detailed personality traits and quirks
3. Extensive background and history
4. Core motivations and goals
5. Internal and external conflicts
6. Character arc throughout the story
7. Relationships with other characters
8. Unique voice and dialogue patterns
9. Strengths and weaknesses
10. Character growth potential

Ensure the character is original, complex, and fits seamlessly into the story world.`;
  }

  private parseCharacterResponse(content: string, originalCharacter: Partial<Character>): Character {
    // This is a simplified parser - in a real implementation, you'd use more sophisticated parsing
    return {
      id: originalCharacter.id || '',
      name: originalCharacter.name || '',
      description: content,
      role: originalCharacter.role || 'supporting',
      personality: this.extractSection(content, 'personality') || '',
      background: this.extractSection(content, 'background') || '',
      goals: this.extractSection(content, 'goals') || '',
      conflicts: this.extractSection(content, 'conflicts') || ''
    };
  }

  private extractSection(content: string, section: string): string {
    // Simple extraction - in production, use more robust parsing
    const regex = new RegExp(`${section}:([^\\n]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
}