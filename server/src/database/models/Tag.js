module.exports = function (sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
      type: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING),
        get() {
          return 'tagType';
        }
      },
      name: {
        type: DataTypes.STRING
      },
      lastUsedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      useCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      taggable: DataTypes.STRING
    },
    {
      classMethods: {
        associate: (models) => {
          // Tag.hasMany(models.Tag, {as: 'similarTags'});
          Tag.belongsToMany(models.Card, {
            through: {
              model: models.TagItem,
              unique: false
            },
            foreignKey: 'card_tag_id'
          });
        }
      }
    }
  );
  return Tag;
};
