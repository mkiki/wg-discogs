/**
 * wg-discogs - Discogs API
 *
 * The Discogs API v2.0 is a RESTful interface to Discogs data. You can access JSON-formatted information about Database objects such as Artists, Releases, and Labels.
 * Your application can also manage User Collections and Wantlists, create Marketplace Listings, and more.
 *
 * https://www.discogs.com/developers/index.html
 */
// (C) Alexandre Morin 2015 - 2016

const Log = require('wg-log').Log;
const Exception = require('wg-log').Exception;
const utils = require('wg-utils');
const https = require('https');
const url = require('url');
const fs = require('fs');

const log = Log.getLogger('wg-discogs');
const logCalls = Log.getLogger('wg-discogs::calls');


/** ================================================================================
  * Type definitions
  * ================================================================================ */


/**
 * @typedef Release
 *
 * @property {string[]} style - A list of syles for this release. Ex: ["Black Metal", "Death Metal"],
 * @property {string} thumb - The URL to the thumbnail image. Ex: https://api-img.discogs.com/rYq-RDtA503SUrt-y40hUAoofFk=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-679234-1146818572.jpeg.jpg
 * @property {string[]} format - The release format. Ex: ["CD", "Album"]
 * @property {string} country - The release country. Ex: "France"
 * @property {string[]} barcode - Example: ["3700132600549", "DOCdata FRANCE CDAR054"]
 * @property {string} uri - The release details URL. Ex: /Benighted-Psychose/release/679234
 * @property {string} country - The release country. Ex: "France"
 * @property {Object} community
 * @property {string[]} label - The release album label. Ex: ["Adipocere Records"]
 * @property {string} catno
 * @property {string} year - The release year. Ex: "2002"
 * @property {string[]} genre - The release genre(s). Ex: ["Rock"]
 * @property {string} title - The release title. Ex: "Benighted - Psychose"
 * @property {string} resource_url - The release resource URL. Ex: "https://api.discogs.com/releases/679234"
 * @property {string} type - The release type. Ex: "release"
 * @property {number} id - The release Discogs identifier
 */


/**
 * @typedef Artist
 *
 * @property {string[]} title - The artist name
 * @property {string} thumb - The URL to the thumbnail image. Ex: https://api-img.discogs.com/rYq-RDtA503SUrt-y40hUAoofFk=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-679234-1146818572.jpeg.jpg
 * @property {string[]} uri - 
 * @property {string} resource_url - 
 * @property {number} id - The release Discogs identifier
 */


/**
 * Creates a Discogs API object
 */
var Discogs = function(key, secret) {
  this.key = key;
  this.secret = secret;
}

/**
 * Search a release
 * @param {string} artist - is the artist name
 * @param {string} album - is the album name
 * @param {Release[]} - a list of releases matching the artist and album
 */
Discogs.prototype.searchReleases = function(artist, album, callback) {
  var that = this;
  var u = 'https://api.discogs.com/database/search' 
    + '?type=release'
    + '&release_title=' + encodeURIComponent(album)
    + '&artist=' + encodeURIComponent(artist);
  u = url.parse(u);
  var options = {
    hostname: u.hostname,
    port: 443,
    method: 'GET',
    path: u.path,
    headers: {
      'user-agent': 'PhotosDiscogsClient/1.0',
      'Authorization': 'Discogs key=' + that.key + ', secret=' + that.secret
    }
  };
  logCalls.info({request:options}, "Calling Discogs (searching for realease)");
  var req = https.request(options, function(res) {
    var result = "";
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      result = result + chunk;
    });
    res.on('end', function() {
      var json = JSON.parse(result);
      if (json && json.results) {
        json = json.results;
      }
      return callback(undefined, json);
    });
    res.on('error', function(err) {
      return callback(new Exception({url:u}, "Failed to call Discogs search API", err));
    });
  });
  req.end();
  req.on('error', function(err) {
    return callback(new Exception({url:u}, "Failed to call Discogs search API (2)", err));
  });
}

/**
 * Get the album art for a Discogs thumb
 * @param {string} u - is the thumbnail URL. Ex: https://api-img.discogs.com/rYq-RDtA503SUrt-y40hUAoofFk=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-679234-1146818572.jpeg.jpg
 * @param {WritableStream} wstream - is the stream to write the data to
 */
Discogs.prototype.getAlbumArt = function(u, wstream, callback) {
  var that = this;
  u = url.parse(u);
  var options = {
    hostname: u.hostname,
    port: 443,
    method: 'GET',
    path: u.path,
    headers: {
      'user-agent': 'PhotosDiscogsClient/1.0',
      'Authorization': 'Discogs key=' + that.key + ', secret=' + that.secret
    }
  };
  logCalls.info({request:options}, "Calling Discogs (fetching image)");
  var req = https.request(options, function(res) {
    res.on('data', function(chunk) {
      wstream.write(chunk);
    });
    res.on('end', function() {
      return callback(undefined);
    });
    res.on('error', function(err) {
      return callback(new Exception({url:u}, "Failed to call Discogs image API", err));
    });
  });
  req.end();
  req.on('error', function(err) {
    return callback(new Exception({url:u}, "Failed to call Discogs image API (2)", err));
  });
}

/**
 * Search for artists
 * @param {string} artist - is the artist name
 * @param {string} album - is the album name
 * @param {Artist[]} - a list of artist matching the search string
 */
Discogs.prototype.searchArtists = function(artist, callback) {
  var that = this;
  var u = 'https://api.discogs.com/database/search' 
    + '?type=artist'
    + '&title=' + encodeURIComponent(artist);
  u = url.parse(u);
  var options = {
    hostname: u.hostname,
    port: 443,
    method: 'GET',
    path: u.path,
    headers: {
      'user-agent': 'PhotosDiscogsClient/1.0',
      'Authorization': 'Discogs key=' + that.key + ', secret=' + that.secret
    }
  };
  logCalls.info({request:options}, "Calling Discogs (searching for artists)");
  var req = https.request(options, function(res) {
    var result = "";
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      result = result + chunk;
    });
    res.on('end', function() {
      var json = JSON.parse(result);
      if (json && json.results) {
        json = json.results;
      }
      return callback(undefined, json);
    });
    res.on('error', function(err) {
      return callback(new Exception({url:u}, "Failed to call Discogs search API", err));
    });
  });
  req.end();
  req.on('error', function(err) {
    return callback(new Exception({url:u}, "Failed to call Discogs search API (2)", err));
  });
}

/**
 * Public interface
 */
module.exports = Discogs;


/*
return test(function(err) {
  if (err) {
    log.error(err);
  }
});

function test(callback) {
  var d = new Discogs("mzlbfSoHhDpLzDqlJQnl", "CJblldgSAPiBGGvKnCcZcSIyQLGrfGjT");
  return d.searchReleases("Benighted", "Psychose", function(err, releases) {
    if (err) return callback(err);
    log.info(releases);
    var thumb = releases[0].thumb;
    var ext = utils.getExtension(thumb);
    var wstream = fs.createWriteStream('myOutput.' + ext);
    return d.getAlbumArt(thumb, wstream, function(err) {
      if (err) return callback(err);
      wstream.end();
      return callback();
    });
  });
}

*/

/*

return test(function(err) {
  if (err) {
    log.error(err);
  }
});

function test(callback) {
  var d = new Discogs("mzlbfSoHhDpLzDqlJQnl", "CJblldgSAPiBGGvKnCcZcSIyQLGrfGjT");
  return d.searchArtists("Benighted", function(err, artists) {
    debugger;
    if (err) return callback(err);
    log.info(artists);
    var thumb = artists[0].thumb;
    var ext = utils.getExtension(thumb);
    var wstream = fs.createWriteStream('myOutput.' + ext);
    return d.getAlbumArt(thumb, wstream, function(err) {
      if (err) return callback(err);
      wstream.end();
      return callback();
    });
  });
}


*/
