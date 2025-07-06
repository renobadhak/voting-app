FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Salin script wait-for-it ke dalam image
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

EXPOSE 5000

CMD ["sh", "-c", "./wait-for-it.sh db:3306 -- node index.js"]
