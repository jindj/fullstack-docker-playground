FROM node:lts-alpine

WORKDIR /app

# installer deps (en root pour éviter soucis de permissions), puis repasser node
COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

RUN chown -R node:node /app
USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
