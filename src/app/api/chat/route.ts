import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt } from '@/lib/ai-context';
import { UserRole } from '@/types';

type Provider = 'anthropic' | 'anthropic-haiku' | 'gemini';

function getAvailableProvider(requested: Provider): Provider | null {
  if (requested === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (requested === 'anthropic-haiku' && process.env.ANTHROPIC_API_KEY) return 'anthropic-haiku';
  if (requested === 'gemini' && process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  return null;
}

async function streamAnthropic(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  useHaiku = false
): Promise<ReadableStream> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' });
  const stream = await anthropic.messages.create({
    model: useHaiku ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

async function streamGemini(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<ReadableStream> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
  });

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1].content;

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export async function POST(request: Request) {
  try {
    const { messages, userRole, provider: requestedProvider } = await request.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
      userRole: string;
      provider?: Provider;
    };

    const provider = getAvailableProvider(requestedProvider ?? 'gemini');
    if (!provider) {
      return Response.json(
        { error: 'APIキーが設定されていません。Vercel環境変数にANTHROPIC_API_KEYまたはGEMINI_API_KEYを追加してください。' },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'メッセージが空です' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(userRole as UserRole);

    const readable = provider === 'gemini'
      ? await streamGemini(systemPrompt, messages)
      : await streamAnthropic(systemPrompt, messages, provider === 'anthropic-haiku');

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-AI-Provider': provider,
      },
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return Response.json(
      { error: 'AIアドバイザーとの通信に失敗しました。しばらくしてから再試行してください。' },
      { status: 500 }
    );
  }
}
