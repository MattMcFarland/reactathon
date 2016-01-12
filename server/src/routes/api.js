import {
  express
} from './modules';

import { login, signUp } from '../auth';

let apiRoute = express.Router();

// todo: create reset password route

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
