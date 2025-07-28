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
    const series = agentInstance.getSeries(resolvedParams.id);
    
    if (!series) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Series not found' 
        },
        { status: 404 }
      );
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const agentInstance = getAgent();
    const resolvedParams = await params;
    const deleted = await agentInstance.deleteSeries(resolvedParams.id);
    
    if (!deleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Series not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Series deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}