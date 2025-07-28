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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const agentInstance = getAgent();
    const resolvedParams = await params;
    const seriesId = resolvedParams.id;

    const analytics = await agentInstance.getSeriesAnalytics(seriesId);

    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching series analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}