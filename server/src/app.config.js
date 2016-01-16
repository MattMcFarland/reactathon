const path = require('path');
const envpath = path.join(__dirname, '.env.example');
require('dotenv').config({path: envpath});

module.exports = {
  www: {
    title: 'Reactathon',
    description: 'Starter kit',
    google_analytics: 'UA-XXXXXXXX-X'
  },
  sequelize: {
    development: {
      dialect: 'sqlite',
      storage: './db.development.sqlite',
      logging: false
    },
    test: {
      dialect: 'sqlite',
      storage: './db.test.sqlite',
      logging: false
    },
    production: {
      dialect: 'sqlite',
      storage: './db.production.sqlite',
      logging: false
    }
  },
  server: {
    development: {
      port: process.env.PORT || 3030,
      host: 'http://localhost',
      ssl: {
        port: 8443,
        host: 'https://localhost',
        key: './ssl/localhost.key',
        cert: './ssl/localhost.cert'
      }
    },
    test: {
      port: process.env.PORT || 3030,
      host: 'http://localhost',
      ssl: {
        port: 8443,
        host: 'https://localhost',
        key: './ssl/localhost.key',
        cert: './ssl/localhost.cert'
      }
    },
    production: {
      port: process.env.PORT || 8080,
      host: 'http://localhost',
      ssl: {
        port: 443,
        host: 'https://localhost',
        key: './ssl/localhost.key',
        cert: './ssl/localhost.cert'
      }
    }
  },
  auth: {
    development: {
      FACEBOOK_ID: process.env.FACEBOOK_ID,
      FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
      FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
      REDDIT_ID: process.env.REDDIT_ID,
      REDDIT_SECRET: process.env.REDDIT_SECRET,
      REDDIT_CALLBACK_URL: process.env.REDDIT_CALLBACK_URL,
      GITHUB_ID: process.env.GITHUB_ID,
      GITHUB_SECRET: process.env.GITHUB_SECRET,
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
      TWITTER_KEY: process.env.TWITTER_KEY,
      TWITTER_SECRET: process.env.TWITTER_SECRET,
      TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
      GOOGLE_ID: process.env.GOOGLE_ID,
      GOOGLE_SECRET: process.env.GOOGLE_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      STEAM_KEY: process.env.STEAM_KEY,
      STEAM_CALLBACK_URL: process.env.STEAM_CALLBACK_URL
    },
    test: {
      FACEBOOK_ID: process.env.FACEBOOK_ID,
      FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
      FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
      REDDIT_ID: process.env.REDDIT_ID,
      REDDIT_SECRET: process.env.REDDIT_SECRET,
      REDDIT_CALLBACK_URL: process.env.REDDIT_CALLBACK_URL,
      GITHUB_ID: process.env.GITHUB_ID,
      GITHUB_SECRET: process.env.GITHUB_SECRET,
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
      TWITTER_KEY: process.env.TWITTER_KEY,
      TWITTER_SECRET: process.env.TWITTER_SECRET,
      TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
      GOOGLE_ID: process.env.GOOGLE_ID,
      GOOGLE_SECRET: process.env.GOOGLE_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      STEAM_KEY: process.env.STEAM_KEY,
      STEAM_CALLBACK_URL: process.env.STEAM_CALLBACK_URL
    },
    production: {
      FACEBOOK_ID: process.env.FACEBOOK_ID,
      FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
      FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
      REDDIT_ID: process.env.REDDIT_ID,
      REDDIT_SECRET: process.env.REDDIT_SECRET,
      REDDIT_CALLBACK_URL: process.env.REDDIT_CALLBACK_URL,
      GITHUB_ID: process.env.GITHUB_ID,
      GITHUB_SECRET: process.env.GITHUB_SECRET,
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
      TWITTER_KEY: process.env.TWITTER_KEY,
      TWITTER_SECRET: process.env.TWITTER_SECRET,
      TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
      GOOGLE_ID: process.env.GOOGLE_ID,
      GOOGLE_SECRET: process.env.GOOGLE_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      STEAM_KEY: process.env.STEAM_KEY,
      STEAM_CALLBACK_URL: process.env.STEAM_CALLBACK_URL
    }
  }
};
