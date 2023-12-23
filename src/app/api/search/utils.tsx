export function constructPrompt(query:string, snippets: {idx: number, title: string, snippet: string}[]) {
    const prompt = `
I want to know about the following query. Use the following sources to answer the given query as best as possible. Be original, concise, accurate and helpful. Wherever applicable, cite the articles as sources only after the relevant sentences in square brackets (e.g. sentence [1][2]).

Query: ${query}

${snippets.map((s) => `Source ${s.idx}:\n${s.snippet}`).join("\n\n")}
    `;

    return prompt
}