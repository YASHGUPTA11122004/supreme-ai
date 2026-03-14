import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/app/lib/systemPrompt";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: SYSTEM_PROMPT,
  });

  const filtered = messages.filter((m: any) => m.role !== "system");

  const firstUserIndex = filtered.findIndex((m: any) => m.role === "user");
  const validMessages = firstUserIndex >= 0 ? filtered.slice(firstUserIndex) : filtered;

  const history = validMessages.slice(0, -1).map((msg: any) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const lastMessage = validMessages[validMessages.length - 1].content;

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
