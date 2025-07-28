import { NextRequest, NextResponse } from 'next/server';
import { NovelWritingAgent } from '@/lib/agent-orchestrator';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
let agent: NovelWritingAgent;

function getAgent(): NovelWritingAgent {
  if (!agent) {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }
    agent = new NovelWritingAgent(OPENAI_API_KEY);
  }
  return agent;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agentInstance = getAgent();

    const { projectId, content, targetLanguage, sourceLanguage } = body;

    if (!content || !targetLanguage) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content and target language are required' 
        },
        { status: 400 }
      );
    }

    const result = await agentInstance.translateContent(
      projectId,
      content,
      targetLanguage,
      sourceLanguage || 'en'
    );

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error translating content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}