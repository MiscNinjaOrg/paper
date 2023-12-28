# MiscNinja Paper

Paper is the front-facing UI component of the MiscNinja project. It is intended to be a semantic layer over the internet; i.e. it uses AI to smoothen a user's interaction with the internet - both the searching and browsing experiences.

## Search

This part so far has been relatively straightforward. The approach is similar to how I imagine Perplexity AI does it - take a query, use a SERP API to get links, extract and clean text from 4-6 top ones, and then prompt the LLM to generate a summary relevant to the query.

## Browse

Not sure how to tackle this yet.

## Run the Demo

A demo may or may not be up [here](http://app.misc.ninja/).

## Run with Remote Docker Image

Detailed instructions on building coming soon.

For now, just use the image from Docker Hub

```
docker pull lordspline/miscninja-paper
docker run -d -p 80:80 lordspline/miscninja-paper
```

Then go to `http://localhost/` in your browser.

Remember to provide your OpenAI API Key.

## Local Dev Setup

To set up Paper for local development -

```
./setup.sh --local
```

Then go to `http://localhost/` in your browser.

## Docker Setup

To run Paper locally using Docker build -

```
./setup.sh --docker
```

Then go to `http://localhost/` in your browser.

## Manual Setup

- Clone Repo
  
```
git clone https://github.com/MiscNinjaOrg/paper.git
```

- Install Dependencies

```
cd paper
npm install
```

- Create a .env file

```
# Deployment Environment:
NODE_ENV=development

# Next Auth config:
# Generate a secret with `openssl rand -base64 32`
NEXTAUTH_SECRET=changeme
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./db.sqlite
```

- Run the app

```
npm run dev
```

Then go to `http://localhost/` in your browser.
