var routes = require('..');
var koa = require('koa');

var app = koa();
app.use(routes({
  routesPath: __dirname+'/routes.js',
  controllerPath: __dirname+'/{controller}.js',
  constraintPath: __dirname+'/{constraint}.js'
}));
app.listen(3001);
