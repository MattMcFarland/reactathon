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
  }
};
