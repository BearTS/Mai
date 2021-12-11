FROM node:14-alpine
# Required
# Token Of Your Discord Bot
ENV DISCORD_TOKEN="${DISCORD_TOKEN}"
# OPTIONAL ENV
# The Mongo URI, if you want to use the database-reliant features
ENV MONGO_URI="${MONGO_URI}"
# Discordbotlist Auth Key, if the bot is listed on dbl.
# Used for posting server and user count
ENV DBL_AUTH="${DBL_AUTH}"
# Top GG Auth Key, if the bot is listed on top.gg
# Used for posting server and user count
ENV TOP_GG_AUTH="${TOP_GG_AUTH}"
# Chatbot id and key, if you want to use the chatbot feature
# contact Sakurajimai#6742 for more info
# [OPTIONAL]
ENV chatbot_id="${chatbot_id}"
ENV chatbot_key="${chatbot_key}"
# Dependencies
RUN apk add  --no-cache git ffmpeg \
    && apk add --virtual build-dependencies \
    build-base \
    gcc \
    python3 \
    python3-dev \
    make \
    pkgconfig \
    autoconf \
    libtool \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev
    
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install
COPY . /usr/src/bot
EXPOSE 1200
CMD ["node", "index.js"]