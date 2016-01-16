import {
  express,
  passport
} from './modules';

const auth = express.Router();


/* Facebook */ {
  auth.get('/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_location']
    })
  );
  auth.get('/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'}), (req, res) => {
    res.redirect(req.session.returnTo || '/dashboard');
  });
}

/* Github */ {
  auth.get('/github',
    passport.authenticate('github')
  );
  auth.get('/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/dashboard');
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
      failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/dashboard');
  });
}

/* Twitter */ {
  auth.get('/twitter',
    passport.authenticate('twitter')
  );
  auth.get('/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/dashboard');
  });
}

/* Reddit */ {
  auth.get('/reddit',
    passport.authenticate('reddit')
  );
  auth.get('/reddit/callback',
    passport.authenticate('reddit', {
      failureRedirect: '/login' }), (req, res) => {
      res.redirect(req.session.returnTo || '/dashboard');
    });
}


/* LinkedIn */ {
  auth.get('/linkedin',
    passport.authenticate('linkedin', {
      state: 'SOME STATE' })
  );
  auth.get('/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/dashboard');
  });
}


export const authRoute = auth;
