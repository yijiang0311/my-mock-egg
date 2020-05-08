const { resolve } = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");
const schedule = require('node-schedule')
const Router = require("koa-router");
function load(dir, cb) {
  // const dirPath = resolve(__dirname,`../app/${dir}`)
  const dirPath = `${process.cwd()}/${dir}`;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filename = file.replace(".js", "");
    const fileContent = require(`${dirPath}/${filename}`);
    cb(filename, fileContent);
  });
}

function initRouter(app) {
  const router = new Router();
  load("app/routes", (filename, routes) => {
    const prefix = filename === "index" ? "" : `/${filename}`;
    //app 透传到routes
    routes = typeof routes === "function" ? routes(app) : routes;
    for (let key of Object.keys(routes)) {
      const [method, url] = key.split(" ");
      // router[method](`${prefix}${url}`,routes[key])
      router[method](`${prefix}${url}`, async (ctx) => {
        app.ctx = ctx;
        //app 透传到routes对应的controller函数
        await routes[key](app);
      });
    }
  });
  return router;
}

function initController() {
  const controllers = {};
  load("app/controller", (filename, controllerModes) => {
    controllers[filename] = controllerModes;
  });
  return controllers;
}

function initService(app) {
  const services = {};
  load("app/service", (filename, service) => {
    //app 透传到service,这样service必须是个函数
    services[filename] = service(app);
  });
  return services;
}

function loadConfig(app) {
  load("config", (filename, conf) => {
    if (conf.db) {
      // app.$db=new Sequelize(conf.db)
      app.$model = {};
      load("app/model", (filename, model) => {
        app.$model[filename] = model;
      });
    }
    if(conf.middleware){
      //安装配置文件中的中间件列表加载中间件
      conf.middleware.forEach((mid)=>{
        const path = `${process.cwd()}/app/middleware/${mid}`
        app.$app.use(require(path))
      })
    }
    //定时任务 也可以放在配置文件中进行配置是否启用
    if(conf.schedule){
      conf.schedule.forEach((scheduleName)=>{
        const path = `${process.cwd()}/app/schedule/${scheduleName}`
        console.log(path);
        const scheduleMod = require(path)
        schedule.scheduleJob(scheduleMod.interval,scheduleMod.handler)
      })
    }
  });
}

function initSchedule() {
  // 读取控制器目录
  load("app/schedule", (filename, scheduleConfig) => {
    schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
  });
}

module.exports = {
  initRouter,
  initController,
  initService,
  loadConfig,
  initSchedule
};
