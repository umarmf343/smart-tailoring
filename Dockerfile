# Node.js backend for Smart Tailoring
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --quiet

# Copy source
COPY . .

# Expose API port
EXPOSE 4000

# Run migrations at container start via entrypoint
ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
