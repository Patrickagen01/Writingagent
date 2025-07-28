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

export async function GET() {
  try {
    const agentInstance = getAgent();
    const series = agentInstance.listSeries();
    
    return NextResponse.json({
      success: true,
      data: series
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agentInstance = getAgent();
    
    const series = await agentInstance.createBookSeries({
      title: body.title,
      description: body.description,
      genre: body.genre,
      type: body.type,
      totalPlannedBooks: body.totalPlannedBooks,
      overallThemes: body.overallThemes
    });

    return NextResponse.json({
      success: true,
      data: series
    });
  } catch (error) {
    console.error('Error creating series:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}