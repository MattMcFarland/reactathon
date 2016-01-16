import {
  _,
  passport,
  request,
  LocalStrategy,
  crypto,
  FacebookStrategy,
  TwitterStrategy,
  GitHubStrategy,
  GoogleStrategy,
  OpenIDStrategy,
  RedditStrategy,
  config
} from './modules';

import {
  User
} from '../database';

import {
  getGravatar
} from '../utils';


const hash = (pwd) => {
  return crypto
    .createHash('sha1')
    .update(pwd)
    .digest('hex');
};


// Serialized and deserialized methods when got from session
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});


/* Facebook */ {
  passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_ID,
    clientSecret: config.FACEBOOK_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL,
    profileFields: ['name', 'email', 'link'],
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
      User.findOne(
        {where: {facebook: profile.id}}).then(alreadyExists => {
        if (alreadyExists) {
          return done();
        }
        User.findOne({ where: {id: req.user.id} }).then(user => {
          user.facebook = profile.id;
          user.createToken({kind: 'facebook', accessToken});
          user.save().then(done);
        });
      });
    } else {
      User.findOne(
        {where: {facebook: profile.id}}).then(existingUser => {
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({
          where: { email: profile._json.email }}).then(emailExists => {
          if (emailExists) {
            console.log('email already exists');
            // There is already a user that has this email in the db.
            return done();
          }
          User.create({
            facebook: profile.id,
            email: profile._json.email
          }).then(newUser => {
            newUser.createToken({kind: 'facebook', accessToken});
            done();
          });
        });
      });
    }
  }));
}

/* Reddit */ {
  passport.use(new RedditStrategy({
    clientID: config.REDDIT_ID,
    clientSecret: config.REDDIT_SECRET,
    callbackURL: config.REDDIT_CALLBACK_URL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    console.log('reddit', JSON.stringify(profile, null, 2));
    if (req.user) {
      User.findOne(
        {where: {reddit: profile.id}}).then(alreadyExists => {
        if (alreadyExists) {
          return done();
        }
        User.findOne({ where: {id: req.user.id} }).then(user => {
          user.reddit = profile.id;
          user.createToken({kind: 'reddit', accessToken});
          user.save().then(done);
        });
      });
    } else {
      User.findOne(
        {where: {reddit: profile.id}}).then(existingUser => {
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({
          where: { email: profile._json.email }}).then(emailExists => {
          if (emailExists) {
            // There is already a user that has this email in the db.
            return done();
          }
          User.create({
            reddit: profile.id,
            email: profile._json.email
          }).then(newUser => {
            newUser.createToken({kind: 'reddit', accessToken}).then(() => {
              done();
            });
          });
        });
      });
    }
  }));
}

/* Github */ {
  passport.use(new GitHubStrategy({
    clientID: config.GITHUB_ID,
    clientSecret: config.GITHUB_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
      User.findOne(
        {where: {github: profile.id}}).then(alreadyExists => {
        if (alreadyExists) {
          // Github user is already registered.
          return done();
        }
        User.findOne({ where: {id: req.user.id} }).then(user => {
          user.github = profile.id;
          user.pictureUrl = user.pictureUrl || profile._json.avatar_url;
          user.location = user.location || profile._json.location;
          user.website = user.website || profile._json.blog;
          user.createToken({kind: 'github', accessToken}).then(() => {
            user.save().then(done);
          });
        });
      });
    } else {
      User.findOne(
        {where: {github: profile.id}}).then(existingUser => {
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({
          where: { email: profile._json.email }}).then(emailExists => {
          if (emailExists) {
            // There is already a user that has this email in the db.
            return done();
          }
          User.create({
            github: profile.id,
            displayName: profile.displayName,
            email: profile._json.email,
            pictureUrl: profile._json.avatar_url,
            location: profile._json.location,
            website: profile._json.blog
          }).then(newUser => {
            newUser.createToken({kind: 'github', accessToken}).then(() => {
              done(newUser);
            });
          });
        });
      });
    }
  }));

}

/* Twitter */ {
  passport.use(new TwitterStrategy({
    consumerKey: config.TWITTER_KEY,
    consumerSecret: config.TWITTER_SECRET,
    callbackURL: config.TWITTER_CALLBACK_URL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
      User.findOne(
        {where: {twitter: profile.id}}).then(alreadyExists => {
        if (alreadyExists) {
          return done();
        }
        User.findOne({ where: {id: req.user.id} }).then(user => {
          user.twitter = profile.id;
          user.displayName = user.displayName || profile.displayName;
          user.username = user.username || profile.username;
          user.location = user.location || profile._json.location;
          user.pictureUrl =
            user.pictureUrl || profile._json.profile_image_url_https;
          user.save().then((savedUser) => {
            savedUser.createToken({kind: 'twitter', accessToken}).then(() => {
              done(savedUser);
            });
          });
        });
      });
    } else {
      User.findOne(
        {where: {twitter: profile.id}}).then(existingUser => {
        if (existingUser) {
          return done(null, existingUser);
        }
        User.create({
          twitter: profile.id,
          displayName: profile.displayName,
          location: profile._json.location,
          username: profile.username,
          pictureUrl: profile._json.profile_image_url_https,
          email: profile.username + '@twitter.com'
        }).then(newUser => {
          newUser.createToken({kind: 'twitter', accessToken}).then(() => {
            done(newUser);
          });
        });
      });
    }
  }));
}

/* Google */ {
  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_ID,
    clientSecret: config.GOOGLE_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {

    if (req.user) {
      User.findOne(
        {where: {google: profile.id}}).then(alreadyExists => {
        if (alreadyExists) {
          console.log('already exists');
          return done();
        }
        User.findOne({ where: {id: req.user.id} }).then(user => {
          console.log('update user');
          user.set('google', profile.id);
          user.set('displayName', user.displayName || profile.displayName);
          user.set('pictureUrl', user.pictureUrl || profile._json.image.url);
          user.save().then((savedUser) => {
            console.log('user saved, creating access token');
            savedUser.createToken({kind: 'google', accessToken}).then(() => {
              console.log('token created');
              done(savedUser);
            });
          });
        });
      });
    } else {
      User.findOne(
        {where: {google: profile.id}}).then(existingUser => {
        if (existingUser) {
          console.log('user already exists');
          return done(null, existingUser);
        }
        User.findOne({
          where: { email: profile.emails[0].value }}).then(emailExists => {
          if (emailExists) {
            console.log('user email already exists');
            // There is already a user that has this email in the db.
            return done();
          }
          User.create({
            google: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            pictureUrl: profile._json.image.url
          }).then(newUser => {
            console.log('new user created');
            newUser.createToken({kind: 'google', accessToken}).then(() => {
              done(newUser);
            });
          });
        });
      });
    }
  }));
}


/* Steam */ {
  passport.use(new OpenIDStrategy({
    apiKey: config.STEAM_KEY,
    providerURL: 'http://steamcommunity.com/openid',
    returnURL: config.STEAM_CALLBACK_URL,
    realm: 'http://localhost:3000/',
    stateless: true
  }, function (identifier, done) {
    var steamId = identifier.match(/\d+$/)[0];
    var profileURL =
      'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' +
      config.STEAM_KEY + '&steamids=' + steamId;

    User.findOne({ steam: steamId }, (err, existingUser) => {
      if (existingUser) {
        return done(err, existingUser);
      }
      request(profileURL, (error, response) => {
        if (!error && response.statusCode === 200) {
          User.create({
            steam: steamId,
            email: steamId + '@steam.com'
          }).then(user => {
            user.createToken({
              kind: 'steam',
              accessToken: steamId
            });
            user.save().then(done);
          });
        } else {
          done(error, null);
        }
      });
    });
  }));
}



export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}

export function isAuthorized(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
}


passport.use('local', new LocalStrategy(
  function (username, password, done) {
    User.find({ where: { username: username } }).then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (hash(password) !== user.password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).catch(done);
  }
));


export function login() {
  return function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      // console.log(err, info);
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401);
        res.json(info);
        return next();
      }
      req.logIn(user, function (loginErr) {
        if (loginErr) {
          return next(loginErr);
        }
        res.json({user, message: 'success'});
      });
    })(req, res, next);
  };
}


function createUser({username, password, email}) {
  return new Promise((resolve, reject) => {

    getGravatar(email).then(data => {
      User.create({
        username,
        password: hash(password),
        email: email,
        pictureUrl: data.thumbnailUrl || '',
        displayName: data.displayName || username
      }).then((user) => resolve(user)).catch(err => reject(err));
    });
  });
}


export function signUp() {
  return function (req, res, next) {
    User.count().then(count => {
      if (typeof count === 'number' && count > 0) {
        User.findOne(
          { where: { username: req.body.username } }
        ).then(taken => {
          if (taken) {
            res.status(401);
            return res.json({message: 'username already exists'});
          }
          createUser(req.body).then(user => {
            req.logIn(user, err => {
              if (err) {
                return next(err);
              }
              res.json({user, message: 'success'});
            });
          }).catch(bad => next(bad));
        }).catch(err => next(err));
      } else {
        createUser(req.body).then(user => {
          req.logIn(user, err => {
            if (err) {
              return next(err);
            }
            res.json({user, message: 'success'});
          });
        }).catch(err => next(err));
      }
    });
  };
}



