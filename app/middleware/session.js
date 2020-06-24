const session = require('koa-generic-session');
const redisStore = require('koa-redis');

//session 默认配置
const defaultConfig = {
  key: 'weibo.sid', // cookie name 默认是 `koa.sid`
  prefix: 'weibo:sess:', // redis key 的前缀，默认是 `koa:sess:`
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 单位 ms
  },
  redisStore: {
    all: '127.0.0.1:6379',
  },
};
module.exports = (config = defaultConfig) =>
  session({
    ...config,
    store: redisStore({
      ...config.redisStore,
    }),
  });
