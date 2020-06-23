const { HttpException } = require('../../core/lib/http-exception');

const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
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
