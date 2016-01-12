/**
 * Import Node Modules |||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */
import {
  express,
  path,
  favicon,
  cookieParser,
  bodyParser,
  compression,
  // expressPhantom,
  passport,
  session,
  FileStore,
  schema,
  graph,
  appConfig,
  dotenv
} from './modules';

/**
 * Import Routes  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */
import {
  apiRoute,
  rootRoute,
  authRoute
} from './routes';








// =============================================================================
//     ___               __               __  __
//    / _ \___ ___ _____/ /________ _____/ /_/ /  ___  ___
//   / , _/ -_) _ `/ __/ __/___/ _ `/___/ __/ _ \/ _ \/ _ \
//  /_/|_|\__/\_,_/\__/\__/    \_,_/    \__/_//_/\___/_//_/
//
//  https://github.com/MattMcFarland/reactathon
//
//  Inspired from https://github.com/sahat/hackathon-starter
// =============================================================================

// Globals
dotenv.load({ path: '.env.example' });


const app = express();
const staticPath = path.join(
  __dirname, '/public'
);
const jsPath = path.join(
  __dirname, '../bundles/js'
);
const stylePath = path.join(
  __dirname, '../bundles/style'
);
const store = new FileStore();
app.set('config', appConfig);







/*  App Setup  -------------------------------------------------------------  */
{

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  // compression setup
  const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
  };
  app.use(compression({level: 9, filter: shouldCompress}));

  // Using express-phantom to render javascript for search engines.
  // -- requires additional setup, disabled by default.
  // app.use(expressPhantom.SEORender);

  // Assuming it better to load favicon early on...
  app.use(favicon(path.join(staticPath, 'favicon.ico')));
}







/*  Server I/O  ------------------------------------------------------------  */
{

  // i/o middlewares
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    name: '_reactathon',
    resave: true,
    saveUninitialized: true,
    store
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}








/* Router setup  -----------------------------------------------------------  */
{




  // app.use(sessionInfo());

  app.use('/graphql', graph(req => ({
    schema,
    rootValue: { currentUser: req.user },
    pretty: true,
    graphiql: true
  })));

  // Static paths
  app.use(express.static(staticPath));
  app.use('/js', express.static(jsPath));
  app.use('/style', express.static(stylePath));

  // oAuth endpoints
  app.use('/auth', authRoute);
  // api endpoint
  app.use('/api', apiRoute);

  // root endpoint
  app.use('/', rootRoute);

}








/* Error handlers  ---------------------------------------------------------  */
{
  // Not to be confused with exception handling, these errors are for
  // outputting a response for caught exceptions only.

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });



  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }








  // production error handler
  // no stack-traces leaked to user
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

}










module.exports = app;
