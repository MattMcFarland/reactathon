import {
  express,
  appConfig
} from './modules';

const rootRoute = express.Router();

/* GET home page. */

rootRoute.get('*', function (req, res) {
  res.render('root', {
    title: appConfig.www.title,
    description: appConfig.www.description,
    url: req.url,
    user: req.user ? JSON.stringify(req.user) : ''
  });
});


export const root = rootRoute;

