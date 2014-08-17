var parser = require('../lib/parser');

describe('parser', function() {

  describe('parseMethods', function() {

    it('should parse `methods` from a `task string`', function() {
      expect(parser.parseMethods('POST /users')).toEqual(['post']);
      expect(parser.parseMethods('get|put /users')).toEqual(['get', 'put']);
    });

    it('should return `[get]` if a `task string` contains no method', function() {
      expect(parser.parseMethods('/users')).toEqual(['get']);
    });

  });

  describe('parsePath', function() {

    it('should parse a `path` from a `task string`', function() {
      expect(parser.parsePath('POST /users')).toBe('/users');
    });

  });

  describe('guessTask', function() {

    it('should guess the `function` task from a `target string`', function() {
      expect(parser.guessTask(function*(){})).toBe('function');
    });

    it('should guess the `controller` task from a `target string`', function() {
      expect(parser.guessTask('users#index')).toBe('controller');
    });

    it('should guess the `redirect` task from a `target string`', function() {
      expect(parser.guessTask('/go/home')).toBe('redirect');
      expect(parser.guessTask('http://google.com')).toBe('redirect');
      expect(parser.guessTask('https://google.com')).toBe('redirect');
      expect(parser.guessTask('ftp://google.com')).toBe('redirect');
    });

  });

  describe('parseController', function() {

    it('should parse a `controller` and an `action` name from a `task string`', function() {
      expect(parser.parseController('users#create')).toEqual({ controller: 'users', action: 'create' });
    });

  });

});
