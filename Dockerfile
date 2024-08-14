# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React application for production
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]
