module.exports = {

  '/': '/users',
  'get /users': 'controller#index',
  'post|put /users/:id?': 'controller#create',
  'delete /delete': function *() {
    this.body = 'delete';
  }

};
