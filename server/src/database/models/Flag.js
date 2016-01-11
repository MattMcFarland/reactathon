module.exports = function (sequelize, DataTypes) {

  var Flag = sequelize.define('Flag',
  {
    type: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return 'flagType';
      }
    },
    name: {
      type: DataTypes.ENUM('spam', 'offensive')
    },
    flaggable: DataTypes.STRING,
    flaggable_id: DataTypes.INTEGER
  },


    {
    classMethods: {
      associate: (models) => {
        Flag.belongsTo(models.User, {as: 'Flagger' });
        Flag.belongsTo(models.Card, {
          foreignKey: 'card_flaggable_id',
          constraints: false,
          as: 'card'
        });
        Flag.belongsTo(models.Comment, {
          foreignKey: 'comment_flaggable_id',
          constraints: false,
          as: 'comment'
        });
      }
    }
  });
  return Flag;
};
