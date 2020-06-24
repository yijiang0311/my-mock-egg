/**
 * @description 核心加载逻辑
 * @author 一江
 */
const { resolve } = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const schedule = require('node-schedule');
const Router = require('koa-router');
const requireDirectory = require('require-directory');
const { validate } = require('./lib/index');
const { isClass, selfish, firstUpper } = require('./util');
function load(dir, cb) {
  // const dirPath = resolve(__dirname,`../app/${dir}`)
  const dirPath = `${process.cwd()}/${dir}`;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const info = fs.statSync(`${dirPath}/${file}`);
    if (info.isDirectory()) {
      const childDir = `${dir}/${file}`;
      load(childDir, cb);
    } else {
      const filename = file.replace('.js', '');
      const fileContent = require(`${dirPath}/${filename}`);
      cb(filename, fileContent);
    }
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
  const visitor = (routes, joinedPath, filename) => {
    let prefix = joinedPath.replace(`${process.cwd()}/app/routes`, '');
    const reg = /\.js$/;
    prefix = prefix.replace(reg, '');
    prefix = prefix.replace(/index$/, '');
    // filename = filename.replace('.js', '');
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
        ctx.validate = validate(ctx);
        //在controller 中遍历时没有把类实例化放到app.controller中，转而用{filePath:'',methodName:''}
        //就是为了在此处实例化类的时候能将ctx传进去
        if (!controller) {
          const errorMessage = `路由${prefix}${url}对应的controller没有声明，如已经声明请检查是否exports`;
          throw new Error(errorMessage);
        }
        if (controller.filePath) {
          const path = `${controller.filePath}`;
          const controllerClass = require(path);
          //application 透传到routes对应的controller类
          const ctr = selfish(new controllerClass(application));
          await ctr[controller.methodName](ctx);
        } else {
          await controller(ctx);
        }
      });
    }
  };
  requireDirectory(module, '../app/routes', { visit: visitor });
  return router;
}

function initController(application) {
  const visitor = (controllerModes, joinedPath, filename) => {
    if (isClass(controllerModes)) {
      //将application.controller中存入的值为这种格式 {filePath:'',methodName:''}
      //此处不实例化controller类，等到路由的时候再实例化，为了将ctx传给application
      const ctr = new controllerModes(application);
      const names = Object.getOwnPropertyNames(Object.getPrototypeOf(ctr));
      const tmpObj = {};
      for (let name of names) {
        if (name !== 'constructor') {
          tmpObj[name] = {
            filePath: joinedPath,
            methodName: name,
          };
        }
      }
      return tmpObj;
      //selfish函数解决class里面的方法被提取出来单独使用的时候this的指向问题
      //这个时候传application,会导致在controller里面拿this.ctx的时候undefined
      //因为这个时候还没有将ctx挂载到application,但是可以通过this.app.ctx拿到ctx
      //这里不用下面这行代码是因为想保持跟egg一样的使用ctx
      // return selfish(new controllerModes(application));
    }
  };
  const controllers = requireDirectory(module, '../app/controller', {
    visit: visitor,
  });
  return controllers;
}

function initService(application) {
  const visitor = (serviceClass) => {
    return selfish(new serviceClass(application));
  };
  const services = requireDirectory(module, '../app/service', {
    visit: visitor,
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
  if (conf.sequelize) {
    // application.sequelize=new Sequelize(conf.sequelize)
    const renamer = function (name) {
      return firstUpper(name);
    };
    application.model = requireDirectory(module, '../app/model', {
      rename: renamer,
    });
  }
  if (conf.middleware) {
    //安装配置文件中的中间件列表加载中间件
    conf.middleware.forEach((mid) => {
      if (mid === 'session') {
        //if config.session.cookie.signed===true （默认） 则必须设置app.keys
        application.app.keys = conf.keys;
      }
      const path = `${process.cwd()}/app/middleware/${mid}`;
      //中间件需写成可以入参的形式(options)=>async (ctx,next)=>{}
      application.app.use(require(path)(conf[mid]));
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
