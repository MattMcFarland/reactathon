module.exports = function (DataTypes) {
  return {
    URL: require('./URL')(DataTypes),
    email: require('./email')(DataTypes)
  };
};
