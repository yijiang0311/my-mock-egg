/**
 * @description http异常类
 * @author 一江
 */

class HttpException extends Error {
  constructor(
    msg = '服务器异常',
    error_code = 100000,
    status = 500,
    success = false
  ) {
    super();
    this.error_code = error_code;
    this.status = status;
    this.msg = msg;
    this.success = success;
  }
}

class Success extends HttpException {
  constructor(msg = 'ok', error_code = 0, status = 201, success = true) {
    super();
    this.msg = msg;
    this.error_code = error_code;
    this.status = status;
    this.success = success;
  }
}

class NotFound extends HttpException {
  constructor(msg = '资源未找到', error_code = 100001, status = 404) {
    super();
    this.msg = msg;
    this.error_code = error_code;
    this.status = status;
  }
}

class ParameterException extends HttpException {
  constructor(msg = '参数错误', error_code, status = 400) {
    super();
    this.status = status;
    this.msg = msg;
    this.error_code = error_code;
  }
}
class AuthFailed extends HttpException {
  constructor(msg = '授权失败', error_code = 100002, status = 401) {
    super();
    this.status = status;
    this.msg = msg;
    this.error_code = error_code;
  }
}
class Forbidden extends HttpException {
  constructor(msg = '禁止访问', error_code = 100003, status = 403) {
    super();
    this.status = status;
    this.msg = msg;
    this.error_code = error_code;
  }
}

module.exports = {
  HttpException,
  Success,
  NotFound,
  ParameterException,
  AuthFailed,
  Forbidden,
};
