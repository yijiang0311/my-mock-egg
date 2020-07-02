/**
 * @description 验证token是否正确
 * @author 一江
 */
const jwt = require('jsonwebtoken');
const { Forbidden } = require('../../core/lib/http-exception');

module.exports = (options) => async (ctx, next) => {
  const bearerToken = ctx.headers.authorization;
  console.log('token........', bearerToken);
  //获取的authorization 格式为：Bearer <token>
  const token = bearerToken.split(' ')[1];
  let errMsg = 'token不合法';
  try {
    var decode = jwt.verify(token, options.secret);
    console.log('decode......', decode);
    //使用了koa-jwt 的话默认会将decode存到ctx.state.user
    // ctx.auth = {
    //   uid: decode.uid,
    //   scope: decode.scope,
    // };
  } catch (error) {
    console.log(error);
    if (error.name == 'TokenExpiredError') {
      errMsg = 'token已过期';
    }
    throw new Forbidden(errMsg);
  }
  await next();
};
