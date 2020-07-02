module.exports = (app) => ({
  'post /login': app.controller.v1.user.login,
  'post /register': app.controller.v1.user.register,
  'post /login-with-jwt': app.controller.v1.user.loginWithJwt,
  'get /myinfo': app.controller.v1.user.getUserInfo,
  // 'post /login': app.controller.example.new,
});
