import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { constructPrompt } from "../../utils";
import { ModelNameMapping } from "./utils";

async function scrapeAndClean(searchResult: any) {
    try {
        const signal = AbortSignal.timeout(3000);
        const response = await fetch(searchResult.link as string, {signal: signal});
        if (!response.ok) {
            return {idx: -1, title: "", snippet: ""}
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
            return {idx: -1, title: "", snippet: ""}
        }

        const title = searchResult.title;
        const snippet = cleaned.slice(0, 200);
        const idx = searchResult.position;

        return {idx: idx, title: title, snippet: snippet};
    } catch (e) {
        return {idx: -1, title: "", snippet: ""}
    }
}

export async function POST(req: Request, { params }: { params: { model_name: string } }) {
    const model_name = params.model_name;
    const body = await req.json();
    const query = body.query;
    const sources = body.sources;

    let openai: OpenAI;
    if (body.api_key) {
        openai = new OpenAI({baseURL: "https://openrouter.ai/api/v1", apiKey: body.api_key});
    }
    else {
        openai = new OpenAI({baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY});
    }

    const snippets = (await Promise.all(sources.map(scrapeAndClean))).filter((snippet: any) => snippet.idx != -1);

    const prompt = constructPrompt(query, snippets.slice(0, 4));

    console.log(prompt)
    const response = await openai.chat.completions.create({
        model: ModelNameMapping[model_name],
        stream: true,
        messages: [{role: "user", content: prompt}]
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}