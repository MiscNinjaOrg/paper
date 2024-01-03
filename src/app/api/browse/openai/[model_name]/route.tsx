import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request, { params }: { params: { model_name: string } }) {
    const model_name = params.model_name;
    const body = await req.json();
    const message = body.message

    let openai: OpenAI;
    if (body.api_key) {
        openai = new OpenAI({apiKey: body.api_key});
    }
    else {
        openai = new OpenAI();
    }

    const prompt = `
    The user has entered the following query in a text box. Answer it or complete it in 2-3 sentences at most.

    Query: ${message}
    `;

    const response = await openai.chat.completions.create({
        model: model_name,
        stream: false,
        messages: [{role: "user", content: prompt}]
    });

    return NextResponse.json({reply: response.choices[0].message.content}, {status: 200});
}