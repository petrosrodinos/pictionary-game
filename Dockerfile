# Multi-stage build for better optimization

# Stage 1: Build client
FROM node:18 AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build API and serve
FROM node:18 AS api-builder
WORKDIR /app

# Copy API files
COPY api/package*.json ./
RUN npm install
COPY api/ ./
RUN npm run build

# Copy built client from previous stage
COPY --from=client-builder /app/client/dist ./build/dist

EXPOSE 5000

CMD ["npm", "start"]

