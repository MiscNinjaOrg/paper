import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Message } from "@/app/chat/Chat";

const messageMap = (message: Message) => {
    let role: string;

    switch (message.name) {
        case "system": role = "system";
        case "ai": role = "assistant";
        case "human": role = "user";
        default: role = "user";
    }

    return {role: role, content: message.text}
}

export async function POST(req: Request) {
    const body = await req.json();
    const messages = body.messages;
    const prompt = body.prompt;

    let openai: OpenAI;
    if (body.api_key) {
        openai = new OpenAI({baseURL: "https://openrouter.ai/api/v1", apiKey: body.api_key});
    }
    else {
        openai = new OpenAI({baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY});
    }

    const _messages = messages.map(messageMap);
    const _prompt = [{role: "user", content: prompt}];
    console.log([..._messages, ..._prompt]);

    const response = await openai.chat.completions.create({
        model: "openai/gpt-4",
        stream: true,
        messages: [..._messages, ..._prompt]
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}