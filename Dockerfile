FROM node:latest
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN  npm install
COPY  . .
RUN npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["node", "./dist/index.js"]