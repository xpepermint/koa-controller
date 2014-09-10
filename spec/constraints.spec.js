var routes = require('..');
var koa = require('koa');
var request = require('request');

describe('constraints', function() {

  beforeEach(function() {
    this.port = 3001;
    this.url = 'http://localhost:'+this.port;
    this.app = koa();
    this.app.use(routes({
      routesPath: __dirname+'/../example/routes.js',
      controllerPath: __dirname+'/../example/{controller}.js',
      constraintPath: __dirname+'/../example/{constraint}.js'
    }));
    this.server = this.app.listen(this.port);
  });

  afterEach(function() {
    if (this.server) this.server.close();
  });

  it('should allow authenticated client', function(done) {
    request.get(this.url+'/secure', {
      headers: { 'Authorization': 'Basic base64' }
    }, function(err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body).toEqual("secret");
      done();
    }.bind(this));
  });

  it('should restrict unauthenticated client', function(done) {
    request.get(this.url+'/secure', function(err, res, body) {
      expect(res.statusCode).toBe(401);
      done();
    }.bind(this));
  });

});
