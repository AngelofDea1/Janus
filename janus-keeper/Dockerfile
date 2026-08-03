FROM node:18-alpine

WORKDIR /app

# Install pm2 globally
RUN npm install -g pm2

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Start the PM2 process manager in no-daemon mode
CMD ["pm2-runtime", "ecosystem.config.js"]
