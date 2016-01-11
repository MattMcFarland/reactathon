/**
 * URL
 * @param DataTypes
 * @returns {{type: (number|*), validate: {isUrl: boolean}}}
 */
module.exports = (DataTypes) => {

  return {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  };
};
