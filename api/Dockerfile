# Use the official Node.js 14 image as a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["node", "server.js"]
