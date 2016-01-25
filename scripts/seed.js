process.env.NODE_ENV = 'development';

const _ = require('lodash');
const faker = require('faker');
const database = require('../server/src/database');

var { User, db } = database;

const seedDatabase = () => {
  return new Promise((resolve) => {
    return _.times(10, (i) => {
      return User.create({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        pictureUrl: faker.image.avatar(),
        website: faker.internet.url(),
        location: faker.address.city()
      }).then((person) => {
        return person.createAuthoredArticle({
          title: faker.company.catchPhrase(),
          content: faker.lorem.paragraphs()
        }).then(() => {
          if (i === 9) {
            resolve();
          }
        });
      });
    });
  });
};

const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      db.sync().then(() => {
        return seedDatabase().then(() => {
          resolve(db);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};


connect().then(() => {
  console.log('seeded successfully');
}).catch(err => console.error(err));
