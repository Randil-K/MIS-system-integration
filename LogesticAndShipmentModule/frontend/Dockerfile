# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Accept build-time argument for Vite API URL
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy only package.json (skip pnpm-generated lock file to avoid npm compat issues)
COPY package.json ./

# Force-install all deps including optional peer deps (react, react-dom)
RUN npm install --force

# Copy all source files
COPY . .

# Build the production bundle
RUN npm run build

# Serve stage - Nginx to serve static files
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
