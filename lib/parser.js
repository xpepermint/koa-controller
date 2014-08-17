'use strict';

/**
 * Parser for `route` and `task` strings.
 *
 * @api public
 */

module.exports = {

  /*
   * Parses the `method` from a `route string` (e.g. `get /users/:id`). Note
   * that multiple methods are allowed.
   *
   * @param {string} str
   * @return {Array}
   */

  parseMethods: function(str) {
    let parts = str.split(' ');
    return parts[1] ? parts[0].toLowerCase().split('|') : ['get'];
  },

  /*
   * Parses the `path` from a `route string` (e.g. `get /users/:id`).
   *
   * @param {string} str
   * @return {string}
   */

  parsePath: function(str) {
    let parts = str.split(' ');
    return parts[1] || parts[0] || '/';
  },

  /*
   * Returns the type of a `task string` (e.g. `controller#action`).
   *
   * @param {string} str
   * @return {string}
   */

  guessTask: function(str) {
    if (typeof str == 'function') {
      return 'function';
    }
    else if (str.split('#').length==2) {
      return 'controller';
    }
    else if (['http:', 'https:', 'ftp:'].indexOf(str.split('/')[0]) != -1 || str[0] == '/') {
      return 'redirect';
    }
    return 'unknown';
  },

  /*
   * Parses the `controller` and `action` name from a `task string`
   * (e.g. `controller#action`).
   *
   * @param {string} str
   * @return {object}
   */

  parseController: function (str) {
    let parts = str.split('#');
    return { controller: parts[0], action: parts[1] };
  }

};
