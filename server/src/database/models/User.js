
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    type: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return 'userType';
      }
    },
    displayName: {
      type: DataTypes.STRING
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    github: DataTypes.STRING,
    pictureUrl: DataTypes.STRING,
    website: DataTypes.STRING,
    location: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // User.hasMany(models.Group);
        // User.hasMany(models.User, {as: 'connection'});
        // User.hasMany(models.Action, {as: 'history'});
        User.hasMany(models.Article, {
          as: 'authoredArticles' , foreignKey: 'AuthorId'
        });
        User.hasMany(models.Article, {
          as: 'editedArticles' , foreignKey: 'EditorId'
        });
        User.hasMany(models.Comment, {
          as: 'authoredComments' , foreignKey: 'AuthorId'
        });
        User.hasMany(models.Comment, {
          as: 'editedComments' , foreignKey: 'EditorId'
        });
        User.hasMany(models.Token);
        User.hasMany(models.Vote, {
          foreignKey: 'VoterId'
        });
        User.hasMany(models.Flag, {
          foreignKey: 'FlaggerId'
        });
      }
    }
  });
  return User;
};
