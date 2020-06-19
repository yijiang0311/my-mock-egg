/**
 * @description 核心加载逻辑
 * @author 一江
 */
const { resolve } = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const schedule = require('node-schedule');
const Router = require('koa-router');
const { isClass, selfish } = require('./util');
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
function initRouter(application) {
  const router = new Router();
  load('app/routes', (filename, routes) => {
    const prefix = filename === 'index' ? '' : `/${filename}`;
    //application 透传到routes
    routes = typeof routes === 'function' ? routes(application) : routes;
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
        application.ctx = ctx;
        //在controller 中遍历时没有把类实例化放到app.controller中，转而用{filePath:'',methodName:''}
        //就是为了在此处实例化类的时候能将ctx传进去
        if (controller.filePath) {
          const path = `${process.cwd()}/${controller.filePath}`;
          const controllerClass = require(path);
          //application 透传到routes对应的controller类
          const ctr = selfish(new controllerClass(application));
          await ctr[controller.methodName](ctx);
        } else {
          await controller(ctx);
        }
      });
    }
  });
  return router;
}

/**
 * 想实现router.get('/',middleware, controller.test.index);这种方式
 *  以后再写吧
 * @param {*} application
 */
function initRouter2(application) {
  load('app/routes', (filename, route) => {
    const router = new Router();
    const prefix = filename === 'index' ? '' : `/${filename}`;
    router.prefix(prefix);
    application.router = router;
    console.log('router...');
    console.log(router);
    console.log(router.get.toString());
    if (typeof route === 'function') {
      console.log(application);
      route(application);
    } else {
      throw new Error('路由文件必须导出函数格式');
    }
    application.app.use(router.routes(), router.allowedMethods());
  });
}

function initController(application) {
  const controllers = {};
  load('app/controller', (filename, controllerModes) => {
    if (isClass(controllerModes)) {
      //将application.controller中存入的值为这种格式 {filePath:'',methodName:''}
      //此处不实例化controller类，等到路由的时候再实例化，为了将ctx传给application
      controllers[filename] = {};
      const ctr = new controllerModes(application);
      const names = Object.getOwnPropertyNames(Object.getPrototypeOf(ctr));
      for (let name of names) {
        if (name !== 'constructor') {
          controllers[filename][name] = {
            filePath: `app/controller/${filename}`,
            methodName: name,
          };
        }
      }
      //selfish函数解决class里面的方法被提取出来单独使用的时候this的指向问题
      //这个时候传application,会导致在controller里面拿this.ctx的时候undefined
      //因为这个时候还没有将ctx挂载到application,但是可以通过this.app.ctx拿到ctx
      //这里不用下面这行代码是因为想保持跟egg一样的使用ctx
      // controllers[filename] = selfish(new controllerModes(application));
    } else {
      controllers[filename] = controllerModes;
    }
  });
  return controllers;
}

function initService(application) {
  const services = {};
  load('app/service', (filename, serviceClass) => {
    //application 透传到service,这样service必须是个函数
    services[filename] = selfish(new serviceClass(application));
  });
  return services;
}

function loadConfig(application) {
  const env = application.env;
  const dirPath = `${process.cwd()}/config`;
  const filename = `config.${env}`;
  const baseConf = require(`${dirPath}/config.default`);
  const envConf = require(`${dirPath}/${filename}`);
  const conf = { ...baseConf, ...envConf, env };
  if (conf.db) {
    // application.db=new Sequelize(conf.db)
    application.model = {};
    load('app/model', (filename, model) => {
      application.model[filename] = model;
    });
  }
  if (conf.middleware) {
    //安装配置文件中的中间件列表加载中间件
    conf.middleware.forEach((mid) => {
      const path = `${process.cwd()}/app/middleware/${mid}`;
      application.app.use(require(path));
    });
  }
  //定时任务 也可以放在配置文件中进行配置是否启用
  if (conf.schedule) {
    conf.schedule.forEach((scheduleName) => {
      const path = `${process.cwd()}/app/schedule/${scheduleName}`;
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
