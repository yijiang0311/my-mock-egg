module.exports = (app) => ({
  'get /': app.controller.user.userList,
  // 'get /:id': app.controller.user.userDetail,
});
