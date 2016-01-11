module.exports = function (sequelize, DataTypes) {
  var customTypes = require('./customTypes')(DataTypes);
  var Comment = sequelize.define('Comment',
    {
      type: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING),
        get() {
          return 'commentType';
        }
      },
      url: customTypes.URL,
      content: {
        description: 'The comment message content',
        type: DataTypes.TEXT
      },
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
      },
      commentable: DataTypes.STRING,
      commentable_id: DataTypes.INTEGER
    },
    {
      instanceMethods: {
        getItem: function () {
          return this['get' + this.get('commentable')
            .substr(0, 1).toUpperCase() + this.get('commentable')
            .substr(1)]();
        }
      },
      classMethods: {
        associate: (models) => {
          Comment.belongsTo(models.User, {as: 'Author'});
          Comment.belongsTo(models.User, {as: 'Editor'});
          Comment.belongsTo(models.Card, {
            foreignKey: 'card_commentable_id',
            constraints: false,
            as: 'card'
          });
          Comment.hasMany(models.Flag, {
            foreignKey: 'comment_flaggable_id',
            constraints: false,
            scope: {
              flaggable: 'comment'
            }
          });
          Comment.hasMany(models.Vote, {
            foreignKey: 'comment_votable_id',
            constraints: false,
            scope: {
              votable: 'comment'
            }
          });
        }
      }
    });
  return Comment;
};
