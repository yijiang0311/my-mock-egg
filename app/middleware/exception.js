const { HttpException } = require('../../core/lib/http-exception');

const catchError = (options) => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    //使用了koa-jwt中间件，如果匹配的路由没有携带token将会触发401，此时的ctx.status===401
    if (error.status === 401) {
      // console.log('触发401');
    }
    const isHttpException = error instanceof HttpException;
    const isDev = global.config.env === 'dev';
    if (isDev && !isHttpException) {
      throw error;
    }
    if (isHttpException) {
      ctx.status = error.status;
      ctx.body = {
        message: error.message,
        code: error.code,
        success: error.success,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        message: '服务器错误',
        success: false,
        code: 10000,
      };
    }
    console.log('catch error');
    console.log(error);
  }
};

module.exports = catchError;
