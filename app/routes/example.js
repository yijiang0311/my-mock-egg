const testMiddleware = require('../middleware/test');

module.exports = (app) => ({
  'get /': app.controller.example.index,
  'get /:id': app.controller.example.detail,
  'post /': app.controller.example.new,
  'put /:id': app.controller.example.update,
  // 'get /:id': [app.controller.example.detail],
  // 'get /:id': [testMiddleware(123), app.controller.example.detail],
});
