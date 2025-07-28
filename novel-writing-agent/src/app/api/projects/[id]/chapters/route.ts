import { NextRequest, NextResponse } from 'next/server';
import { NovelWritingAgent } from '@/lib/agent-orchestrator';
import { WritingSettings } from '@/lib/types';

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const agentInstance = getAgent();
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    const settings: WritingSettings = {
      model: body.settings?.model || 'gpt-4',
      temperature: body.settings?.temperature || 0.7,
      maxTokens: body.settings?.maxTokens || 4000,
      writingStyle: body.settings?.writingStyle || 'descriptive',
      tone: body.settings?.tone || 'neutral',
      pointOfView: body.settings?.pointOfView || '3rd-limited'
    };

    const chapterData = {
      title: body.title,
      summary: body.summary,
      order: body.order
    };

    const result = await agentInstance.writeChapter(projectId, chapterData, settings);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error writing chapter:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}