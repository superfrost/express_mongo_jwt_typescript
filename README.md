# Express node.js server + mongodb + typescript

Server on express with mongo with jwt and typescript support

Endpoints:
  - /healthcheck         GET    (Return 200 if alive)
  - /login               POST   (Receive: ownerid (optional), page, maxcount)
  - /register            POST   (Receive: email, login, password)
  - /get-photos          GET    (Receive: ownerid (optional), page, maxcount)
  - /load-photos         GET    (No params. Seed user albums and photos with data from jsonplaceholder)
  - /delete-photo        DELETE (Receive: photoid (or multiple ids separated by comma))
  - /delete-album        DELETE (Receive: albumid (or multiple ids separated by comma))
  - /change-album-title  POST   (Receive: albumid, new_album_name)

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
  -e "JWT_SECRET=some_random_string" \
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