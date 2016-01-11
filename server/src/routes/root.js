import {
  express
} from './modules';

const rootRoute = express.Router();

/* GET home page. */
rootRoute.get('/code/*', function (req, res) {
  var image_url = 'http://codepix.io/c0dez/data/' +
    req.path.split('/')[2] + '.png';
  var url = 'http://codepix.io' +
    req.path;

  res.render('root', {
    title: 'codepix.io',
    image_url,
    url,
    user: req.user ? JSON.stringify(req.user) : ''
  });

});

rootRoute.get('*', function (req, res) {
  res.render('root', {
    title: 'codepix.io',
    url: req.url,
    user: req.user ? JSON.stringify(req.user) : ''
  });
});


export const root = rootRoute;

