export interface SearchResult {
    link: string;
    title: string;
    snippet: string;
}

export async function POST(req: Request) {
    const body = await req.json();
    const query = body.query;

    var myHeaders = new Headers();
    myHeaders.append("X-API-KEY", process.env.SERPER_API_KEY as string);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "q": query
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    } as RequestInit;

    const searchResponse = await fetch("https://google.serper.dev/search", requestOptions);
    const searchJSON = await searchResponse.json();
    const searchResults = searchJSON.organic;

    let finalSearchResults: SearchResult[] = [];
    for (let i = 0; i < searchResults.length; i++) {
        const searchResult = searchResults[i];
        const finalSearchResult = {position: searchResult.position, link: searchResult.link, title: searchResult.title, snippet: searchResult.snippet} as SearchResult;
        finalSearchResults = [...finalSearchResults, finalSearchResult];
    }

    return Response.json(finalSearchResults);
}