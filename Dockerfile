FROM node:18-alpine

# Create app directory and set it as working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package.json and lockfile first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prefer-offline

# Copy application source code
COPY . .

# Fix permissions for ponder-env.d.ts if it exists, and make /app writable
RUN [ -f ponder-env.d.ts ] && chmod 666 ponder-env.d.ts || true
RUN chmod -R 777 /app

# Use a non-root user for security (node user exists in node:alpine)
USER node

# Set default port
EXPOSE 42069

# Run the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]

# Fallback command (can be overridden)
CMD ["pnpm", "start"]
