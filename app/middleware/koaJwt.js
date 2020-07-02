const koaJwt = require('koa-jwt');

//If the token is valid, ctx.state.user (by default) will be set with the JSON object decoded to be used by later middleware for authorization and access control.
module.exports = (options) => {
  const { unless, ...otherOpts } = options;
  return koaJwt(otherOpts).unless(unless);
};
