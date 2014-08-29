'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');
let parser = require('./parser');
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

  let options = _.merge({
    configPath: process.cwd()+'/config/routes.js',
    controllerPath: process.cwd()+'/app/controllers/{controller}.js',
    logger: false
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
   * @return {array}
   */

  function buildRoutes() {
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
   * Returns koa middleware generator.
   *
   * @return {generator}
   */

  function buildLogger() {
    var logger = options.logger;
    return function*(next) {
      if (!logger) return yield next;
      logger('koa-controller', '<==', this.method+' '+this.path+', params: '+JSON.stringify(_.merge({}, this.request.body, this.query)));
      yield next;
      logger('koa-controller', '==>', 'status: '+this.status);
    };
  }

  /*
   * Route middleware.
   */

  return compose([buildLogger()].concat(buildRoutes()));
};
