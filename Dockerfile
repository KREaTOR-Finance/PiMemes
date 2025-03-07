FROM node:18

WORKDIR /app/backend

# Copy package files first for better caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY backend/ ./

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"] 