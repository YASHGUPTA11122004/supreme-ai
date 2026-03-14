import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { messages, systemPrompt, model, imageData } = await req.json();

  const selectedModel = model || "gemini-2.0-flash";

  const geminiModel = genAI.getGenerativeModel({
    model: selectedModel,
    systemInstruction: systemPrompt || "You are SupremeAI — the most powerful AI assistant. Above All.",
  });

  const filtered = messages.filter((m: any) => m.role !== "system");
  const firstUserIndex = filtered.findIndex((m: any) => m.role === "user");
  const validMessages = firstUserIndex >= 0 ? filtered.slice(firstUserIndex) : filtered;

  const history = validMessages.slice(0, -1).map((msg: any) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const lastMessage = validMessages[validMessages.length - 1];

  const chat = geminiModel.startChat({ history });

  // Image support
  let parts: any[] = [{ text: lastMessage.content }];
  if (imageData) {
    parts = [
      { text: lastMessage.content || "What's in this image?" },
      {
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.base64,
        },
      },
    ];
  }

  const result = await chat.sendMessageStream(parts);

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
