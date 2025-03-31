# Use an official Node.js runtime as a parent image
# Using version 22 based on user's stated version v22.14.0
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install only production dependencies using npm ci for faster, reliable builds
RUN npm ci --only=production

# Copy the rest of the application code into the container
COPY . .

# Make port 8080 available to the world outside this container
# Fly.io typically uses 8080 by default for Node apps. It will map this internally.
# Your app listens on process.env.PORT || 5000, Fly will set PORT to 8080.
EXPOSE 8080

# Define the command to run your app
CMD ["node", "server.js"] 