/**
 * Moduile Dependencies
 */
import {
  md5,
  ajax } from './modules';


export const fromGravatar = (email, key) => {
  return new Promise((resolve) => {
    let hash = md5(email.toLowerCase());
    let uri = `http://www.gravatar.com/${hash}.json`;
    ajax.get(uri).end((err, res) => {
      if (err) {
        resolve('');
      } else {
        try {
          resolve(res.body.entry[0][key]);
        } catch (er) {
          resolve('');
        }
      }
    });
  });
};



