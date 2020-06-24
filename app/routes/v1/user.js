module.exports = (app) => ({
  'post /login': app.controller.v1.user.login,
  // 'post /login': app.controller.example.new,
});
