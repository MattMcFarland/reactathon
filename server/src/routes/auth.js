import {
  express,
  passport
} from './modules';

import {
  User
} from '../database';

const auth = express.Router();


/* Facebook */ {
  auth.get('/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_location']
    })
  );
  auth.get('/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/dashboard'}), (req, res) => {
      console.log('facebook authenticated');
    res.redirect('/dashboard');
  });
}

/* Github */ {
  auth.get('/github',
    passport.authenticate('github')
  );
  auth.get('/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/dashboard' }), (req, res) => {
    res.redirect('/dashboard');
  });
}

/* Google */ {
  auth.get('/google',
    passport.authenticate('google', {
      scope: 'profile email'
    })
  );
  auth.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/dashboard' }), (req, res) => {
    res.redirect('/dashboard');
  });
}

/* Twitter */ {
  auth.get('/twitter',
    passport.authenticate('twitter')
  );
  auth.get('/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/dashboard' }), (req, res) => {
    res.redirect('/dashboard');
  });
}

/* Reddit */ {
  auth.get('/reddit',
    passport.authenticate('reddit')
  );
  auth.get('/reddit/callback',
    passport.authenticate('reddit', {
      failureRedirect: '/dashboard' }), (req, res) => {
      res.redirect('/dashboard');
    });
}


/* LinkedIn */ {
  auth.get('/linkedin',
    passport.authenticate('linkedin', {
      state: 'SOME STATE' })
  );
  auth.get('/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/dashboard' }), (req, res) => {
    res.redirect('/dashboard');
  });
}

/* Unlink */ {
  auth.get('/unlink/:provider', (req, res, next) => {
    let { provider } = req.params;
    User.findOne({ where: {id: req.user.id} }).then(user => {
      user.set(provider, null);
      // console.log(user);
      console.log('provider', provider, '=', user.get(provider));

      user.getTokens().then(tokenList => {
        console.log('tokens:', tokenList.length);
      });
      user.getTokens({ where: {kind: provider}}).then(tokenToRemove => {
        if (!tokenToRemove) {
          console.error('uh oh cannot find token for', provider);
        }
        user.removeToken(tokenToRemove).then(() => {
          user.save().then(() => res.redirect('/dashboard'))
            .catch(err => next(err));
        });
      });
    });
  });
}
export const authRoute = auth;
