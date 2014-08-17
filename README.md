# koa-controller

![Build Status](https://travis-ci.org/xpepermint/koa-controller.svg?branch=master)&nbsp;[![NPM version](https://badge.fury.io/js/koa-controller.svg)](http://badge.fury.io/js/koa-controller)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/koa-controller.svg)](https://gemnasium.com/xpepermint/koa-controller)

MVC-style implementation of routes and controllers for [Koa](https://github.com/koajs/koa), based on a simple route middleware [koa-route](https://github.com/koajs/route).

## Installation

Install the [npm](https://www.npmjs.org/package/koa-controller) package.

```
npm install koa-controller --save
```

Attach the middleware.

```js
var koa = require('koa');
var app = koa();
var controller = require('koa-controller');
app.use(controller());
app.listen(3000);
```

By default the middleware expects that the controller exists at `app/controllers/{controller}.js` and that the config file exists at `config/routes.js`. We can easily change the default behavior as shown bellow.

```js
app.use(controller({
  configPath: 'my/path/routes.js',
  controllerPath: 'my/controllers/{controller}.js'
}));
```

## Config

Config file is a simple key-value object where the `key` represents a `route` and a `value` represents a `task` (e.g. controller/action). See the examples bellow.

```js
// config/routes.js
module.exports = {

  // controller#action
  '/users/:id?': 'users#find',
  'post /users': 'users#create',
  'put|post /users/:id': 'users#update',
  'get /users/:id/words/:slug*': 'events#words',
  'get /event/:slug+': 'events#index',

  // redirections
  'get /to/google': 'http://www.google.com',
  'get /to/home': '/',

  // using a function
  'get /events/:id': function *(id) { this.body = ... },

  ...
};
```

Check [koa-route](https://github.com/koajs/route) and [path-to-regexp](https://github.com/component/path-to-regexp) for details.

## Controller

Controller is a simple key-value object where a `key` represents the name of an `action` and a `value` represents a generator function that processes the request. See the controller example bellow.

```js
// app/controllers/users.js
module.exports = {

  find: function*() {
    this.body = ...;
  },

  update: function*(id) {
  },

  words: function*(id, slug) {
  },

  ...
};
```

Notice the `this.body` call? Every `action` inside a controller has access to [koa context](http://koajs.com/#context). Check [koa-route](https://github.com/koajs/route) for details.
