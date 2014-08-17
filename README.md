# koa-controller

MVC-style implementation of routes and controllers for [Koa](https://github.com/koajs/koa), based on a simple route middleware [koa-route](https://github.com/koajs/route).

## Installation

Install the [npm](https://www.npmjs.org/package/koa-controller) package.

```
npm install koa-controller --save
```

Attach the middleware.

```js
var controller = require('koa-controller');
app.use(controller());
```

By default the middleware expects that the controller exists at `app/controllers/{controller}.js` and the route file exists at `config/routes.js`. We can easily change the default behavior as shown bellow.

```js
app.use(controller({
  configPath: 'my/path/routes.js',
  controllerPath: 'my/controllers/{controller}.js'
}));
```

## Config

Config file is a simple key-value object where the `key` represents a route match and a `value` represents a target (e.g. controller/action). See the examples bellow.

```js
# config/routes.js
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

Controller is a simple key-value object where a `key` represents the name of an `action` and a `value` represents a generator function that processes the request. See the examples bellow.

```js
# app/controllers/users.js
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
