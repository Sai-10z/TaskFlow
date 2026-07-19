FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (omit devDependencies in production)
RUN npm ci --only=production

# Copy source code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose backend port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
