const BaseController = require('../core/_base-controller');

class User extends BaseController {
  async userList(app) {
    console.log('all');
    const all = await app.$service.user.getList();
    app.ctx.body = all;
  }
  async userdetail(app) {
    const id = app.ctx.params.id;
    console.log(id);
    app.ctx.body = {
      id,
    };
  }
}

module.exports = User;
