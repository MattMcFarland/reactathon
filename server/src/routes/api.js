import {
  express, fs, path
} from './modules';

import {
  login,
  signUp,
  handleReset,
  forgot } from '../auth';

import {
  User
} from '../database';


let api = express.Router();


api.get('/page/:page_id', function (req, res, next) {

  fs.readFile(path.join(__dirname, '../pages/' + req.params.page_id + '.md'),
    (err, data) => {
    if (err) {
      next(err);
    } else {
      res.send(data);
    }
  });

});


api.post('/add-article', (req, res, next) => {
  if (!req.user) {
    var err = new Error('Unauthorized');
    err.status = 401;
    next(err);
  }
  User.findOne({ where: {id: req.user.id} }).then(user => {
    user.createAuthoredArticle({
      title: req.body.title,
      content: req.body.content
    }).then((newlyCreatedArticle) => {
      console.log(newlyCreatedArticle);
      res.json('win');
    });
  });
});

api.post('/reset', handleReset(), (req, res, next) => {
  next();
});

api.post('/forgot', forgot(), (req, res, next) => {
  next();
});

api.post('/login', login(), (req, res, next) => {
  next();
});

api.post('/logout', (req, res) => {
  req.logout();
  res.json({logout: true});
});

api.post('/signup', signUp(), (req, res, next) => {
  next();
});

export const apiRoute = api;
