'use strict';

/**
 * Module dependencies.
 */

let parser = require('./parser');
let lodash = require('lodash');
let compose = require('koa-compose');
let route = require('koa-route');

/**
 * Koa middleware for handling routes.
 *
 * @param {object} options
 * @return {generator}
 * @api public
 */

module.exports = function(opts) {

  /*
   * Configuration options.
   */

  let options = lodash.merge({
    'configPath': 'config/routes.js',
    'controllerPath': 'app/controllers/{controller}.js'
  }, opts);

  /*
   * Routes config.
   */

  let config = require(options.configPath);

  /*
   * Returns a route task.
   *
   * @param {string} route
   * @return {generator}
   */

  function routeTask(str) {
    switch(parser.guessTask(str)) {
      case 'function':
        return str;
      case 'controller':
        var data = parser.parseController(str);
        return require(options.controllerPath.replace('{controller}', data.controller))[data.action];
      case 'redirect':
        return function *() { this.redirect(str) };
    }
    throw new Error('invalid route task');
  }

  /*
   * Returns an array of `koa-route` objects.
   *
   * @param {string} route
   * @return {array}
   */

  function buildRoutes(config) {
    let routes = [];
    Object.keys(config).forEach(function(key) {
      let methods = parser.parseMethods(key);
      let path = parser.parsePath(key);
      let task = routeTask(config[key]);
      methods.forEach(function(method) {
        routes.push(route[method](path, task));
      });
    });
    return routes;
  }

  /*
   * Route middleware.
   */

  return compose(buildRoutes(config));
};
