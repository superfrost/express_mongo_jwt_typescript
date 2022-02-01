# Express node.js server + mongodb + typescript

Server on express with mongo with jwt and typescript support

Endpoints:
  - /api/healthcheck         GET    (Return 200 if alive)
  - /api/login               POST   (Receive: ownerid (optional), page, maxcount)
  - /api/register            POST   (Receive: email, login, password)
  - /api/get-photos          GET    (Receive: ownerid (optional), page, maxcount)
  - /api/load-photos         GET    (No params. Seed user albums and photos with data from jsonplaceholder)
  - /api/delete-photo        DELETE (Receive: photoid (or multiple ids separated by comma))
  - /api/delete-album        DELETE (Receive: albumid (or multiple ids separated by comma))
  - /api/change-album-title  POST   (Receive: albumid, new_album_name)

**WARNING:** Don't forget to set environments variables. Look at `.env.sample`

# Run and Deploy

Build container from Docker file:

```sh
docker build -t mongo-node:v1 .
```

Run Dockerfile:
```sh
docker run \
  -p "5000:5000" \
  -e "NODE_ENV=production" \
  -e "SALT_ROUNDS=12" \
  -e "JWT_SECRET_ACCESS=some_random_string" \
  -e "JWT_SECRET_REFRESH=some_random_string_2" \
  -e "MONGODB_URL=mongodb://root:example@mongo:27017/" \
  -u "node" \
  -m "300M" --memory-swap "1G" \
  --name "node-mongo-app" \
  mongo-node:v1
```

Or use docker compose:

```sh
docker-compose up
```

**INFO:** Also you can choose type of docker image system (alpine, debian). All work just fine.

# Deploy on Heroku

Everything is ready for deploy. Just don't forget to set env variables