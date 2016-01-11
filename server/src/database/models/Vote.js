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
        Vote.belongsTo(models.Card, {
          foreignKey: 'card_votable_id',
          constraints: false,
          as: 'card'
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
