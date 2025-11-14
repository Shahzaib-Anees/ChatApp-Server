# Use node LTS
FROM node:20-alpine

# Create app dir
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Expose app port
EXPOSE 3000

CMD ["node", "index.js"]
