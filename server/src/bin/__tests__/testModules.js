import {
  http,
  https
} from '../modules';

import { expect } from 'chai';
import { describe, it } from 'mocha';

const OK = (obj) => {
  return expect(obj).to.not.be.an('undefined');
};

describe('server.js Module Dependencies', () =>{

  it('imports http', () => OK(http));

  it('imports https', () => OK(https));

});
