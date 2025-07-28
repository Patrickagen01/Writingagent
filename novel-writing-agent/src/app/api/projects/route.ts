import { NextRequest, NextResponse } from 'next/server';
import { NovelWritingAgent } from '@/lib/agent-orchestrator';

// This would typically come from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Global agent instance (in production, use proper state management)
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
    const projects = agentInstance.listProjects();
    
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
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
    
    const project = await agentInstance.createProject({
      title: body.title,
      description: body.description,
      genre: body.genre,
      type: body.type,
      targetWordCount: body.targetWordCount,
      themes: body.themes
    });

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}