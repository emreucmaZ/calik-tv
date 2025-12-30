FROM node:20-slim

WORKDIR /home/node/app

# FFmpeg ve build araclari
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Client build
COPY client/package*.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

# Server
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/

WORKDIR /home/node/app/server

EXPOSE 3000 1935 8000

CMD [ "node", "src/index.js" ]
