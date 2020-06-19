<!--
 * @Author: zyi
 * @Date: 2020-05-07 15:30:19
 * @LastEditTime: 2020-05-07 15:31:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-mock-egg/readme.md
 -->

# 自己动手从 koa2 实现 MVC 分层架构 【类 egg】

### ⽬标是创建约定⼤于配置、开发效率⾼、可维护性强的项⽬架构

### 路由处理规范：

    所有路由，都要放在routes⽂件夹中 若导出路由对象，使⽤ 动词+空格+路径 作为key，值是操作⽅法 若导出函数，则函数返回第⼆条约定格式的对象

    将 controller, service,model,挂载到全局 app 上，middleware,schedule 按配置需要加载

### routes examples

```
//支持以下方式建立路由
  'get /:id': app.controller.test.detail,
  'get /:id': [app.controller.test.detail],
  'get /:id': [testMiddleware1,middleware2, app.controller.test.detail],

// 此时的app.controller.test.detail是以下格式{filePath:'',methodName:''}存在的
// 这是因为在controller 中遍历时没有把类实例化放到app.controller中，
//而是用{filePath:'',methodName:''}格式保持，然后在遍历路由的时候实例化controller类，为了将ctx 传给application,
//如此一来就可以在controller中使用this.ctx获取到ctx，详见core/my-loader.js

```

### controller examples

```
const BaseController = require('../core/_base-controller');

class Test extends BaseController {
  async index() {
    // async index(ctx){
    // ctx也可以从该函数的参数获得
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async detail() {
    // 或者 const {ctx,service,config} =this.app
    const { app, service, ctx, config } = this;
    const id = ctx.params.id;
    const all = await service.test.getAll();
    ctx.body = {
      id,
      all,
    };
  }
}
module.exports = Test;
```

### service examples

```
const BaseService = require('../core/_base_service');

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

class TestService extends BaseService {
  async getAll() {
    //ctx,service,model只能通过this.app获取到，此时通过this获取为undefiend
    //其他的，比如config 可以this.config或者this.app.config
    const { ctx } = this.app;
    console.log('getall');
    await delay(400);
    return [1, 2, 3, 4];
  }
  async getList() {
    const { model } = this.app;
    const all = await model.user.findAll();
    return all;
  }
}

module.exports = TestService;
```

框架已经搭好了，往里面写业务代码就行了
