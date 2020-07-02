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
 const testMiddleware = require('../middleware/test');

module.exports = (app) => ({
//支持以下方式建立路由
  'get /': app.controller.test.index,
  // 'get /:id': app.controller.test.detail,
  // 'get /:id': [app.controller.test.detail],
  'get /:id': [testMiddleware(123), app.controller.test.detail],
});

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

### validate 参数校验写法

    参数校验提供了两种写法(使用的是[parameter]):
      1、装饰器写法
          @params传入的是ctx.params的校验规则，
          @body传入的是ctx.request.body的校验规则，
          @query传入的是ctx.request.query的校验规则
          @validate则可以传入body,params,query三种的校验规则
      2、ctx.validate(rule,data)
         data可以不传，get,head请求默认是ctx.query，其他请求默认是ctx.request.body
    使用时不用额外处理异常情况，默认已经处理了，固定返回res.code ===100004,比如如下：
    ```
    {
      "message": "[{\"message\":\"should match /^\\\\d+$/\",\"code\":\"invalid\",\"field\":\"id\"}]",
      "code": 100004,
      "success": false
    }
    ```

```
//文件路径： app/controller/example.js
const BaseController = require('../core/_base_controller');
const { validate, params,body,query } = require('../core/my-decorator');

class ExampleController extends BaseController {
  //@params传入的是ctx.params的校验规则，
  //@body传入的是ctx.request.body的校验规则，
  //@query传入的是ctx.request.query的校验规则
  @params({
    id: 'id',
  })
  async detail() {
    const { app, service, ctx, config } = this;
    const id = ctx.params.id;
    const all = await service.example.detail(id);
    this.success(all);
  }
  //@validate则可以传入body,params,query三种的校验规则
  @validate({ body: { username: 'string', email: 'email' },query:{id:'id'},params:{id:'id;} })
  async new() {
    const { ctx, service } = this;
    // post请求默认校验的是ctx.request.body
    // ctx.validate({ username: 'string', email: 'email' });
    const { username, email } = ctx.request.body;
    try {
      const res = await service.example.new({ username, email });
      this.success(res);
    } catch (error) {
      console.error(error.message, error.errors);
      const err0 = error.errors[0];
      this.registerFailed(error.message);
    }
  }
}

module.exports = ExampleController;
```

### 测试

    测试选择的是 mocha + supertest + power-assert + intelli-espower-loader

### test example

test/server.js

```
const request = require('supertest');
const server = require('../app').app.callback();

module.exports = request(server);

```

test/app/controller/example.test.js

```
const assert = require('assert');
const server = require('../../server');

describe('app/controller/example', () => {
  describe('get /example/1', async () => {
    it('成功时应返回code 0 ', async () => {
      const res = await server.get('/example/1');
      assert(res.body.code === 0);
    });
  });
  describe('post /example/update', async () => {
    it('成功时应返回code 0 ', async () => {
      const res = await (await server.post('/example/1'))
        .set('Accept', 'application/json')
        .send({ name: 'zyi' });
      assert(res.body.code === 0);
    });
  });
});

```



框架已经搭好了，往里面写业务代码就行了
