const {HttpException} = require('../../core/http-exception')

const catchError = async (ctx,next)=>{
  try {
    await next()
  } catch (error) {
    const isHttpException = error instanceof HttpException
    const isDev = global.config.env === 'dev'
    if(isDev && !isHttpException){
      throw error
    }
    if(isHttpException){
      ctx.status = error.status
      ctx.body={
        msg:error.msg,
        error_code:error.error_code,
        success:error.success,
      }
    }else{
      ctx.status = 500
      ctx.body={
        msg:'服务器错误',
        success:false,
        error_code:1000000001
      }
    }
    console.log('catch error');
    console.log(error);
  }
}

module.exports = catchError