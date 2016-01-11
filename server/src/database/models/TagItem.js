module.exports = function (sequelize, DataTypes) {
  return sequelize.define('TagItem', {
    tag_id: {
      type: DataTypes.INTEGER,
      unique: 'TagItem_taggable'
    },
    card_tag_id: {
      type: DataTypes.INTEGER,
      unique: 'TagItem_taggable'
    },
    taggable: {
      type: DataTypes.STRING,
      unique: 'TagItem_taggable'
    },
    taggable_id: {
      type: DataTypes.INTEGER,
      unique: 'TagItem_taggable',
      references: null
    }
  });
};

