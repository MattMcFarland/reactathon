module.exports = function (sequelize, DataTypes) {
  var Token = sequelize.define('Token', {
    type: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return 'tokenType';
      }
    },
    kind: DataTypes.STRING,
    accessToken: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Token.belongsTo(models.User);
      }
    }
  });
  return Token;
};
