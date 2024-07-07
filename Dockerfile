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

FROM python:3.8
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

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Install PM2 globally
RUN npm install -g pm2

# Copy root package.json
COPY package.json .

EXPOSE 3000 3001 8000

CMD ["pm2-runtime", "start", "package.json"]