/**
 * Import Node Modules |||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */
import {
  express,
  path,
  favicon,
  cookieParser,
  bodyParser,
  compression,
  expressPhantom,
  passport,
  session,
  FileStore,
  schema,
  graph
} from './modules';

/**
 * Import Routes  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 */
import {
  api,
  root
} from './routes';


// ===========================================================================
//                 _            _
//    ___ ___   __| | ___ _ __ (_)_  __
//   / __/ _ \ / _` |/ _ \ '_ \| \ \/ /
//  | (_| (_) | (_| |  __/ |_) | |>  <
//   \___\___/ \__,_|\___| .__/|_/_/\_\
//                       |_|                                        app.js
// ============================================================================

// Globals
const app = express();
const staticpath = path.join(
  __dirname, '../node_modules/codepix-client/lib/public'
);
const store = new FileStore();

/*  App Setup  ----------------------------------------------------------- */
{

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  // compression setup
  const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      console.log('no compression');
      return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
  };
  app.use(compression({level: 9, filter: shouldCompress}));

  // Using express-phantom to render javascript for search engines.
  app.use(expressPhantom.SEORender);

  // Assuming it better to load favicon early on...
  app.use(favicon(path.join(staticpath, 'favicon.ico')));
}

/*  Server I/O  ---------------------------------------------------------- */
{

  // i/o middlewares
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    secret: 'K7@*{GwHdq1@+ChhB%|M|r$1JkW|15ip^Kwguq#^ETD',
    name: '_codepix',
    resave: true,
    saveUninitialized: true,
    store
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

/* Router setup  --------------------------------------------------------- */
{

  // app.use(sessionInfo());

  app.use('/graphql', graph(req => ({
    schema,
    rootValue: { currentUser: req.user },
    pretty: true,
    graphiql: true
  })));

  // Static paths
  app.use(express.static(staticpath));
  app.use('/c0dez/data', express.static('data'));

  // api endpoint
  app.use('/api', (req, res, next) => {
    if (app.get('rasterizer')) {
      req.rasterizer = app.get('rasterizer');
    }
    next();
  });
  app.use('/api', api);

  // root endpoint
  app.use('/', root);

}

/* Error handlers */
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
