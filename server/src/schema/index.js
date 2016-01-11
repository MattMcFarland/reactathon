import {
  Card,
  Comment,
  Flag,
  Tag,
  User,
  Vote
} from '../database';


import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  // graphql,
} from 'graphql';


import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionFromPromisedArray,
  connectionArgs,
  connectionDefinitions,
} from 'graphql-relay';

import {
  // getModelsByClass,
  resolveArrayData,
  // getArrayData,
  // resolveArrayByClass,
  resolveModelsByClass
} from 'sequelize-relay';


const md5 = require('md5');
const ajax = require('superagent');

const fromGravatar = (email, key) => {
  return new Promise((resolve) => {
    let hash = md5(email.toLowerCase());
    let uri = `http://www.gravatar.com/${hash}.json`;
    ajax.get(uri).end((err, res) => {
      console.log(err, res);
      if (err) {
        resolve('');
      } else {
        try {
          resolve(res.body.entry[0][key]);
        } catch (er) {
          resolve('');
        }
      }
    });
  });
};


var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    switch (type) {
      case 'Card':
        return Card.findByPrimary(id);
      case 'Comment':
        return Comment.findByPrimary(id);
      case 'Flag':
        return Flag.findByPrimary(id);
      case 'Tag':
        return Tag.findByPrimary(id);
      case 'User':
        return User.findByPrimary(id);
      case 'Vote':
        return Vote.findByPrimary(id);
       default:
        return null;

    }
  },
  (obj) => {
    switch (obj.type) {
      case 'cardType':
        return cardType;
      case 'commentType':
        return commentType;
      case 'flagType':
        return flagType;
      case 'userType':
        return userType;
      case 'tagType':
        return tagType;
      case 'voteType':
        return voteType;
      default:
        return null;
    }
  }
);

var cardType = new GraphQLObjectType({
  name: 'Card',
  description: 'This is a description',
  fields: () => ({
    id: globalIdField(),
    dateCreated: {
      type: GraphQLString,
      resolve: card => card.createdAt
    },
    dateModified: {
      type: GraphQLString,
      resolve: card => card.updatedAt
    },
    title: {
      type: GraphQLString,
      description: 'User defined title of the card',
      resolve: card => card.title
    },
    description: {
      type: GraphQLString,
      description: 'User defined description of the card ',
      resolve: card => card.description
    },
    content: {
      description: 'Code that is in the pic',
      type: GraphQLString,
      resolve: card => card.content
    },
    shareUrl: {
      type: GraphQLString,
      resolve: card => card.shareUrl
    },
    imageUrl: {
      type: GraphQLString,
      resolve: card => card.imageUrl
    },
    size: {
      type: GraphQLInt,
      resolve: card => card.size
    },
    width: {
      type: GraphQLInt,
      resolve: card => card.width
    },
    height: {
      type: GraphQLInt,
      resolve: card => card.height
    },
    visibility: {
      type: GraphQLString,
      resolve: card => card.visibility
    },
    score: {
      type: GraphQLInt,
      resolve: card => card.score
    },
    downVoteCount: {
      type: GraphQLInt,
      resolve: card => card.downVoteCount
    },
    upVoteCount: {
      type: GraphQLInt,
      resolve: card => card.upVoteCount
    },
    author: {
      type: userType,
      resolve: card => card.getAuthor()
    },
    editor: {
      type: userType,
      resolve: card => card.getEditor()
    },
    shasum: {
      type: GraphQLString,
      resolve: card => card.shasum
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: cardConnection} =
  connectionDefinitions({nodeType: cardType});


var commentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'Generic Comments .',
  fields: () => ({
    id: globalIdField(),
    author: {
      type: userType,
      description: 'The user who authored this comment.',
      resolve: comment => comment.getAuthor()
    },
    editor: {
      type: userType,
      resolve: comment => comment.getAuthor()
    },
    dateCreated: {
      type: GraphQLString,
      resolve: comment => comment.createdAt
    },
    dateModified: {
      type: GraphQLString,
      resolve: comment => comment.updatedAt
    },
    url: {
      type: GraphQLString,
      description: 'href location to the tutorial comment page.',
      resolve: comment => comment.url
    },
    content: {
      type: GraphQLString,
      resolve: comment => comment.content
    },
    commentable: {
      type: GraphQLString,
      description: 'Identifies the object type which this comment belongs to',
      resolve: comment => comment.commentable
    },
    card: {
      description: 'Returns the Card that has been commented ',
      type: cardType,
      resolve: comment => comment.getCard()
    },
    votes: {
      type: voteConnection,
      description: 'List of vote objects containing the users and ' +
      'their votes.',
      args: connectionArgs,
      resolve: (comment, args) =>
        connectionFromPromisedArray(resolveArrayData(comment.getVotes()), args)
    },
    flags: {
      type: flagConnection,
      description: 'List of flag objects containing the users and their ' +
      'flags.',
      args: connectionArgs,
      resolve: (comment, args) =>
        connectionFromPromisedArray(resolveArrayData(comment.getFlags()), args)
    },
    score: {
      type: GraphQLInt,
      description: 'Total score of the post after considering all of ' +
      'the down/up votes.',
      resolve: comment => comment.score
    },
    downVoteCount: {
      type: GraphQLInt,
      description: 'Sum total of down votes',
      resolve: comment => comment.downVoteCount
    },
    upVoteCount: {
      type: GraphQLInt,
      description: 'Sum total of up votes',
      resolve: comment => comment.upVoteCount
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: commentConnection} =
  connectionDefinitions({nodeType: commentType});

var tagType = new GraphQLObjectType({
  name: 'Tag',
  description: 'Taxonimical tags used for filtering and organizing posts.',
  fields: () => ({
    id: globalIdField(),
    dateCreated: {
      type: GraphQLString,
      description: 'The date on which the Tag was created or the item was ' +
      'added to a DataFeed.',
      resolve: tag => tag.createdAt
    },
    dateModified: {
      type: GraphQLString,
      description: 'The date on which the Tag was most recently modified ' +
      'or when the item\'s entry was modified within a DataFeed.',
      resolve: tag => tag.updatedAt
    },
    lastUsedDate: {
      description: 'The date on which the Tag was most recently applied to ' +
      'a Post.',
      type: GraphQLString,
      resolve: tag => tag.lastUsedDate
    },
    useCount: {
      description: 'Current amount of times this Tag has been used.',
      type: GraphQLInt,
      resolve: tag => tag.useCount
    },
    taggable: {
      type: GraphQLString,
      description: 'Identifies the object type that has been tagged',
      resolve: tag => tag.taggable
    },
    similarTags: {
      type: tagConnection,
      args: connectionArgs,
      resolve: (tag, args) =>
        connectionFromPromisedArray(resolveArrayData(tag.getTags()), args)
    },
    cards: {
      type: cardConnection,
      description: 'list of cards this tag is connected to.',
      args: connectionArgs,
      resolve: (tag, args) =>
        connectionFromPromisedArray(resolveArrayData(tag.getCards()), args)
    },
    name: {
      type: GraphQLString,
      description: 'The name of the tag..',
      resolve: tag => tag.name
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: tagConnection} =
  connectionDefinitions({nodeType: tagType});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user aka author, editor, etc.',
  fields: () => ({
    id: globalIdField(),
    displayName: {
      type: GraphQLString,
      resolve(user) {
        return user.displayName;
      }
    },
    username: {
      type: GraphQLString,
      resolve(user) {
        return user.username;
      }
    },
    email: {
      type: GraphQLString,
      description: 'User email address',
      resolve(user) {
        return user.email;
      }
    },
    avatar: {
      type: GraphQLString,
      description: 'URL to user avatar',
      resolve: (user => fromGravatar(user.email, 'thumbnailUrl'))
    },
    authoredCards: {
      type: cardConnection,
      description: 'Retrieve Cards made by user.',
      args: connectionArgs,
      resolve: (user, args) =>
        connectionFromPromisedArray(
          resolveArrayData(user.getAuthoredCards()),
          args
        )
    },
    authoredComments: {
      type: commentConnection,
      description: 'Retrieve comments posted by user.',
      args: connectionArgs,
      resolve: (user, args) =>
        connectionFromPromisedArray(
          resolveArrayData(user.getAuthoredComments()),
          args
        )
    },
    votes: {
      type: voteConnection,
      description: 'Retrieve votes posted by user.',
      args: connectionArgs,
      resolve: (user, args) =>
        connectionFromPromisedArray(resolveArrayData(user.getVotes()), args)
    },
    flags: {
      type: flagConnection,
      description: 'Retrieve flags posted by user.',
      args: connectionArgs,
      resolve: (user, args) =>
        connectionFromPromisedArray(resolveArrayData(user.getFlags()), args)
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: userConnection} =
  connectionDefinitions({nodeType: userType});

var flagType = new GraphQLObjectType({
  name: 'Flag',
  description: 'A flag object that is applied to posts, questions, ' +
  'answers, comments, etc',
  fields: () => ({
    id: globalIdField(),
    flagger: {
      type: userType,
      description: 'Identifies the user who owns the flag',
      resolve: flag => flag.getFlagger()
    },
    flaggable: {
      type: GraphQLString,
      description: 'Identifies the object type that has been flagged',
      resolve: flag => flag.flaggable
    },
    card: {
      description: 'Returns the Card that has been flagged or null ',
      type: cardType,
      resolve: flag => flag.getCard()
    },
    comment: {
      description: 'Returns the Comment that has been flagged or null ' +
      'if it is not a comment.',
      type: commentType,
      resolve: flag => flag.getComment()
    },
    name: {
      type: GraphQLString,
      description: 'The name of the flag..',
      resolve: flag => flag.name
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: flagConnection} =
  connectionDefinitions({nodeType: flagType});

var voteType = new GraphQLObjectType({
  name: 'Vote',
  description: 'A vote object that is applied to posts, questions, ' +
  'answers, comments, etc',
  fields: () => ({
    id: globalIdField(),
    voter: {
      type: userType,
      description: 'Identifies the user who owns the vote',
      resolve: vote => vote.getVoter()
    },
    votable: {
      type: GraphQLString,
      description: 'Identifies the object type that has been voteged',
      resolve: vote => vote.votable
    },
    card: {
      description: 'Returns the Card that has been voted or null ',
      type: cardType,
      resolve: vote => vote.getRequest()
    },
    comment: {
      description: 'Returns the Comment that has been voteged or null ' +
      'if it is not a comment.',
      type: commentType,
      resolve: vote => vote.getComment()
    },
    direction: {
      type: GraphQLString,
      description: 'Direction of vote, should be up down or neither.',
      resolve: vote => vote.direction
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: voteConnection} =
  connectionDefinitions({nodeType: voteType});


var CodePixAPI = new GraphQLObjectType({
  name: 'CodePixAPI',
  fields: () => ({
    id: globalIdField('CodePixAPI'),
    users: {
      description: 'Sitewide users',
      type: userConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(User), args)
    },
    comments: {
      description: 'Sitewide User comments',
      type: commentConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Comment), args)
    },
    tags: {
      description: 'Sitewide tags used for categorizing posts.',
      type: tagConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Tag), args)
    },
    votes: {
      description: 'Sitewide votes across the site.',
      type: voteConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Vote), args)
    },
    flags: {
      description: 'Sitewide flags across the site.',
      type: flagConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Flag), args)
    },
    cards: {
      description: 'Cards with Codepix',
      type: cardConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Card), args)
    },
    node: nodeField
  })
});


var Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    store: {
      type: CodePixAPI,
      resolve: () => 'API'
    },
    node: nodeField
  }
});



export default new GraphQLSchema({
  query: Root
});
