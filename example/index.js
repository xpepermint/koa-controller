var routes = require('..');
var koa = require('koa');

var app = koa();
app.use(routes({
  configPath: __dirname+'/routes.js',
  controllerPath: __dirname+'/{controller}.js'
}));
app.listen(3001);
