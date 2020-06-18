module.exports = (app) => ({
  'get /': app.controller.user.index,
  'get /:id': app.controller.user.detail,
});
