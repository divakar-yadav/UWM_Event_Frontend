# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Set unsafe-perm to true
RUN npm config set unsafe-perm true

# Install any needed packages
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Make port 80 available to the world outside this container
EXPOSE 8080

# Build the app for production
RUN npm run build

# Install `serve` to run the application
RUN npm install -g serve

# Start the application
CMD ["sh", "-c", "serve -s build -l 80 > server.log 2>&1"]
