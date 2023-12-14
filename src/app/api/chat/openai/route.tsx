import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Message } from "@/app/chat/Chat";

const openai = new OpenAI();

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

export async function POST(req: Request, res: NextResponse) {
    const body = await req.json();
    const messages = body.messages;
    const prompt = body.prompt;

    const _messages = messages.map(messageMap);
    const _prompt = [{role: "user", content: prompt}];
    console.log([..._messages, ..._prompt]);

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [..._messages, ..._prompt]
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}