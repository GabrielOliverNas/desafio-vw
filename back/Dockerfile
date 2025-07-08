FROM nodered/node-red:latest

USER root

RUN npm install --unsafe-perm --no-update-notifier --no-fund jsonwebtoken --only=production node-red-contrib-bcrypt

USER node-red