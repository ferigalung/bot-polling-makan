FROM node:18.13.0

# Setup PM2
USER root
RUN mkdir /.pm2
RUN chmod 775 -Rf /.pm2
RUN npm config set prefix $HOME/.npm-global
RUN npm i -g pm2

WORKDIR /usr/app
COPY ./ /usr/app

# Copy and install Node.js package requirements
COPY package*.json ./usr/app
RUN npm i

# Expose application port
EXPOSE 9000

# Run the application
CMD ["pm2-runtime", "ecosystem.config.js"]
