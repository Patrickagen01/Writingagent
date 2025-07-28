import { PlagiarismCheck, PlagiarismMatch } from './types';

export class PlagiarismDetectionService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  async checkPlagiarism(content: string, id: string): Promise<PlagiarismCheck> {
    // Simulate plagiarism checking - in production, integrate with services like:
    // - Copyscape API
    // - Grammarly Business API
    // - Turnitin API
    // - Custom implementation using web scraping and similarity algorithms
    
    const check: PlagiarismCheck = {
      id,
      content,
      status: 'checking',
      confidence: 0,
      matches: []
    };

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Perform basic checks
      const matches = await this.performBasicChecks(content);
      
      check.status = matches.length > 0 ? 'potential_issues' : 'clean';
      check.matches = matches;
      check.confidence = this.calculateConfidence(matches);

      return check;
    } catch {
      check.status = 'error';
      return check;
    }
  }

  private async performBasicChecks(content: string): Promise<PlagiarismMatch[]> {
    const matches: PlagiarismMatch[] = [];
    
    // Check for common phrases and clichés
    const commonPhrases = [
      'it was a dark and stormy night',
      'once upon a time',
      'they lived happily ever after',
      'it was the best of times, it was the worst of times',
      'call me ishmael',
      'it is a truth universally acknowledged'
    ];

    commonPhrases.forEach(phrase => {
      const index = content.toLowerCase().indexOf(phrase.toLowerCase());
      if (index !== -1) {
        matches.push({
          text: phrase,
          source: 'Common literary phrases',
          similarity: 0.9,
          startIndex: index,
          endIndex: index + phrase.length
        });
      }
    });

    // Check for repeated patterns (potential copy-paste)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    for (let i = 0; i < sentences.length - 1; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        const similarity = this.calculateSimilarity(sentences[i].trim(), sentences[j].trim());
        if (similarity > 0.8) {
          const startIndex = content.indexOf(sentences[i]);
          matches.push({
            text: sentences[i].trim(),
            source: 'Repeated content within document',
            similarity,
            startIndex,
            endIndex: startIndex + sentences[i].length
          });
        }
      }
    }

    return matches;
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple Levenshtein distance-based similarity
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private calculateConfidence(matches: PlagiarismMatch[]): number {
    if (matches.length === 0) return 1.0;
    
    const averageSimilarity = matches.reduce((sum, match) => sum + match.similarity, 0) / matches.length;
    return Math.max(0, 1 - averageSimilarity);
  }

  async checkOriginality(content: string): Promise<{
    isOriginal: boolean;
    confidence: number;
    suggestions: string[];
  }> {
    const check = await this.checkPlagiarism(content, 'originality-check');
    
    const suggestions: string[] = [];
    
    if (check.matches.length > 0) {
      suggestions.push('Consider rephrasing highlighted sections to improve originality');
      suggestions.push('Remove or modify common phrases and clichés');
      suggestions.push('Ensure all content is written in your unique voice');
    }

    if (check.confidence < 0.8) {
      suggestions.push('Review content for potential similarities to existing works');
      suggestions.push('Add more unique elements and creative descriptions');
    }

    return {
      isOriginal: check.confidence > 0.8 && check.matches.length === 0,
      confidence: check.confidence,
      suggestions
    };
  }

  async generateAlternatives(flaggedText: string): Promise<string[]> {
    // In production, this could use AI to generate alternatives
    const alternatives: string[] = [];
    
    // Simple substitution suggestions
    const substitutions = {
      'dark and stormy night': ['tempestuous evening', 'turbulent nightfall', 'wild, rain-soaked darkness'],
      'once upon a time': ['In a distant era', 'Long ago', 'In times past'],
      'happily ever after': ['found lasting joy', 'discovered enduring happiness', 'built a fulfilling life together']
    };

    const lowerText = flaggedText.toLowerCase();
    for (const [original, alts] of Object.entries(substitutions)) {
      if (lowerText.includes(original)) {
        alternatives.push(...alts);
      }
    }

    return alternatives;
  }
}