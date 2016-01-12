module.exports = function (sequelize, DataTypes) {
  var Vote = sequelize.define('Vote', {
    type: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return 'voteType';
      }
    },
    direction: {
      type: DataTypes.ENUM('up', 'down', 'neither')
    },
    votable: DataTypes.STRING,
    votable_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Vote.belongsTo(models.User, {as: 'Voter' });
        Vote.belongsTo(models.Article, {
          foreignKey: 'article_votable_id',
          constraints: false,
          as: 'article'
        });
        Vote.belongsTo(models.Comment, {
          foreignKey: 'comment_votable_id',
          constraints: false,
          as: 'comment'
        });
      }
    }
  });
  return Vote;
};
