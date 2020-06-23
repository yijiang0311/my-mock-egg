/**
 * @description http异常类
 * @author 一江
 */

class HttpException extends Error {
  constructor(
    message = '服务器异常',
    code = 100000,
    status = 500,
    success = false
  ) {
    super();
    this.code = code;
    this.status = status;
    this.message = message;
    this.success = success;
  }
}

class NotFound extends HttpException {
  constructor(message = '资源未找到', code = 100001, status = 404) {
    super();
    this.message = message;
    this.code = code;
    this.status = status;
  }
}

class ParameterException extends HttpException {
  constructor(message = '参数错误', code = 100004, status = 422) {
    super();
    this.status = status;
    this.message = message;
    this.code = code;
  }
}
class AuthFailed extends HttpException {
  constructor(message = '授权失败', code = 100002, status = 401) {
    super();
    this.status = status;
    this.message = message;
    this.code = code;
  }
}
class Forbidden extends HttpException {
  constructor(message = '禁止访问', code = 100003, status = 403) {
    super();
    this.status = status;
    this.message = message;
    this.code = code;
  }
}

module.exports = {
  HttpException,
  NotFound,
  ParameterException,
  AuthFailed,
  Forbidden,
};
