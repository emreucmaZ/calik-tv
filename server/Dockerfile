FROM node:20-slim

WORKDIR /home/node/app

# FFmpeg ve build araclari
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000 1935 8000

CMD [ "node", "src/index.js" ]
