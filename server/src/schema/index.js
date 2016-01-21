import {
  Article,
  Comment,
  Flag,
  Tag,
  User,
  Vote
} from '../database';

import {
  fromGravatar
} from '../utils';

import {
  GraphQLNonNull,
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



var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    switch (type) {
      case 'Article':
        return Article.findByPrimary(id);
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
      case 'articleType':
        return articleType;
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

var articleType = new GraphQLObjectType({
  name: 'Article',
  description: 'This is a description',
  fields: () => ({
    id: globalIdField(),
    dateCreated: {
      type: GraphQLString,
      resolve: article => article.createdAt
    },
    dateModified: {
      type: GraphQLString,
      resolve: article => article.updatedAt
    },
    title: {
      type: GraphQLString,
      description: 'User defined title of the article',
      resolve: article => article.title
    },
    description: {
      type: GraphQLString,
      description: 'User defined description of the article ',
      resolve: article => article.description
    },
    content: {
      description: 'Code that is in the pic',
      type: GraphQLString,
      resolve: article => article.content
    },
    shareUrl: {
      type: GraphQLString,
      resolve: article => article.shareUrl
    },
    imageUrl: {
      type: GraphQLString,
      resolve: article => article.imageUrl
    },
    size: {
      type: GraphQLInt,
      resolve: article => article.size
    },
    width: {
      type: GraphQLInt,
      resolve: article => article.width
    },
    height: {
      type: GraphQLInt,
      resolve: article => article.height
    },
    visibility: {
      type: GraphQLString,
      resolve: article => article.visibility
    },
    score: {
      type: GraphQLInt,
      resolve: article => article.score
    },
    downVoteCount: {
      type: GraphQLInt,
      resolve: article => article.downVoteCount
    },
    upVoteCount: {
      type: GraphQLInt,
      resolve: article => article.upVoteCount
    },
    author: {
      type: userType,
      resolve: article => article.getAuthor()
    },
    editor: {
      type: userType,
      resolve: article => article.getEditor()
    },
    shasum: {
      type: GraphQLString,
      resolve: article => article.shasum
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: articleConnection} =
  connectionDefinitions({nodeType: articleType});


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
    article: {
      description: 'Returns the Article that has been commented ',
      type: articleType,
      resolve: comment => comment.getArticle()
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
    articles: {
      type: articleConnection,
      description: 'list of articles this tag is connected to.',
      args: connectionArgs,
      resolve: (tag, args) =>
        connectionFromPromisedArray(resolveArrayData(tag.getArticles()), args)
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
    dateCreated: {
      type: GraphQLString,
      resolve: user => user.createdAt
    },
    dateModified: {
      type: GraphQLString,
      resolve: user => user.updatedAt
    },
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
    github: {
      type: GraphQLString,
      description: 'Github Reference ID',
      resolve: (user => user.github)
    },
    google: {
      type: GraphQLString,
      description: 'Google Reference ID',
      resolve: (user => user.google)
    },
    twitter: {
      type: GraphQLString,
      description: 'Twitter Reference ID',
      resolve: (user => user.twitter)
    },
    facebook: {
      type: GraphQLString,
      description: 'Facebook reference ID',
      resolve: (user => user.facebook)
    },
    reddit: {
      type: GraphQLString,
      description: 'Github Reference ID',
      resolve: (user => user.reddit)
    },
    pictureUrl: {
      type: GraphQLString,
      description: 'Github ID',
      resolve: (user => user.pictureUrl)
    },
    website: {
      type: GraphQLString,
      resolve: (user => user.website)
    },
    location: {
      type: GraphQLString,
      resolve: (user => user.location)
    },
    authoredArticles: {
      type: articleConnection,
      description: 'Retrieve Articles made by user.',
      args: connectionArgs,
      resolve: (user, args) =>
        connectionFromPromisedArray(
          resolveArrayData(user.getAuthoredArticles()),
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
    article: {
      description: 'Returns the Article that has been flagged or null ',
      type: articleType,
      resolve: flag => flag.getArticle()
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
    article: {
      description: 'Returns the Article that has been voted or null ',
      type: articleType,
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


var GraphAPI = new GraphQLObjectType({
  name: 'GraphAPI',
  fields: () => ({
    id: globalIdField('GraphAPI'),
    users: {
      description: 'Sitewide users',
      type: userConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(User), args)
    },
    user: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (obj, { id }) => (User.findById(id))
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
    articles: {
      description: 'Articles',
      type: articleConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Article), args)
    },
    node: nodeField
  })
});





var Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphAPI,
      resolve: () => 'API'
    },
    user: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (obj, { id }) => (User.findById(id))
    },
    node: nodeField
  }
});



export default new GraphQLSchema({
  query: Root
});

