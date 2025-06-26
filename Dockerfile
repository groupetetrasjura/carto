# 1. Install dependencies only when needed
FROM node:lts-alpine AS deps

# Add compatibility for libc6
RUN apk add --no-cache libc6-compat 

# Set working directory and copy package files for dependency installation
WORKDIR /app
COPY package*.json ./

# Install only dependencies
RUN npm install --production=false
RUN npm install @vercel/analytics

# 2. Rebuild the source code only when needed
FROM node:lts-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED=1

# Set working directory and copy application source code
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
RUN npm run build

# 3. Production image with only necessary files
FROM node:lts-alpine AS production

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install curl for potential health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
