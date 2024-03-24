# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the remaining source code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
