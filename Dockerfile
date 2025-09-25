FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/db.json ./db.json

EXPOSE 3000 3001

RUN npm install -g concurrently

RUN sed -i 's/json-server --watch db.json --port 3001/json-server --watch db.json --port 3001 --host 0.0.0.0/' package.json

CMD ["npm", "run", "start:all"]
