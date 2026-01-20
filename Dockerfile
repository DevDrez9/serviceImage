FROM node:22-alpine

# Install dependencies required for sharp on Alpine
RUN apk add --no-cache vips-dev build-base --update-cache \
    && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies to keep image small
RUN npm prune --production

CMD ["npm", "run", "start:prod"]
