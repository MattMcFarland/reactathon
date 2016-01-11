module.exports = function (sequelize, DataTypes) {

  var Card = sequelize.define('Card',
    {
      type: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING),
        get() {
          return 'cardType';
        }
      },
      shasum: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      content: DataTypes.TEXT,
      shareUrl: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      size: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      visibility: DataTypes.STRING,
      score: {
        type: new DataTypes.VIRTUAL(DataTypes.INTEGER),
        get() {
          return new Promise((resolv) => {
            this.getVotes().then(votes => {
              var count = 0;
              votes.forEach((vote) => {
                if (vote.direction === 'up') {
                  count++;
                } else if (vote.direction === 'down') {
                  count--;
                }
              });
              resolv(count);
            });
          });
        }
      },
      downVoteCount: {
        type: new DataTypes.VIRTUAL(DataTypes.INTEGER),
        get() {
          return new Promise((resolv) => {
            this.getVotes().then(votes => {
              var count = 0;
              votes.forEach((vote) => {
                if (vote.direction === 'down') {
                  count++;
                }
              });
              resolv(count);
            });
          });
        }
      },
      upVoteCount: {
        type: new DataTypes.VIRTUAL(DataTypes.INTEGER),
        get() {
          return new Promise((resolv) => {
            this.getVotes().then(votes => {
              var count = 0;
              votes.forEach((vote) => {
                if (vote.direction === 'up') {
                  count++;
                }
              });
              resolv(count);
            });
          });
        }
      }
    },
    {
      classMethods: {
        associate: (models) => {
          Card.belongsTo(models.User, {as: 'Author'});
          Card.belongsTo(models.User, {as: 'Editor'});
          Card.hasMany(models.Comment, {
            foreignKey: 'card_commentable_id',
            constraints: false,
            scope: {
              commentable: 'card'
            }
          });
          Card.hasMany(models.Flag, {
            foreignKey: 'card_flaggable_id',
            constraints: false,
            scope: {
              flaggable: 'card'
            }
          });
          Card.hasMany(models.Vote, {
            foreignKey: 'card_votable_id',
            constraints: false,
            scope: {
              votable: 'card'
            }
          });
          Card.belongsToMany(models.Tag, {
            through: {
              model: models.TagItem,
              unique: false
            },
            scope: {
              taggable: 'card'
            },
            foreignKey: 'taggable_id',
            constraints: false
          });

        }
      }
    });
  return Card;
};
