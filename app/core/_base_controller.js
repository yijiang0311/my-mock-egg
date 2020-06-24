const { Controller } = require('../../core/lib/index');

class BaseController extends Controller {
  success(data) {
    this.ctx.body = {
      success: true,
      code: 0,
      data,
    };
  }
  notFound(message = '资源未找到', code = 100001, status = 404) {
    this.ctx.status = status;
    this.ctx.body = {
      success: false,
      code,
      message,
    };
  }
  authFailed(message = '授权失败', code = 100002, status = 401) {
    this.ctx.status = status;
    this.ctx.body = {
      success: false,
      message,
      code,
    };
  }
  forbidden(message = '禁止访问', code = 100003, status = 403) {
    this.ctx.status = status;
    this.ctx.body = {
      success: false,
      message,
      code,
    };
  }
  paramError(message = '参数错误', code = 100004, status = 422) {
    this.ctx.status = status;
    this.ctx.body = {
      success: false,
      message,
      code,
    };
  }
  registerFailed(message = '注册失败', code = 100005) {
    this.ctx.body = {
      success: false,
      code,
      message,
    };
  }
  loginFailed(message = '登录失败', code = 100006) {
    this.ctx.body = {
      success: false,
      code,
      message,
    };
  }
}

module.exports = BaseController;
