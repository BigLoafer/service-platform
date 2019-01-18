import shortid from 'shortid';
import { UAParser } from 'ua-parser-js';

export const isChrome = () => {
  return new UAParser().getBrowser().name === 'Chrome';
};

export const isWin = () => {
  return new UAParser().getOS().name === 'Windows';
};

export const generateUniqueneId = () => {
  return shortid.generate();
};

export * from './getUrlParam';
