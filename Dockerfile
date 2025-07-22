FROM node:20

WORKDIR /app

COPY ../package*.json ./

RUN npm install

RUN npm install -g playwright && \
    npx playwright install

COPY . .

CMD ["npx", "playwright", "test", "."]