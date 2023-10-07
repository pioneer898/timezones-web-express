FROM node:16

# Set Variables
ENV TZ "America/Anchorage"

# Install Packages
WORKDIR /usr/app
COPY app-backend/package.json /usr/app/
COPY app-backend/package-lock.json /usr/app/
RUN npm install

# Copy Server
COPY app-backend/ /usr/app/

#Copy Dist
COPY ../app/ /usr/app/dist/

# Expose Ports
EXPOSE 80
CMD [ "node", "index.js" ]
