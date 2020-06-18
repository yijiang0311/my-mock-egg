const Router = require('koa-router');

const router = new Router();
console.log(router.methods);
const methods = router.methods;
console.log(Router.toString());
console.log(router.routes());
methods.forEach((method) => {
  router[method] = (...arg) => {
    console.log(...arg);
    //做一些路由之前的操作
    router[method.toLowerCase()](...arg);
  };
});
methods.forEach((method) => {
  router[method.toLowerCase()] = router[method];
});

module.exports = router;
