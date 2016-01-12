const models = require('./models');

export const db = models.sequelize;

export const Article = models.Article;
export const Comment = models.Comment;
export const Flag = models.Flag;
export const Tag = models.Tag;
export const User = models.User;
export const Vote = models.Vote;

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
