# Use the official Node.js image as the base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the Vue.js app
RUN npm run build

# Expose the port the app will run on
EXPOSE 5173

# Start the app
CMD npm run dev