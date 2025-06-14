import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `你是新鮮市場廚房的AI助手。你專門幫助客戶了解我們的餐點、價格、營養資訊和訂購流程。請用繁體中文回答，保持友善和專業的語調。我們提供農場直送的新鮮餐點，包括沙拉、主菜、湯品等。`,
  });

  return result.toDataStreamResponse();
}
