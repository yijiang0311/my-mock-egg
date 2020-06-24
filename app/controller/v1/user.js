const BaseController = require('../../core/_base_controller');

class User extends BaseController {
  async login() {
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;
    ctx.validate({ username: 'string', password: 'string' });
    const user = await service.user.getUserInfo({ username, password });
    if (!user) {
      //登录失败
      this.loginFailed('用户名或者密码错误');
      return;
    }
    console.log('ctx.session......', ctx.session);
    if (ctx.session.userInfo == null) {
      ctx.session.userInfo = user;
    }
    this.success();
  }
}

module.exports = User;
