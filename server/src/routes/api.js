import {
  express, fs, path
} from './modules';

import { login, signUp } from '../auth';

let apiRoute = express.Router();

// todo: create reset password route



apiRoute.get('/page/:page_id', function (req, res, next) {

  fs.readFile(path.join(__dirname, '../pages/' + req.params.page_id + '.md'),
    (err, data) => {
    if (err) {
      next(err);
    } else {
      res.send(data);
    }
  });

});

apiRoute.post('/login', login(), (req, res, next) => {
  next();
});

apiRoute.post('/logout', (req, res) => {
  req.logout();
  res.json({logout: true});
});

apiRoute.post('/signup', signUp(), (req, res, next) => {
  next();
});

export const api = apiRoute;
