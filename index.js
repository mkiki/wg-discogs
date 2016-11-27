/**
 * wg-discogs - NPM package entry point
 */
// (C) Alexandre Morin 2015 - 2016

const Discogs = require('./lib/discogs.js');

/**
 * Public interface
 */
module.exports = {
  Discogs: Discogs
};
