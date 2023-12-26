# MiscNinja Paper

Paper is the front-facing UI component of the MiscNinja project. It is intended to be a semantic layer over the internet; i.e. it uses AI to smoothen a user's interaction with the internet - both the searching and browsing experiences.

## Search

This part so far has been relatively straightforward. The approach is similar to how I imagine Perplexity AI does it - take a query, use a SERP API to get links, extract and clean text from 4-6 top ones, and then prompt the LLM to generate a summary relevant to the query.

## Browse

Not sure how to tackle this yet.

## Run the Demo

A demo may or may not be up [here](http://app.misc.ninja/).

## Run via Docker

Detailed instructions on building coming soon.

For now, just use the image from Docker Hub

```
docker pull lordspline/miscninja-paper
docker run -d -p 80:80 lordspline/miscninja-paper
```

Then go to `http://localhost/` in your browser.

Remember to provide your OpenAI API Key.
