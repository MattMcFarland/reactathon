module.exports = function (sequelize, DataTypes) {

  var Article = sequelize.define('Article',
    {
      type: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING),
        get() {
          return 'articleType';
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
          Article.belongsTo(models.User, {as: 'Author'});
          Article.belongsTo(models.User, {as: 'Editor'});
          Article.hasMany(models.Comment, {
            foreignKey: 'article_commentable_id',
            constraints: false,
            scope: {
              commentable: 'article'
            }
          });
          Article.hasMany(models.Flag, {
            foreignKey: 'article_flaggable_id',
            constraints: false,
            scope: {
              flaggable: 'article'
            }
          });
          Article.hasMany(models.Vote, {
            foreignKey: 'article_votable_id',
            constraints: false,
            scope: {
              votable: 'article'
            }
          });
          Article.belongsToMany(models.Tag, {
            through: {
              model: models.TagItem,
              unique: false
            },
            scope: {
              taggable: 'article'
            },
            foreignKey: 'taggable_id',
            constraints: false
          });

        }
      }
    });
  return Article;
};
