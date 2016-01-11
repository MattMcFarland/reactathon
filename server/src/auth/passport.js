import {
  passport,
  LocalStrategy,
  crypto
} from './modules';

import {
  User
} from '../database';

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

export const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

export function getUser() {
  return function (req, res, next) {
    console.log(req.session);
    passport.authenticate('local', function (err, user, info) {
      console.log(err, user, info);
      next();
    })(req, res, next);
  };
}

export function onAuthenticate() {
  return function (req, res, next) {
    console.log('\n', req.body, '\n');
    passport.authenticate('local', function (err, user, info) {
      console.log(err, info);
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
        res.json(user);
      });
    })(req, res, next);
  };
}


export function login() {
  return function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      console.log(err, info);
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
    User.create({
      username,
      password: hash(password),
      email: email
    }).then((user) => resolve(user)).catch(err => reject(err));
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



