import { NextRequest } from 'next/server';
import { runAgentPipeline } from '@/agents/orchestrator';
import type { AgentEvent } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for agent pipeline

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Session ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Create a TransformStream for SSE
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Helper to send SSE events
  const sendEvent = async (event: AgentEvent) => {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    await writer.write(encoder.encode(data));
  };

  // Run the agent pipeline in the background
  (async () => {
    try {
      const result = await runAgentPipeline(sessionId, async (event) => {
        await sendEvent(event);
      });

      // Send final result
      await sendEvent({
        type: 'complete',
        agentId: 'narration',
        data: result,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Process route error:', error);
      await sendEvent({
        type: 'error',
        agentId: 'image',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
