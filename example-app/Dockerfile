# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy your test script to the container
COPY test-db-connection.js .

# Start the script when the container is run
CMD ["node", "test-db-connection.js"]
