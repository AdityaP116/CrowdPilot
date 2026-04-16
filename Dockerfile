# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install dependencies
# Remove any Windows-generated lockfile to prevent cross-platform rollup native module issues
COPY package*.json ./
RUN rm -f package-lock.json && npm install
# Explicitly install Linux rollup native binary (fixes npm optional dep bug on cross-platform builds)
RUN node -e "require('@rollup/rollup-linux-x64-gnu')" 2>/dev/null || \
    npm install @rollup/rollup-linux-x64-gnu --no-save --ignore-scripts

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config as a template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Default port for Cloud Run
ENV PORT=8080
EXPOSE 8080

# Substitute the PORT variable in the nginx config at runtime and start nginx
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
