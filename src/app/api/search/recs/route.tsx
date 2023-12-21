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

    const searchResponse = await fetch("https://google.serper.dev/news", requestOptions);
    const searchJSON = await searchResponse.json();
    const searchResults = searchJSON.news;

    return Response.json(searchResults);
}