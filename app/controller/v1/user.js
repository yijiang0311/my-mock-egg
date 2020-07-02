const BaseController = require('../../core/_base_controller');

class User extends BaseController {
  async register() {
    const { ctx, service } = this;
    const { username, password, email } = ctx.request.body;
    ctx.validate({ username: 'string', password: 'string', email: 'email' });
    // 查找该邮箱是否已经被注册
    const user = await service.user.getUserInfo({ username });
    const user2 = await service.user.getUserInfo({ email });
    if (!user && !user2) {
      try {
        const res = await service.user.register({ username, password, email });
        if (res) {
          this.success();
        }
      } catch (error) {
        this.registerFailed('注册失败，请稍后重试');
      }
    } else {
      this.registerFailed('该用户名或者邮箱已经被注册了');
    }
  }
  /**
   * 利用session-cookie登录，需要开启session中间件，需要启动redis服务
   */
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
    if (ctx.session.userInfo == null) {
      ctx.session.userInfo = user;
    }
    this.success();
  }
  /**
   * 利用token验证，jsonwebtoken koa-jwt
   */
  async loginWithJwt() {
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;
    ctx.validate({ username: 'string', password: 'string' });
    const user = await service.user.getUserInfo({ username, password });
    if (!user) {
      //登录失败
      this.loginFailed('用户名或者密码错误');
      return;
    }
    const token = await service.user.generateToken(user.id, 8);
    console.log('token.......', token);
    this.success({ token });
  }
  async getUserInfo() {
    const { ctx, service } = this;
    console.log(ctx.state.user);
    console.log(ctx.auth);
    const uid = ctx.state.user.uid;
    const user = await service.user.getUserInfo({ id: uid });
    this.success({ info: user });
  }
}

module.exports = User;
