FROM node:18.13.0

WORKDIR /usr/app
COPY ./ /usr/app

# Copy and install Node.js package requirements
COPY package*.json /usr/app/
RUN npm i

# Expose application port
EXPOSE 9000

# Run the application
CMD ["npm", "start"]
