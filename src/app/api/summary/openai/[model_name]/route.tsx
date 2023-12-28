import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { constructPrompt } from "../../utils";
import { writeFile } from "fs";

async function scrapeAndClean(link: string) {
    try {
        const signal = AbortSignal.timeout(3000);
        const response = await fetch(link, {signal: signal});
        if (!response.ok) {
            return ""
        }
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const parsed = new Readability(doc).parse();
        const cleaned = parsed?.textContent.trim()
        .replace(/(\n){4,}/g, "\n\n\n")
        .replace(/\n\n/g, " ")
        .replace(/ {3,}/g, "  ")
        .replace(/\t/g, "")
        .replace(/\n+(\s*\n)*/g, "\n") as string;

        if (cleaned === undefined) {
            ""
        }

        writeFile("temp.txt", cleaned, (e) => {});

        const article = cleaned.slice(0, 1000);

        return article;
    } catch (e) {
        return ""
    }
}

export async function POST(req: Request, { params }: { params: { model_name: string } }) {
    const model_name = params.model_name;
    const body = await req.json();
    const link = body.link

    let openai: OpenAI;
    if (body.api_key) {
        openai = new OpenAI({apiKey: body.api_key});
    }
    else {
        openai = new OpenAI();
    }

    const article = await scrapeAndClean(link)

    const prompt = constructPrompt(article);

    console.log(prompt)
    const response = await openai.chat.completions.create({
        model: model_name,
        stream: true,
        messages: [{role: "user", content: prompt}]
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}