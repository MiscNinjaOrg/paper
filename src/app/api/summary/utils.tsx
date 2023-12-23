export function constructPrompt(article: string) {
    const prompt = `
Summarize the following article in 5-6 sentences. Be original, concise, accurate and helpful.

Article:
${article}
`

    return prompt
}