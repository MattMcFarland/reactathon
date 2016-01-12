import {
  express, fs, path
} from './modules';

import { login, signUp } from '../auth';

let api = express.Router();

// todo: create reset password route



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
