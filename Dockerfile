# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy all files from the current directory to the working directory inside the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD [ "node", "index.js" ]
