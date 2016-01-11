import {
  express,
  hljs,
  Chance,
  fs,
  path

} from './modules';

import { login, signUp } from '../auth';

import { User, Card } from '../database';

let apiRoute = express.Router();

apiRoute.get('/code/:id', (req, res) => {
  Card.findOne({
    where: { shasum: req.params.id }
  }).then(card => {
    if (!card) {
      let data = require('../../data/' + req.params.id + '.png.meta.json');
      res.json(data);
    } else {
      res.json(card);
    }
  }).catch(() => {
    let data = require('../../data/' + req.params.id + '.png.meta.json');
    res.json(data);
  });
});

apiRoute.get('/list', (req, res, next) => {

  fs.readdir(path.join(__dirname,'../../data'), (err, files) => {
    let data = [];

    if (err) {
      next(err);
      return;
    }

    files.forEach((file, i) => {

      if (file.indexOf('json') > -1 ) {
        let fileData = require(path.join(__dirname,'../../data', file));
        data.push(fileData);
        if (i === files.length - 1) {
          res.json(data);
        }
      }
    });

  });


});

apiRoute.post('/add', function (req, res, next) {
  if (req.rasterizer) {
    let chance = new Chance();
    let hash = chance.hash();
    req.rasterizer.rasterizeCode(req.body.code,
        'data/' + hash + '.png')
      .then((file) => {
        req.codepic = file;
        next();
      }).catch(err => {
      console.error(err);
    });
  } else {
    next();
  }
});

const getCardInstructions = (req) => {
  console.log('4. starting the card factory');

  return {
    shasum: req.codepic.shasum,
    title: req.body.title || 'I made this with codepix.io',
    description: req.body.description || 'Check it out',
    content: req.body.code,
    shareUrl: 'http://codepix.io/code/' + req.codepic.shasum,
    imageUrl: 'http://codepix.io/c0dez/data/' + req.codepic.shasum + '.png',
    size: req.codepic.size,
    width: req.codepic.dimensions.width,
    height: req.codepic.dimensions.height,
    visibility: req.body.visibility
  };
};


apiRoute.post('/add', (req, res, next) => {
  console.log('1. add Card Instruction received.');
  const setupCard = (newCard => {
    console.log('5. Sending Resolved Promise of card to next middleware.');
    console.log(newCard);
    req.newCard = newCard;
    next();
  });
  if (req.user) {
    console.log('2. found user');
    User.findById(req.user.id).then(user => {
      console.log('3. prepare to create card');
      if (user) {
        user.createAuthoredCard(getCardInstructions(req))
          .then(card => setupCard(card));
      } else {
        Card.create(getCardInstructions(req)).then(card => setupCard(card));
      }
    }).catch(next);
  } else {
    Card.create(getCardInstructions(req)).then(card => setupCard(card));
  }
});


apiRoute.post('/add', (req, res, next) => {
  console.log('6. Prepare to add tags to card');
  console.log(req.codepic);
  console.log(req.body.visibility);
  if (!req.newCard) {
    console.log('no card found');
    return next();
  }
  if (req.codepic.language || req.codepic.detectedLanguage) {
    console.log('7. Card exists, adding tag', req.codepic.language ||
      req.codepic.detectedLanguage );
    req.newCard.createTag({
      name: req.codepic.language || req.codepic.detectedLanguage
    }).then(() => {
      return res.json(req.newCard);
    });
  } else {
    res.json(req.newCard);
  }
});

apiRoute.post('/', function (req, res, next) {
  try {
    let { code } = req.body;
    let parsed = hljs.highlightAuto(code);
    res.render('canvas', {
      title: 'codepic',
      description: 'your code',
      codez: parsed.value
    });

  } catch (err) {
    next(err);
  }

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
