FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y procps && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml ./

RUN pnpm install 

COPY . .

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]