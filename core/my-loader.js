const { resolve } = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const schedule = require('node-schedule');
const Router = require('koa-router');
function load(dir, cb) {
  // const dirPath = resolve(__dirname,`../app/${dir}`)
  const dirPath = `${process.cwd()}/${dir}`;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filename = file.replace('.js', '');
    const fileContent = require(`${dirPath}/${filename}`);
    cb(filename, fileContent);
  });
}

/**
 * 初始化路由，是路由格式按照【使⽤ 动词+空格+路径 作为key，值是操作⽅法 】约定格式编写
 * 'get /list': async ctx=>{ctx.body=[1,2]},
 * 'get /list': [middleware1,middleware2,async ctx=>{ctx.body=[1,2]}],
 * @param {*} app
 */
function initRouter(app) {
  const router = new Router();
  load('app/routes', (filename, routes) => {
    const prefix = filename === 'index' ? '' : `/${filename}`;
    //app 透传到routes
    routes = typeof routes === 'function' ? routes(app) : routes;
    for (let key of Object.keys(routes)) {
      const [method, url] = key.split(' ');
      // router[method](`${prefix}${url}`,routes[key])
      let middlewares = routes[key];
      let controller;
      //如果有中间件的话，必须是数组格式
      if (middlewares instanceof Array) {
        controller = middlewares.pop();
      } else {
        controller = middlewares;
        middlewares = [];
      }
      router[method](`${prefix}${url}`, ...middlewares, async (ctx) => {
        app.ctx = ctx;
        //app 透传到routes对应的controller函数
        await controller(app);
      });
    }
  });
  return router;
}

/**
 * 想实现router.get('/',middleware, controller.test.index);这种方式
 *  以后再写吧
 * @param {*} app
 */
function initRouter2(app) {
  load('app/routes', (filename, route) => {
    const router = new Router();
    const prefix = filename === 'index' ? '' : `/${filename}`;
    router.prefix(prefix);
    app.router = router;
    console.log('router...');
    console.log(router);
    console.log(router.get.toString());
    if (typeof route === 'function') {
      console.log(app);
      route(app);
    } else {
      throw new Error('路由文件必须导出函数格式');
    }
    app.app.use(router.routes(), router.allowedMethods());
  });
}

function initController(app) {
  const controllers = {};
  load('app/controller', (filename, controllerModes) => {
    controllers[filename] = controllerModes;
  });
  return controllers;
}

function initService(app) {
  const services = {};
  load('app/service', (filename, service) => {
    //app 透传到service,这样service必须是个函数
    services[filename] = service(app);
  });
  return services;
}

function loadConfig(app) {
  const env = app.env;
  const dirPath = `${process.cwd()}/config`;
  const filename = `config.${env}`;
  const baseConf = require(`${dirPath}/config.default`);
  const envConf = require(`${dirPath}/${filename}`);
  const conf = { ...baseConf, ...envConf, env };
  if (conf.db) {
    // app.db=new Sequelize(conf.db)
    app.model = {};
    load('app/model', (filename, model) => {
      app.model[filename] = model;
    });
  }
  if (conf.middleware) {
    //安装配置文件中的中间件列表加载中间件
    conf.middleware.forEach((mid) => {
      const path = `${process.cwd()}/app/middleware/${mid}`;
      app.app.use(require(path));
    });
  }
  //定时任务 也可以放在配置文件中进行配置是否启用
  if (conf.schedule) {
    conf.schedule.forEach((scheduleName) => {
      const path = `${process.cwd()}/app/schedule/${scheduleName}`;
      console.log(path);
      const scheduleMod = require(path);
      schedule.scheduleJob(scheduleMod.interval, scheduleMod.handler);
    });
  }
  return conf;
}

function initSchedule() {
  // 读取控制器目录
  load('app/schedule', (filename, scheduleConfig) => {
    schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
  });
}

module.exports = {
  initRouter,
  initController,
  initService,
  loadConfig,
  initSchedule,
};
