import {
  fs,
  appConfig,
  path,
  Sequelize,
} from '../modules';

// console.log('appConfig', appConfig);
// console.log('congrats u updated file right');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = appConfig.sequelize[env];

var db = {};
// console.log('instantiate Sequelize');
var sequelize = (config.use_env_variable ?
  new Sequelize(process.env[config.use_env_variable]) :
  new Sequelize(config.database, config.username, config.password, config)
);




fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) &&
      (file !== basename) &&
      (file.slice(-3) === '.js');
  })
  .forEach(function (file) {
    // console.log('importing', file);
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    // console.log('creating associates for', modelName);
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
