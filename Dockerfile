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

# Set environment variables directly in Docker
ENV TWILIO_ACCOUNT_SID=ACa2e4735e2094f9f51f9878a33a65dda6
ENV TWILIO_AUTH_TOKEN=ec22a9cf62055ef856aeb3691f42c979

# Command to run the app
CMD [ "node", "index.js" ]
