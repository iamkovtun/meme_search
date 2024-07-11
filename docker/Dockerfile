FROM node:14 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:14 AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

FROM python:3.12.4
WORKDIR /app

# Copy and install Python requirements
COPY ai-app/requirements.txt .
RUN pip install -r requirements.txt

# Copy AI app
COPY ai-app/ ./ai-app/

# Copy built frontend
COPY --from=build-frontend /app/frontend/build ./frontend/build

# Copy backend
COPY --from=build-backend /app/backend ./backend

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify Node.js and npm installation
RUN node --version && npm --version

# Install PM2 globally
RUN npm install -g pm2

# Copy root package.json and ecosystem.config.js
COPY package.json ecosystem.config.js ./

EXPOSE 3000 3001 8000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]