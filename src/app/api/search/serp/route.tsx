export async function POST(req: Request) {
    const body = await req.json();
    const query = body.query;

    console.log(query);

    var myHeaders = new Headers();
    myHeaders.append("X-API-KEY", "a55ab296e8b16b0ad8fb5ccbead33c24c9f874e3");
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

    return Response.json(searchResults);
}