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
    const project = agentInstance.getProject(resolvedParams.id);
    
    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
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
    const deleted = await agentInstance.deleteProject(resolvedParams.id);
    
    if (!deleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}