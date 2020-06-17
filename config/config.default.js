const config = {
  db: {
    dialect: 'mysql',
    host: 'localhost',
    database: 'kkb',
    username: 'root',
    password: 'zhongyi1',
  },
  //中间件
  middleware: ['exception', 'logger', 'parser', 'static'],
  //定时任务
  // schedule:['log']
};

module.exports = config;
