FROM node:18.13.0

# Setup PM2
USER root
RUN mkdir /.pm2
RUN chmod 775 -Rf /.pm2
RUN npm config set prefix $HOME/.npm-global
RUN npm i -g pm2

# Copy and install Node.js package requirements
COPY package*.json ./
RUN npm i

# Copy project files
COPY . .

# Expose application port
EXPOSE 9000

# Run the application
CMD ["pm2-runtime", "ecosystem.config.js"]
