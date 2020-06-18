const testMiddleware = require('../middleware/test');

module.exports = (app) => ({
  'get /': app.controller.test.index,
  'get /:id': app.controller.test.detail,
  // 'get /:id': [app.controller.test.detail],
  // 'get /:id': [testMiddleware(123), app.controller.test.detail],
});
