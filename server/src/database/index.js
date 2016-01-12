const models = require('./models');

export const db = models.sequelize;
export const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      models.sequelize.sync().then(() => {
        resolve(models);
      });
    } catch (error) {
      reject(error);
    }
  });
};
