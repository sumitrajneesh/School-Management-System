# --- Stage 1: Build Stage ---
# Use a Node.js LTS (Long Term Support) image for building
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching.
# This ensures that npm install runs only if these files change.
COPY package*.json ./

# Install development and production dependencies.
# We install all here because 'npm run build' might need dev dependencies.
RUN npm install

# Copy the rest of the application source code (including your 'src' directory)
COPY . .

# Build the TypeScript application.
# This command will compile your .ts files into .js files in the 'dist' directory.
RUN npm run build

# --- Stage 2: Production Stage ---
# Use a smaller, production-optimized Node.js image for the final application
FROM node:20-alpine

# Set the working directory for the final image
WORKDIR /app

# Copy only production dependencies from the build stage,
# as 'npm ci --only=production' will ensure clean installation based on package-lock.json
COPY package*.json ./
RUN npm ci --only=production

# Copy the built application code (the 'dist' directory) from the 'build' stage
COPY --from=build /app/dist ./dist

# Copy the .env file.
# IMPORTANT: For production, consider using environment variables injected by your orchestrator (Kubernetes, ECS)
# instead of copying a .env file directly into the image for security reasons.
COPY .env ./.env

# Expose the port on which your Express application will listen (e.g., 3001)
EXPOSE 3001

# Define the command to run your application when the container starts
# Assumes your main entry file is `server.js` inside the `dist` folder.
CMD [ "node", "dist/server.js" ]