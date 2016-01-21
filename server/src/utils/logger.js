import {
  appConfig,
  winston
} from './modules';

const env = process.env.NODE_ENV || 'development';
const config = appConfig.logger[env];

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: config.path,
      level: 'info'
    })
  ]
});


