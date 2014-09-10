var routes = require('..');
var koa = require('koa');
var request = require('request');

describe('routes', function() {

  beforeEach(function() {
    this.port = 3001;
    this.url = 'http://localhost:'+this.port;
    this.app = koa();
    this.app.use(routes({
      routesPath: __dirname+'/../example/routes.js',
      controllerPath: __dirname+'/../example/{controller}.js'
    }));
    this.server = this.app.listen(this.port);
  });

  afterEach(function() {
    if (this.server) this.server.close();
  });

  it('should handle `controller` task', function(done) {
    request.post(this.url+'/users', function(err, res, body) {
      expect(body).toEqual("create");
      request.put(this.url+'/users/1', function(err, res, body) {
        expect(body).toEqual("update:1");
        done();
      }.bind(this));
    }.bind(this));
  });

  it('should handle `redirect` task', function() {
    request.get(this.url, function(err, res, body) {
      expect(body).toEqual("index");
    });
  });

  it('should handle `function` task', function() {
    request.del(this.url+'/delete', function(err, res, body) {
      expect(body).toEqual("delete");
    });
  });

});
