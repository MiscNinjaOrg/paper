#!/bin/bash
cd "$(dirname "$0")" || exit

NEXTAUTH_SECRET=$(openssl rand -base64 32)

ENV="NODE_ENV=development\n\
NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n\
NEXTAUTH_URL=http://localhost:3000\n\
DATABASE_URL=file:../db/db.sqlite\n"

printf $ENV > .env

if [ "$1" = "--docker" ]; then
  printf $ENV > .env.docker
  source .env.docker
  docker build --build-arg NODE_ENV=$NODE_ENV -t paper .
  docker run -d --name paper -p 80:80 paper
else
  printf $ENV > .env
  npm install
  npm run dev
fi