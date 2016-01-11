import {
  express,
  path,
  favicon,
  logger,
  cookieParser,
  bodyParser
} from '../modules';

import { expect } from 'chai';
import { describe, it } from 'mocha';

const OK = (obj) => {
  return expect(obj).to.not.be.an('undefined');
};

describe('app.js Module Dependencies', () =>{

  it('imports express', () => OK(express));

  it('imports path', () => OK(path));

  it('imports favicon', () => OK(favicon));

  it('imports logger', () => OK(logger));

  it('imports cookieParser', () => OK(cookieParser));

  it('imports bodyParser', () => OK(bodyParser));

});
