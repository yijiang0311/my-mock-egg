//config被挂载到了全局，global.config.XXX获取，同时config也被挂载到了Controller,Service类的实例上详见readme
const config = {
  sequelize: {
    dialect: 'mysql',
    host: 'localhost',
    database: 'kkb',
    username: 'root',
    password: 'zhongyi1',
  },
  //中间件 这里的（全局）中间件需写成可以入参的形式(options)=>async (ctx,next)=>{}
  middleware: ['exception', 'logger', 'parser', 'static', 'session'],
  keys: [
    'sdfasdfasd!@%#^#&*@889923asfasd&^%#@@&15736439663',
    'ashdfasd#%@%#*@%!*%@*@^sfhsdhfsd12737536!^@&@%@fjs',
  ],
  session: {
    key: 'weibo.sid', // cookie name 默认是 `koa.sid`
    prefix: 'weibo:sess:', // redis key 的前缀，默认是 `koa:sess:`
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 单位 ms
      // signed: false,
    },
    redisStore: {
      all: '127.0.0.1:6379',
    },
  },
  secretKeys: {
    CRYPTO_SECRET_KEY: 'SD1df#&%#$dd23uis_sd$@asf32423',
    SESSION_SECRET_KEY: 'UIsssdf#$$326d_f_7878#sR$',
  },
  //定时任务
  // schedule:['log']
};

module.exports = config;
