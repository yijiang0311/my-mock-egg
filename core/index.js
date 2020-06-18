const Koa = require('koa');
//由于中间件的顺序，catchErr应该放在最前方，所以将parser也放到middleware下面
const parser = require('koa-bodyparser');
const static = require('koa-static');
const {
  initRouter,
  initController,
  initService,
  loadConfig,
  initSchedule,
} = require('./my-loader');

class Init {
  constructor(conf) {
    this.app = new Koa(conf);
    this.env = process.env.NODE_ENV;
    this.config = loadConfig(this);
    global.config = this.config;
    this.service = initService(this);
    this.controller = initController(this);
    this.router = initRouter(this);

    this.app.use(this.router.routes());
    // initSchedule()
  }
  start(port) {
    this.app.listen(port, () => {
      console.log(`服务器启动啦。。。。端口：${port}`);
    });
  }
}

module.exports = Init;
